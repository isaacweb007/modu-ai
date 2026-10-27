-- Staff links are separate, expiring capabilities. No direct browser table/RPC access.
create table public.modu_staff (
 id uuid primary key default gen_random_uuid(),
 store_id uuid not null references public.modu_stores(id) on delete cascade,
 name text not null check(length(name) between 1 and 30),
 role text not null check(role in ('floor','kitchen','custom')),
 permissions text[] not null default '{}',
 token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),
 revision bigint not null default 1,
 expires_at timestamptz not null default (now()+interval '30 days'),
 revoked_at timestamptz, created_at timestamptz not null default now()
);
create index modu_staff_store_active on public.modu_staff(store_id,created_at) where revoked_at is null;
create table public.modu_staff_audit (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 actor_id uuid, actor text not null, action text not null, target text not null, created_at timestamptz not null default now()
);
create index modu_staff_audit_store_time on public.modu_staff_audit(store_id,created_at desc);
alter table public.modu_staff enable row level security;
alter table public.modu_staff_audit enable row level security;
revoke all on public.modu_staff,public.modu_staff_audit from public,anon,authenticated;
grant all on public.modu_staff,public.modu_staff_audit to service_role;
create policy deny_direct_client_access on public.modu_staff as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_direct_client_access on public.modu_staff_audit as restrictive for all to anon,authenticated using(false) with check(false);
create trigger modu_staff_changed after insert or update on public.modu_staff for each row execute function modu_private.notify_change();
create trigger modu_staff_audit_changed after insert on public.modu_staff_audit for each row execute function modu_private.notify_change();

create function modu_private.staff_permissions(p_input jsonb) returns text[] language sql immutable security invoker set search_path='' as $$
 select coalesce(array_agg(p order by p),'{}'::text[]) from (
 select distinct value as p from jsonb_array_elements_text(p_input) where value=any(array['ordersView','ordersAccept','ordersPrepare','ordersServe','bookingsView','bookingsManage','requestsView','deliveryView','menuView','menuEdit','salesView','settingsView','settingsEdit'])
 ) x where case p when 'ordersAccept' then p_input ? 'ordersView' when 'ordersPrepare' then p_input ? 'ordersView' when 'ordersServe' then p_input ? 'ordersView' when 'deliveryView' then p_input ? 'ordersView' when 'bookingsManage' then p_input ? 'bookingsView' when 'menuEdit' then p_input ? 'menuView' when 'settingsEdit' then p_input ? 'settingsView' else true end;
$$;
create function modu_private.staff_member_json(m public.modu_staff) returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('id',m.id,'name',m.name,'role',m.role,'permissions',m.permissions,'revision',m.revision,'expiresAt',m.expires_at);
$$;

create function public.modu_staff_manage(p_store uuid,p_owner_hash text,p_action text,p_member uuid default null,p_data jsonb default '{}',p_hash text default null)
 returns jsonb language plpgsql security invoker set search_path='' as $$
declare m public.modu_staff; actor_name text:='owner'; begin
 if not exists(select 1 from public.modu_owners where store_id=p_store and token_hash=p_owner_hash) then raise exception 'noAccess'; end if;
 if p_action='create' then
  perform pg_advisory_xact_lock(hashtextextended(p_store::text,59));
  if (select count(*) from public.modu_staff where store_id=p_store and revoked_at is null)>=30 then raise exception 'staffLimit'; end if;
  insert into public.modu_staff(store_id,name,role,permissions,token_hash) values(p_store,btrim(p_data->>'name'),p_data->>'role',modu_private.staff_permissions(p_data->'permissions'),p_hash) returning * into m;
 else
  select * into m from public.modu_staff where store_id=p_store and id=p_member and revoked_at is null for update;
  if not found then raise exception 'revoked'; end if;
  if m.revision is distinct from (p_data->>'revision')::bigint then raise exception 'permissionConflict'; end if;
  if p_action='permissions' then
   update public.modu_staff set permissions=modu_private.staff_permissions(p_data->'permissions'),revision=revision+1 where id=m.id returning * into m;
  elsif p_action='revoke' then
   update public.modu_staff set revoked_at=now(),revision=revision+1 where id=m.id returning * into m;
  elsif p_action='rotate' then
   update public.modu_staff set token_hash=p_hash,expires_at=now()+interval '30 days',revision=revision+1 where id=m.id returning * into m;
  else raise exception 'invalid'; end if;
 end if;
 insert into public.modu_staff_audit(store_id,actor,action,target) values(p_store,actor_name,p_action,m.name);
 return modu_private.staff_member_json(m);
end $$;

create function public.modu_staff_snapshot(p_store uuid,p_member uuid,p_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare m public.modu_staff; st public.modu_stores; result jsonb; data jsonb; begin
 -- Serialize reads with revocation/permission edits; secrets never enter the projection.
 select * into m from public.modu_staff where store_id=p_store and id=p_member and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
 if not found then raise exception 'revoked'; end if;
 select * into st from public.modu_stores where id=p_store;
 result:=jsonb_build_object('member',modu_private.staff_member_json(m),'shopName',st.public_data->>'name');
 if 'ordersView'=any(m.permissions) then
  select coalesce(jsonb_agg(row_data order by created_at),'[]') into data from (
   select o.created_at,jsonb_build_object('id',o.id,'number',o.number,'status',o.status,'channel',coalesce(o.fulfillment->>'channel','dine-in'),'table',case when o.fulfillment->>'channel'='online' then null else coalesce((o.fulfillment->>'table')::int,v.table_no) end,
   'lines',(select coalesce(jsonb_agg(jsonb_build_object('itemId',l->>'itemId','quantity',l->'quantity','name',l->'name')),'[]') from jsonb_array_elements(o.lines) l))
   ||case when 'deliveryView'=any(m.permissions) and o.fulfillment->>'channel'='online' then jsonb_build_object('delivery',o.fulfillment) else '{}'::jsonb end
   ||case when 'salesView'=any(m.permissions) then jsonb_build_object('total',o.total,'payment',o.payment) else '{}'::jsonb end as row_data
   from public.modu_orders o join public.modu_visits v on v.id=o.visit_id and v.store_id=o.store_id where o.store_id=p_store order by o.created_at desc limit 500
  ) rows;
  result:=result||jsonb_build_object('orders',data);
 end if;
 if 'bookingsView'=any(m.permissions) then
  select coalesce(jsonb_agg(row_data),'[]') into data from (select jsonb_build_object('id',r.id,'date',r.date,'time',left(r.time::text,5),'partySize',r.party_size,'name',r.name,'status',r.status) row_data from public.modu_reservations r where r.store_id=p_store order by r.created_at desc limit 500) rows;
  result:=result||jsonb_build_object('bookings',data);
 end if;
 if 'requestsView'=any(m.permissions) then
  select coalesce(jsonb_agg(row_data),'[]') into data from (select jsonb_build_object('id',r.id,'table',v.table_no,'text',r.payload->'detail'->>'question') row_data from public.modu_messages r join public.modu_visits v on v.id=r.visit_id and v.store_id=r.store_id where r.store_id=p_store and r.kind='event' and r.payload->>'type' in ('eventStaff','complaint') and not r.reviewed order by r.created_at desc limit 200) rows;
  result:=result||jsonb_build_object('requests',data);
 end if;
 if 'menuView'=any(m.permissions) then
  select coalesce(jsonb_agg(jsonb_build_object('id',i->>'id','name',i->'name','available',coalesce((i->>'available')::boolean,true))),'[]') into data from jsonb_array_elements(st.menu) i;
  result:=result||jsonb_build_object('items',data);
 end if;
 if 'salesView'=any(m.permissions) then result:=result||jsonb_build_object('sales',(select coalesce(sum(total),0) from public.modu_orders where store_id=p_store and payment='paid')); end if;
 if 'settingsView'=any(m.permissions) then result:=result||jsonb_build_object('settings',jsonb_build_object('name',st.public_data->>'name','phone',st.public_data->>'phone')); end if;
 return result;
end $$;

create function public.modu_staff_action(p_store uuid,p_member uuid,p_hash text,p_action text,p_data jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare m public.modu_staff; target_id uuid; permission text; prior text; current_status text; target text; st public.modu_stores; begin
 -- The lock is retained until mutation + audit commit. A queued revocation wins before later work.
 select * into m from public.modu_staff where store_id=p_store and id=p_member and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for update;
 if not found then raise exception 'revoked'; end if;
 if p_action='order' then
  permission:=case p_data->>'next' when 'accepted' then 'ordersAccept' when 'preparing' then 'ordersPrepare' when 'ready' then 'ordersPrepare' when 'completed' then 'ordersServe' end;
  if permission is null or not (permission=any(m.permissions) and 'ordersView'=any(m.permissions)) then raise exception 'noAccess'; end if;
  prior:=case p_data->>'next' when 'accepted' then 'pending' when 'preparing' then 'accepted' when 'ready' then 'preparing' when 'completed' then 'ready' end;
  target_id:=(p_data->>'id')::uuid;
  select status,'#'||number into current_status,target from public.modu_orders where store_id=p_store and id=target_id for update;
  if not found then raise exception 'noAccess'; end if;
  if current_status=p_data->>'next' then return jsonb_build_object('ok',true,'unchanged',true); end if;
  if current_status<>prior then raise exception 'ownerConflict'; end if;
  update public.modu_orders set status=p_data->>'next' where store_id=p_store and id=target_id;
 elsif p_action='booking' then
  if not ('bookingsView'=any(m.permissions) and 'bookingsManage'=any(m.permissions)) then raise exception 'noAccess'; end if;
  target_id:=(p_data->>'id')::uuid;
  select status,'#R'||number into current_status,target from public.modu_reservations where store_id=p_store and id=target_id for update;
  if not found then raise exception 'noAccess'; end if;
  if current_status='confirmed' then return jsonb_build_object('ok',true,'unchanged',true); end if;
  if current_status<>'pending' then raise exception 'ownerConflict'; end if;
  update public.modu_reservations set status='confirmed' where store_id=p_store and id=target_id;
 elsif p_action='menu' then
  if not ('menuView'=any(m.permissions) and 'menuEdit'=any(m.permissions)) then raise exception 'noAccess'; end if;
  if jsonb_typeof(p_data->'available') is distinct from 'boolean' then raise exception 'invalid'; end if;
  select * into st from public.modu_stores where id=p_store for update;
  if not exists(select 1 from jsonb_array_elements(st.menu) i where i->>'id'=p_data->>'id') then raise exception 'noAccess'; end if;
  update public.modu_stores set menu=(select jsonb_agg(case when i->>'id'=p_data->>'id' then i||jsonb_build_object('available',p_data->'available') else i end order by n) from jsonb_array_elements(st.menu) with ordinality as x(i,n)),revision=revision+1,updated_at=now() where id=p_store;
  target:=p_data->>'id';
 elsif p_action='settings' then
  if not ('settingsView'=any(m.permissions) and 'settingsEdit'=any(m.permissions)) then raise exception 'noAccess'; end if;
  if coalesce(p_data->>'phone','') !~ '^[+0-9 ()-]{7,30}$' then raise exception 'invalid'; end if;
  update public.modu_stores set public_data=public_data||jsonb_build_object('phone',btrim(p_data->>'phone')),revision=revision+1,updated_at=now() where id=p_store;
  target:='shop phone';
 else raise exception 'noAccess'; end if;
 insert into public.modu_staff_audit(store_id,actor_id,actor,action,target) values(p_store,m.id,m.name,p_action||case when p_action='order' then ':'||(p_data->>'next') else '' end,target);
 return jsonb_build_object('ok',true);
end $$;

revoke all on function modu_private.staff_permissions(jsonb),modu_private.staff_member_json(public.modu_staff) from public,anon,authenticated;
grant usage on schema modu_private to service_role;
grant execute on function modu_private.staff_permissions(jsonb),modu_private.staff_member_json(public.modu_staff) to service_role;
revoke all on function public.modu_staff_manage(uuid,text,text,uuid,jsonb,text),public.modu_staff_snapshot(uuid,uuid,text),public.modu_staff_action(uuid,uuid,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.modu_staff_manage(uuid,text,text,uuid,jsonb,text),public.modu_staff_snapshot(uuid,uuid,text),public.modu_staff_action(uuid,uuid,text,text,jsonb) to service_role;
