-- Requests are transactional and accessible only through the authorized Edge API.
alter table public.modu_orders drop constraint modu_orders_status_check;
alter table public.modu_orders add constraint modu_orders_status_check check(status in ('pending','accepted','preparing','ready','completed','cancelled'));
create table public.modu_amendments (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 visit_id uuid not null, target_id uuid not null, target_type text not null check(target_type in ('order','booking')),
 kind text not null check(kind in ('change','cancel')), request_id text not null,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 before_data jsonb not null, after_data jsonb, original_status text not null,
 guest_lang text not null, created_at timestamptz not null default now(),
 reviewed_at timestamptz, reviewed_by text, reviewed_member uuid,
 unique(visit_id,request_id), foreign key(store_id,visit_id) references public.modu_visits(store_id,id) on delete cascade
);
create unique index modu_amendments_one_pending on public.modu_amendments(store_id,target_type,target_id) where status='pending';
create index modu_amendments_visit on public.modu_amendments(store_id,visit_id,created_at desc);
alter table public.modu_amendments enable row level security;
revoke all on public.modu_amendments from public,anon,authenticated;
grant all on public.modu_amendments to service_role;
create policy deny_direct_client_access on public.modu_amendments as restrictive for all to anon,authenticated using(false) with check(false);
create trigger modu_amendments_changed after insert or update on public.modu_amendments for each row execute function modu_private.notify_change();

-- Orders and bookings cannot advance while a request is waiting; the row lock also serializes submission with status transitions.
create function modu_private.hold_amendment() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if old.status is distinct from new.status and exists(select 1 from public.modu_amendments a where a.store_id=old.store_id and a.target_id=old.id and a.target_type=tg_argv[0] and a.status='pending') then raise exception 'amendPending'; end if;
 return new;
end $$;
create trigger modu_order_amendment_hold before update on public.modu_orders for each row execute function modu_private.hold_amendment('order');
create trigger modu_booking_amendment_hold before update on public.modu_reservations for each row execute function modu_private.hold_amendment('booking');
revoke all on function modu_private.hold_amendment() from public,anon,authenticated;
grant execute on function modu_private.hold_amendment() to service_role;

create function public.modu_amend_submit(p_store uuid,p_visit uuid,p_target uuid,p_type text,p_kind text,p_request text,p_data jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare o public.modu_orders; b public.modu_reservations; st public.modu_stores; a public.modu_amendments; v public.modu_visits; old_data jsonb; next_data jsonb; s text; pair record; item jsonb; qty int; amount bigint:=0; lines jsonb:='[]';
begin
 select * into v from public.modu_visits where id=p_visit and store_id=p_store;
 if not found or p_type not in ('order','booking') or p_kind not in ('change','cancel') then raise exception 'invalid'; end if;
 if p_type='order' then
  select * into o from public.modu_orders where id=p_target and store_id=p_store and visit_id=p_visit for update;
  if not found then raise exception 'noAccess'; end if;
  if o.status in ('completed','cancelled') then raise exception 'ownerConflict'; end if;
  s:=o.status; old_data:=jsonb_build_object('lines',o.lines,'total',o.total);
  if p_kind='change' then
   select * into st from public.modu_stores where id=p_store for share;
   if jsonb_typeof(p_data->'cart') is distinct from 'object' or p_data->'cart'='{}'::jsonb or (select count(*) from jsonb_object_keys(p_data->'cart'))>30 then raise exception 'invalid'; end if;
   for pair in select * from jsonb_each_text(p_data->'cart') loop
    if pair.value !~ '^[0-9]{1,2}$' then raise exception 'invalid'; end if;
    qty:=pair.value::int; if qty not between 1 and 20 then raise exception 'invalid'; end if;
    select value into item from jsonb_array_elements(st.menu) where value->>'id'=pair.key;
    if item is null or coalesce((item->>'available')::boolean,true)=false then raise exception 'soldOut'; end if;
    amount:=amount+(item->>'price')::bigint*qty;
    lines:=lines||jsonb_build_array(jsonb_build_object('itemId',pair.key,'quantity',qty,'unitPrice',(item->>'price')::bigint,'name',item->'name'));
   end loop;
   next_data:=jsonb_build_object('lines',lines,'total',amount);
   if next_data=old_data then raise exception 'invalid'; end if;
  end if;
 else
  select * into b from public.modu_reservations where id=p_target and store_id=p_store and visit_id=p_visit for update;
  if not found then raise exception 'noAccess'; end if;
  if b.status='cancelled' then raise exception 'ownerConflict'; end if;
  s:=b.status; old_data:=jsonb_build_object('date',b.date,'time',left(b.time::text,5),'partySize',b.party_size,'name',b.name);
  if p_kind='change' then
   next_data:=jsonb_build_object('date',p_data->>'date','time',p_data->>'time','partySize',(p_data->>'party_size')::int,'name',b.name);
   if next_data=old_data then raise exception 'invalid'; end if;
  end if;
 end if;
 select * into a from public.modu_amendments where visit_id=p_visit and request_id=p_request;
 if found then return to_jsonb(a); end if;
 if exists(select 1 from public.modu_amendments where store_id=p_store and target_type=p_type and target_id=p_target and status='pending') then raise exception 'amendPending'; end if;
 insert into public.modu_amendments(store_id,visit_id,target_id,target_type,kind,request_id,before_data,after_data,original_status,guest_lang)
 values(p_store,p_visit,p_target,p_type,p_kind,p_request,old_data,next_data,s,v.lang) returning * into a;
 return to_jsonb(a);
end $$;

create function public.modu_amend_review(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_approve boolean)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.modu_amendments; o public.modu_orders; b public.modu_reservations; m public.modu_staff; is_owner boolean; actor text; current_status text;
begin
 is_owner:=public.modu_owner_session_valid(p_store,p_hash);
 if is_owner then actor:='owner'; else
  select * into m from public.modu_staff where id=p_member and store_id=p_store and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
  if not found or m.role<>'floor' then raise exception 'noAccess'; end if;
  actor:=m.name;
 end if;
 select * into a from public.modu_amendments where id=p_request and store_id=p_store;
 if not found then raise exception 'noAccess'; end if;
 if not is_owner and ((a.target_type='order' and not ('ordersView'=any(m.permissions) and 'ordersAccept'=any(m.permissions))) or (a.target_type='booking' and not ('bookingsView'=any(m.permissions) and 'bookingsManage'=any(m.permissions)))) then raise exception 'noAccess'; end if;
 if a.target_type='order' then
  select * into o from public.modu_orders where id=a.target_id and store_id=p_store for update;
  if not found then raise exception 'ownerConflict'; end if;
  current_status:=o.status;
  if not is_owner and o.status in ('preparing','ready') then raise exception 'ownerOnly'; end if;
 else
  select * into b from public.modu_reservations where id=a.target_id and store_id=p_store for update;
  if not found then raise exception 'ownerConflict'; end if;
  current_status:=b.status;
 end if;
 select * into a from public.modu_amendments where id=p_request and store_id=p_store for update;
 if a.status<>'pending' or current_status<>a.original_status then raise exception 'ownerConflict'; end if;
 update public.modu_amendments set status=case when p_approve then 'approved' else 'rejected' end,reviewed_at=now(),reviewed_by=actor,reviewed_member=case when is_owner then null else m.id end where id=a.id returning * into a;
 if p_approve and a.target_type='order' then
  if a.kind='cancel' then update public.modu_orders set status='cancelled' where id=o.id;
  else update public.modu_orders set lines=a.after_data->'lines',total=(a.after_data->>'total')::bigint,status=case when o.status in ('preparing','ready') then 'accepted' else o.status end where id=o.id; end if;
 elsif p_approve and a.target_type='booking' then
  if a.kind='cancel' then update public.modu_reservations set status='cancelled' where id=b.id;
  else update public.modu_reservations set date=(a.after_data->>'date')::date,time=(a.after_data->>'time')::time,party_size=(a.after_data->>'partySize')::int where id=b.id; end if;
 end if;
 return to_jsonb(a);
end $$;
revoke all on function public.modu_amend_submit(uuid,uuid,uuid,text,text,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.modu_amend_submit(uuid,uuid,uuid,text,text,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean) to service_role;

-- Enrich the existing role projection in the same transaction and retain its staff authorization lock.
alter function public.modu_staff_snapshot(uuid,uuid,text) rename to modu_staff_snapshot_base;
create function public.modu_staff_snapshot(p_store uuid,p_member uuid,p_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb; m public.modu_staff; requests jsonb;
begin
 result:=public.modu_staff_snapshot_base(p_store,p_member,p_hash);
 select * into m from public.modu_staff where id=p_member and store_id=p_store and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
 if not found then raise exception 'revoked'; end if;
 select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb) into requests from (
  select a.created_at,jsonb_build_object('id',a.id,'target_id',a.target_id,'target_type',a.target_type,'kind',a.kind,'status',a.status,'original_status',a.original_status,'created_at',a.created_at,'reviewed_at',a.reviewed_at,'reviewed_by',a.reviewed_by,'guest_lang',a.guest_lang)
  || case when m.role='floor' then jsonb_build_object('before_data',case when a.target_type='booking' then a.before_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.before_data->'lines') l)) end,
   'after_data',case when a.after_data is null then null when a.target_type='booking' then a.after_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.after_data->'lines') l)) end) else '{}'::jsonb end as data
  from public.modu_amendments a where a.store_id=p_store and ((a.target_type='order' and 'ordersView'=any(m.permissions)) or (a.target_type='booking' and 'bookingsView'=any(m.permissions))) order by a.created_at desc limit 500
 ) x;
 return result||jsonb_build_object('amendments',requests);
end $$;
revoke all on function public.modu_staff_snapshot_base(uuid,uuid,text),public.modu_staff_snapshot(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.modu_staff_snapshot_base(uuid,uuid,text),public.modu_staff_snapshot(uuid,uuid,text) to service_role;
