alter table public.modu_amendments add column proposal_data jsonb, add column proposal_status text, add column proposal_at timestamptz, add column proposal_responded_at timestamptz;

-- Keep the established review checks and block stale or duplicate decisions on an offer.
alter function public.modu_amend_review(uuid,text,uuid,uuid,boolean,text,jsonb) rename to modu_amend_review_base;
create or replace function public.modu_amend_review_base(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_approve boolean,p_reason text,p_messages jsonb)
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
 if a.proposal_status is not null or a.status<>'pending' or current_status<>a.original_status then raise exception 'ownerConflict'; end if;
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


create function public.modu_amend_review(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_approve boolean,p_reason text,p_messages jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.modu_amendments;
begin
 select * into a from public.modu_amendments where id=p_request and store_id=p_store;
 if a.proposal_status is not null then raise exception 'ownerConflict'; end if;
 return public.modu_amend_review_base(p_store,p_hash,p_member,p_request,p_approve,p_reason,p_messages);
end $$;

create function public.modu_amend_offer(p_store uuid,p_hash text,p_member uuid,p_request uuid,p_reason text,p_messages jsonb,p_data jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.modu_amendments; st public.modu_stores; item jsonb; result jsonb; qty int; offered jsonb;
begin
 select * into a from public.modu_amendments where id=p_request and store_id=p_store;
 if not found or a.kind<>'change' or a.proposal_status is not null then raise exception 'ownerConflict'; end if;
 select * into st from public.modu_stores where id=p_store;
 if a.target_type='order' then
  if jsonb_typeof(p_data->'itemId') is distinct from 'string' or coalesce(p_data->>'quantity','') !~ '^[0-9]{1,2}$' then raise exception 'invalid'; end if;
  qty:=(p_data->>'quantity')::int; if qty not between 1 and 20 then raise exception 'invalid'; end if;
  select value into item from jsonb_array_elements(st.menu) where value->>'id'=p_data->>'itemId';
  if item is null or coalesce((item->>'available')::boolean,true)=false then raise exception 'soldOut'; end if;
  offered:=jsonb_build_object('lines',jsonb_build_array(jsonb_build_object('itemId',item->>'id','quantity',qty,'unitPrice',(item->>'price')::bigint,'name',item->'name')),'total',(item->>'price')::bigint*qty);
 else
  if coalesce(p_data->>'date','') !~ '^\d{4}-\d{2}-\d{2}$' or coalesce(p_data->>'time','') !~ '^([01]\d|2[0-3]):[0-5]\d$' then raise exception 'invalid'; end if;
  offered:=jsonb_build_object('date',p_data->>'date','time',p_data->>'time','partySize',(a.before_data->>'partySize')::int,'name',a.before_data->>'name');
 end if;
 if offered=a.after_data or offered=a.before_data then raise exception 'invalid'; end if;
 -- The review function locks the target first and rechecks ownership, staff permission, reason and status.
 result:=public.modu_amend_review_base(p_store,p_hash,p_member,p_request,false,p_reason,p_messages);
 update public.modu_amendments set status='pending',proposal_data=offered,proposal_status='pending',proposal_at=now() where id=p_request and proposal_status is null returning * into a;
 if not found then raise exception 'ownerConflict'; end if;
 return to_jsonb(a);
end $$;

create function public.modu_amend_offer_reply(p_store uuid,p_visit uuid,p_request uuid,p_accept boolean)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.modu_amendments; o public.modu_orders; b public.modu_reservations; st public.modu_stores; item jsonb; line jsonb; zone text; booking_at timestamptz;
begin
 select * into a from public.modu_amendments where id=p_request and store_id=p_store and visit_id=p_visit;
 if not found then raise exception 'noAccess'; end if;
 if a.target_type='order' then select * into o from public.modu_orders where id=a.target_id and store_id=p_store for update; if not found then raise exception 'ownerConflict'; end if;
 else select * into b from public.modu_reservations where id=a.target_id and store_id=p_store for update; if not found then raise exception 'ownerConflict'; end if; end if;
 select * into a from public.modu_amendments where id=p_request and store_id=p_store and visit_id=p_visit for update;
 if a.status<>'pending' or a.proposal_status<>'pending' or (a.target_type='order' and o.status<>a.original_status) or (a.target_type='booking' and b.status<>a.original_status) then raise exception 'ownerConflict'; end if;
 if p_accept then
  select * into st from public.modu_stores where id=p_store for share;
  if a.target_type='order' then
   line:=a.proposal_data->'lines'->0;select value into item from jsonb_array_elements(st.menu) where value->>'id'=line->>'itemId';
   if item is null or coalesce((item->>'available')::boolean,true)=false then raise exception 'soldOut'; end if;
   if (item->>'price')::bigint<>(line->>'unitPrice')::bigint then raise exception 'menuConflict'; end if;
   update public.modu_orders set lines=a.proposal_data->'lines',total=(a.proposal_data->>'total')::bigint,status=case when o.status in ('preparing','ready') then 'accepted' else o.status end where id=o.id;
  else
   zone:=case st.public_data->>'country' when 'KR' then 'Asia/Seoul' when 'JP' then 'Asia/Tokyo' when 'CN' then 'Asia/Shanghai' when 'IN' then 'Asia/Kolkata' else 'Asia/Ho_Chi_Minh' end;
   booking_at:=((a.proposal_data->>'date')::date+(a.proposal_data->>'time')::time) at time zone zone;
   if booking_at<=now() or booking_at>now()+interval '31 days' then raise exception 'invalidBooking'; end if;
   update public.modu_reservations set date=(a.proposal_data->>'date')::date,time=(a.proposal_data->>'time')::time,party_size=(a.proposal_data->>'partySize')::int where id=b.id;
  end if;
 end if;
 update public.modu_amendments set status='rejected',proposal_status=case when p_accept then 'accepted' else 'declined' end,proposal_responded_at=now() where id=a.id returning * into a;
 return to_jsonb(a)-'reviewed_by'-'reviewed_member';
end $$;

-- Add only the menu information needed to suggest an alternative; keep kitchen projections minimal.
create or replace function public.modu_staff_snapshot(p_store uuid,p_member uuid,p_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb; m public.modu_staff; requests jsonb; menu jsonb;
begin
 result:=public.modu_staff_snapshot_base(p_store,p_member,p_hash);
 select * into m from public.modu_staff where id=p_member and store_id=p_store and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
 if not found then raise exception 'revoked'; end if;
 select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb) into requests from (
  select a.created_at,jsonb_build_object('id',a.id,'target_id',a.target_id,'target_type',a.target_type,'kind',a.kind,'status',a.status,'original_status',a.original_status,'created_at',a.created_at,'reviewed_at',a.reviewed_at,'reviewed_by',a.reviewed_by,'guest_lang',a.guest_lang,'proposal_status',a.proposal_status,'proposal_at',a.proposal_at,'proposal_responded_at',a.proposal_responded_at)
  ||case when m.role='floor' then jsonb_build_object('before_data',case when a.target_type='booking' then a.before_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.before_data->'lines') l)) end,
  'after_data',case when a.after_data is null then null when a.target_type='booking' then a.after_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.after_data->'lines') l)) end,
  'proposal_data',case when a.proposal_data is null then null when a.target_type='booking' then a.proposal_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.proposal_data->'lines') l)) end) else '{}'::jsonb end as data
  from public.modu_amendments a where a.store_id=p_store and ((a.target_type='order' and 'ordersView'=any(m.permissions)) or (a.target_type='booking' and 'bookingsView'=any(m.permissions))) order by a.created_at desc limit 500
 ) x;
 if m.role='floor' and 'ordersView'=any(m.permissions) and 'ordersAccept'=any(m.permissions) then
  select coalesce(jsonb_agg(jsonb_build_object('id',i->>'id','name',i->'name','available',coalesce((i->>'available')::boolean,true))),'[]') into menu from public.modu_stores st, jsonb_array_elements(st.menu) i where st.id=p_store;
  result:=result||jsonb_build_object('proposalMenu',menu);
 end if;
 return result||jsonb_build_object('amendments',requests);
end $$;
revoke all on function public.modu_amend_review_base(uuid,text,uuid,uuid,boolean,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean,text,jsonb),public.modu_amend_offer(uuid,text,uuid,uuid,text,jsonb,jsonb),public.modu_amend_offer_reply(uuid,uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.modu_amend_review_base(uuid,text,uuid,uuid,boolean,text,jsonb),public.modu_amend_review(uuid,text,uuid,uuid,boolean,text,jsonb),public.modu_amend_offer(uuid,text,uuid,uuid,text,jsonb,jsonb),public.modu_amend_offer_reply(uuid,uuid,uuid,boolean) to service_role;
