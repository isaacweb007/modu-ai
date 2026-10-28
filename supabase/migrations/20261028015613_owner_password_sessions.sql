-- Shop-scoped password authentication. The Edge API is the only caller.
-- Legacy owner keys may bootstrap a password once; they cannot access operational data.
create table public.modu_owner_passwords (
 store_id uuid primary key references public.modu_owners(store_id) on delete cascade,
 salt text not null check(salt ~ '^[a-f0-9]{32}$'), digest text not null check(digest ~ '^[a-f0-9]{64}$'),
 iterations int not null check(iterations=600000), revision bigint not null default 1,
 changed_at timestamptz not null default now()
);
create table public.modu_owner_sessions (
 token_hash text primary key check(token_hash ~ '^[a-f0-9]{64}$'),
 store_id uuid not null references public.modu_owner_passwords(store_id) on delete cascade,
 expires_at timestamptz not null default (now()+interval '12 hours'), revoked_at timestamptz,
 created_at timestamptz not null default now()
);
create index modu_owner_sessions_store on public.modu_owner_sessions(store_id);
alter table public.modu_owner_passwords enable row level security;
alter table public.modu_owner_sessions enable row level security;
revoke all on public.modu_owner_passwords,public.modu_owner_sessions from public,anon,authenticated;
grant all on public.modu_owner_passwords,public.modu_owner_sessions to service_role;
create policy deny_direct_client_access on public.modu_owner_passwords as restrictive for all to anon,authenticated using(false) with check(false);
create policy deny_direct_client_access on public.modu_owner_sessions as restrictive for all to anon,authenticated using(false) with check(false);
-- Existing invalidation trigger sends only store ID, never secrets.
create trigger modu_owner_sessions_changed after update on public.modu_owner_sessions for each row execute function modu_private.notify_change();

create function public.modu_owner_session_valid(p_store uuid,p_hash text) returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.modu_owner_sessions where store_id=p_store and token_hash=p_hash and revoked_at is null and expires_at>now());
$$;
create function public.modu_owner_password_setup(p_store uuid,p_legacy_hash text,p_password jsonb,p_session_hash text) returns timestamptz language plpgsql security invoker set search_path='' as $$
declare until_at timestamptz; begin
 perform 1 from public.modu_owners where store_id=p_store and token_hash=p_legacy_hash for update;
 if not found or exists(select 1 from public.modu_owner_passwords where store_id=p_store) then raise exception 'ownerAccess'; end if;
 insert into public.modu_owner_passwords(store_id,salt,digest,iterations) values(p_store,p_password->>'salt',p_password->>'digest',(p_password->>'iterations')::int);
 insert into public.modu_owner_sessions(store_id,token_hash) values(p_store,p_session_hash) returning expires_at into until_at;
 return until_at;
end $$;
create function public.modu_create_password_store(p_legacy_hash text,p_store jsonb,p_menu jsonb,p_workspace jsonb,p_password jsonb,p_session_hash text,p_seed boolean default false) returns jsonb language plpgsql security invoker set search_path='' as $$
declare sid uuid; until_at timestamptz; visit uuid; first_item jsonb; begin
 sid:=public.modu_create_store(p_legacy_hash,p_store,p_menu,p_workspace);
 until_at:=public.modu_owner_password_setup(sid,p_legacy_hash,p_password,p_session_hash);
 if p_seed and jsonb_array_length(p_menu)>0 and length(p_store->>'address')>0 and p_workspace->'manager'->>'completed'='true' then
  update public.modu_stores set published=true where id=sid;
  insert into public.modu_visits(store_id,token_hash,table_no,lang) values(sid,encode(extensions.gen_random_bytes(32),'hex'),7,'vi') returning id into visit;
  first_item:=p_menu->0;
  insert into public.modu_orders(store_id,visit_id,request_id,lines,total,fulfillment) values(sid,visit,'seed-order',jsonb_build_array(jsonb_build_object('itemId',first_item->>'id','quantity',1,'unitPrice',(first_item->>'price')::bigint,'name',first_item->'name')),(first_item->>'price')::bigint,jsonb_build_object('channel','dine-in','table',7));
  insert into public.modu_reservations(store_id,visit_id,request_id,date,time,party_size,name) values(sid,visit,'seed-booking',current_date+1,'19:00',2,'Demo · Jumo');
 end if;
 return jsonb_build_object('storeId',sid,'expiresAt',until_at);
end $$;
create function public.modu_owner_login_session(p_store uuid,p_revision bigint,p_session_hash text) returns timestamptz language plpgsql security invoker set search_path='' as $$
declare until_at timestamptz; begin
 -- The Edge verified the password at this revision. Serialize against password changes.
 perform 1 from public.modu_owner_passwords where store_id=p_store and revision=p_revision for share;
 if not found then raise exception 'ownerAccess'; end if;
 delete from public.modu_owner_sessions where store_id=p_store and (expires_at<now() or revoked_at is not null);
 insert into public.modu_owner_sessions(store_id,token_hash) values(p_store,p_session_hash) returning expires_at into until_at;
 return until_at;
end $$;
create function public.modu_owner_password_change(p_store uuid,p_hash text,p_revision bigint,p_password jsonb,p_session_hash text) returns timestamptz language plpgsql security invoker set search_path='' as $$
declare until_at timestamptz; begin
 perform 1 from public.modu_owner_passwords where store_id=p_store and revision=p_revision for update;
 if not found or not public.modu_owner_session_valid(p_store,p_hash) then raise exception 'ownerAccess'; end if;
 update public.modu_owner_passwords set salt=p_password->>'salt',digest=p_password->>'digest',iterations=(p_password->>'iterations')::int,revision=revision+1,changed_at=now() where store_id=p_store;
 update public.modu_owner_sessions set revoked_at=now() where store_id=p_store and revoked_at is null;
 insert into public.modu_owner_sessions(store_id,token_hash) values(p_store,p_session_hash) returning expires_at into until_at;
 return until_at;
end $$;
create function public.modu_owner_logout(p_store uuid,p_hash text) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 update public.modu_owner_sessions set revoked_at=now() where store_id=p_store and token_hash=p_hash and revoked_at is null;
 return true;
end $$;
revoke all on function public.modu_owner_session_valid(uuid,text),public.modu_owner_password_setup(uuid,text,jsonb,text),public.modu_create_password_store(text,jsonb,jsonb,jsonb,jsonb,text,boolean),public.modu_owner_login_session(uuid,bigint,text),public.modu_owner_password_change(uuid,text,bigint,jsonb,text),public.modu_owner_logout(uuid,text) from public,anon,authenticated;
grant execute on function public.modu_owner_session_valid(uuid,text),public.modu_owner_password_setup(uuid,text,jsonb,text),public.modu_create_password_store(text,jsonb,jsonb,jsonb,jsonb,text,boolean),public.modu_owner_login_session(uuid,bigint,text),public.modu_owner_password_change(uuid,text,bigint,jsonb,text),public.modu_owner_logout(uuid,text) to service_role;

create or replace function public.modu_staff_manage(p_store uuid,p_owner_hash text,p_action text,p_member uuid default null,p_data jsonb default '{}',p_hash text default null)
 returns jsonb language plpgsql security invoker set search_path='' as $$
declare m public.modu_staff; actor_name text:='owner'; begin
 if not public.modu_owner_session_valid(p_store,p_owner_hash) then raise exception 'noAccess'; end if;
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
