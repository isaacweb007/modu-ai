-- Preserve each exchange as an individual amendment and link a revised request to its offer.
alter table public.modu_amendments add column parent_amendment_id uuid references public.modu_amendments(id);

create function public.modu_amend_counter(p_store uuid,p_visit uuid,p_parent uuid,p_request_id text,p_data jsonb)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare a public.modu_amendments; previous public.modu_amendments; child public.modu_amendments; result jsonb; current_status text; proposed_cart jsonb;
begin
 select * into a from public.modu_amendments where id=p_parent and store_id=p_store and visit_id=p_visit;
 if not found then raise exception 'noAccess'; end if;
 -- Use the same lock order as reviews and acceptances: target first, then amendment.
 if a.target_type='order' then select status into current_status from public.modu_orders where id=a.target_id and store_id=p_store and visit_id=p_visit for update;
 else select status into current_status from public.modu_reservations where id=a.target_id and store_id=p_store and visit_id=p_visit for update; end if;
 if not found then raise exception 'noAccess'; end if;
 select * into a from public.modu_amendments where id=p_parent and store_id=p_store and visit_id=p_visit for update;
 select * into previous from public.modu_amendments where visit_id=p_visit and request_id=p_request_id;
 if found then
  if previous.parent_amendment_id is distinct from p_parent then raise exception 'ownerConflict'; end if;
  return to_jsonb(previous)-'reviewed_by'-'reviewed_member';
 end if;
 if a.status is distinct from 'pending' or a.proposal_status is distinct from 'pending' or a.kind<>'change' or current_status<>a.original_status then raise exception 'ownerConflict'; end if;
 if a.target_type='order' then
  select coalesce(jsonb_object_agg(l->>'itemId',l->'quantity'),'{}'::jsonb) into proposed_cart from jsonb_array_elements(a.proposal_data->'lines') l;
  if p_data->'cart'=proposed_cart then raise exception 'sameOffer'; end if;
 else
  if p_data->>'date'=a.proposal_data->>'date' and p_data->>'time'=a.proposal_data->>'time' and (p_data->>'party_size')::int=(a.proposal_data->>'partySize')::int then raise exception 'sameOffer'; end if;
 end if;
 update public.modu_amendments set status='rejected',proposal_status='countered',proposal_responded_at=now() where id=a.id;
 -- Existing validator owns quantities, prices, menu availability, ownership, and hold creation.
 result:=public.modu_amend_submit(p_store,p_visit,a.target_id,a.target_type,'change',p_request_id,p_data);
 update public.modu_amendments set parent_amendment_id=a.id where id=(result->>'id')::uuid and visit_id=p_visit returning * into child;
 if not found then raise exception 'ownerConflict'; end if;
 return to_jsonb(child)-'reviewed_by'-'reviewed_member';
end $$;
revoke all on function public.modu_amend_counter(uuid,uuid,uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.modu_amend_counter(uuid,uuid,uuid,text,jsonb) to service_role;

create or replace function public.modu_staff_snapshot(p_store uuid,p_member uuid,p_hash text) returns jsonb language plpgsql security invoker set search_path='' as $$
declare result jsonb; m public.modu_staff; requests jsonb; menu jsonb;
begin
 result:=public.modu_staff_snapshot_base(p_store,p_member,p_hash);
 select * into m from public.modu_staff where id=p_member and store_id=p_store and token_hash=p_hash and revoked_at is null and expires_at>clock_timestamp() for share;
 if not found then raise exception 'revoked'; end if;
 select coalesce(jsonb_agg(x.data order by x.created_at desc),'[]'::jsonb) into requests from (
  select a.created_at,jsonb_build_object('id',a.id,'target_id',a.target_id,'target_type',a.target_type,'kind',a.kind,'status',a.status,'original_status',a.original_status,'created_at',a.created_at,'reviewed_at',a.reviewed_at,'reviewed_by',a.reviewed_by,'guest_lang',a.guest_lang,'parent_amendment_id',a.parent_amendment_id,'proposal_status',a.proposal_status,'proposal_at',a.proposal_at,'proposal_responded_at',a.proposal_responded_at)
  ||case when m.role='floor' then jsonb_build_object('before_data',case when a.target_type='booking' then a.before_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.before_data->'lines') l)) end,
  'after_data',case when a.after_data is null then null when a.target_type='booking' then a.after_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.after_data->'lines') l)) end,
  'proposal_data',case when a.proposal_data is null then null when a.target_type='booking' then a.proposal_data else jsonb_build_object('lines',(select coalesce(jsonb_agg(l-'unitPrice'),'[]') from jsonb_array_elements(a.proposal_data->'lines') l)) end) when m.role='kitchen' and a.target_type='order' then
   (case when a.parent_amendment_id is not null then jsonb_build_object('after_data',jsonb_build_object('lines',(select coalesce(jsonb_agg(jsonb_build_object('itemId',l->>'itemId','quantity',l->'quantity','name',l->'name')),'[]') from jsonb_array_elements(a.after_data->'lines') l))) else '{}'::jsonb end)
   ||(case when a.proposal_data is not null then jsonb_build_object('proposal_data',jsonb_build_object('lines',(select coalesce(jsonb_agg(jsonb_build_object('itemId',l->>'itemId','quantity',l->'quantity','name',l->'name')),'[]') from jsonb_array_elements(a.proposal_data->'lines') l))) else '{}'::jsonb end)
  else '{}'::jsonb end as data
  from public.modu_amendments a where a.store_id=p_store and ((a.target_type='order' and 'ordersView'=any(m.permissions)) or (a.target_type='booking' and 'bookingsView'=any(m.permissions))) order by a.created_at desc limit 500
 ) x;
 if m.role='floor' and 'ordersView'=any(m.permissions) and 'ordersAccept'=any(m.permissions) then
  select coalesce(jsonb_agg(jsonb_build_object('id',i->>'id','name',i->'name','available',coalesce((i->>'available')::boolean,true))),'[]') into menu from public.modu_stores st, jsonb_array_elements(st.menu) i where st.id=p_store;
  result:=result||jsonb_build_object('proposalMenu',menu);
 end if;
 return result||jsonb_build_object('amendments',requests);
end $$;
