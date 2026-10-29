-- Freeze the selected explanation in all nine supported languages at decision time.
alter table public.modu_amendments add column reason_code text, add column reason_messages jsonb;

create or replace function public.modu_amend_submit(p_store uuid,p_visit uuid,p_target uuid,p_type text,p_kind text,p_request text,p_data jsonb)
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
 values(p_store,p_visit,p_target,p_type,p_kind,p_request,old_data,next_data,s,case when p_data->>'guestLang' in ('ko','en','vi','zh','ja','km','id','lo','hi') then p_data->>'guestLang' else v.lang end) returning * into a;
 return to_jsonb(a);
end $$;

create function public.modu_amend_review(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_approve boolean,p_reason text,p_messages jsonb)
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
 if p_approve then
  if p_reason is not null or p_messages is not null then raise exception 'invalid'; end if;
 else
  if p_reason is null or p_reason='' then raise exception 'reasonRequired'; end if;
  if p_reason not in ('verificationRequired','operationalConstraint') and not (
    p_reason='menuUnavailable' and a.target_type='order' and a.kind='change' or
    p_reason in ('slotUnavailable','capacityUnavailable') and a.target_type='booking' and a.kind='change' or
    p_reason='preparationStarted' and a.target_type='order' and a.original_status in ('preparing','ready')
  ) then raise exception 'invalidReason'; end if;
  if jsonb_typeof(p_messages) is distinct from 'object' or (select count(*) from jsonb_object_keys(p_messages))<>9 or
    exists(select 1 from unnest(array['ko','en','vi','zh','ja','km','id','lo','hi']) l where jsonb_typeof(p_messages->l) is distinct from 'string' or length(p_messages->>l) not between 1 and 1000)
  then raise exception 'invalid'; end if;
 end if;
 update public.modu_amendments set status=case when p_approve then 'approved' else 'rejected' end,reviewed_at=now(),reviewed_by=actor,reviewed_member=case when is_owner then null else m.id end,
 reason_code=case when p_approve then null else p_reason end,reason_messages=case when p_approve then null else p_messages end where id=a.id returning * into a;
 if p_approve and a.target_type='order' then
  if a.kind='cancel' then update public.modu_orders set status='cancelled' where id=o.id;
  else update public.modu_orders set lines=a.after_data->'lines',total=(a.after_data->>'total')::bigint,status=case when o.status in ('preparing','ready') then 'accepted' else o.status end where id=o.id; end if;
 elsif p_approve and a.target_type='booking' then
  if a.kind='cancel' then update public.modu_reservations set status='cancelled' where id=b.id;
  else update public.modu_reservations set date=(a.after_data->>'date')::date,time=(a.after_data->>'time')::time,party_size=(a.after_data->>'partySize')::int where id=b.id; end if;
 end if;
 return to_jsonb(a);
end $$;

-- Preserve existing approvals while requiring a reason for all new rejections.
create or replace function public.modu_amend_review(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_approve boolean)
returns jsonb language sql security invoker set search_path='' as $$
 select public.modu_amend_review(p_store,p_hash,p_member,p_request,p_approve,null,null);
$$;
revoke all on function public.modu_amend_submit(uuid,uuid,uuid,text,text,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean),public.modu_amend_review(uuid,text,uuid,uuid,boolean,text,jsonb) from public,anon,authenticated;
grant execute on function public.modu_amend_submit(uuid,uuid,uuid,text,text,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean),public.modu_amend_review(uuid,text,uuid,uuid,boolean,text,jsonb) to service_role;
