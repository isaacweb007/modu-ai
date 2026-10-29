-- Read receipts hold only identifiers, are scoped to an authenticated demo identity,
-- and disappear with the shop or the underlying exchange.
create table public.modu_notification_reads (
 store_id uuid not null references public.modu_stores(id) on delete cascade,
 actor_type text not null check(actor_type in ('owner','guest','staff')),
 actor_id uuid not null,
 amendment_id uuid not null references public.modu_amendments(id) on delete cascade,
 event_type text not null check(event_type in ('requested','approved')),
 read_at timestamptz not null default now(),
 primary key(store_id,actor_type,actor_id,amendment_id,event_type)
);
alter table public.modu_notification_reads enable row level security;
revoke all on public.modu_notification_reads from public,anon,authenticated;
grant all on public.modu_notification_reads to service_role;
create policy deny_direct_client_access on public.modu_notification_reads as restrictive for all to anon,authenticated using(false) with check(false);
create trigger modu_notification_reads_changed after insert on public.modu_notification_reads for each row execute function modu_private.notify_change();

create function public.modu_notification_mark(p_store uuid,p_hash text,p_actor text,p_member uuid,p_amendment uuid)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare m public.modu_staff; v public.modu_visits; a public.modu_amendments; actor_id uuid; event_type text;
begin
 if p_actor='owner' then
  if not public.modu_owner_session_valid(p_store,p_hash) then raise exception 'ownerAccess'; end if;
  actor_id:=p_store;event_type:='requested';
 elsif p_actor='guest' then
  select * into v from public.modu_visits where store_id=p_store and token_hash=p_hash for share;
  if not found then raise exception 'noAccess'; end if;
  actor_id:=v.id;event_type:='approved';
 elsif p_actor='staff' then
  select * into m from public.modu_staff where store_id=p_store and id=p_member and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
  if not found then raise exception 'revoked'; end if;
  if m.role not in ('floor','kitchen') then raise exception 'noAccess'; end if;
  actor_id:=m.id;event_type:=case when m.role='floor' then 'requested' else 'approved' end;
 else raise exception 'invalid'; end if;
 select * into a from public.modu_amendments where id=p_amendment and store_id=p_store and parent_amendment_id is not null;
 if not found then raise exception 'noAccess'; end if;
 if p_actor='guest' and a.visit_id<>actor_id then raise exception 'noAccess'; end if;
 if p_actor='staff' and ((a.target_type='order' and not ('ordersView'=any(m.permissions))) or (a.target_type='booking' and (m.role='kitchen' or not ('bookingsView'=any(m.permissions))))) then raise exception 'noAccess'; end if;
 if event_type='approved' and a.status<>'approved' then raise exception 'noAccess'; end if;
 insert into public.modu_notification_reads(store_id,actor_type,actor_id,amendment_id,event_type)
 values(p_store,p_actor,actor_id,a.id,event_type) on conflict do nothing;
 return jsonb_build_object('key','counter:'||a.id||':'||event_type);
end $$;
revoke all on function public.modu_notification_mark(uuid,text,text,uuid,uuid) from public,anon,authenticated;
grant execute on function public.modu_notification_mark(uuid,text,text,uuid,uuid) to service_role;
