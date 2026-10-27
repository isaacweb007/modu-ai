-- A visit without an explicit table QR starts unassigned. Historical values stay intact.
alter table public.modu_visits alter column table_no drop not null;
alter table public.modu_orders add column fulfillment jsonb;
alter table public.modu_orders add constraint modu_order_fulfillment_shape check (
 fulfillment is null or coalesce(
  jsonb_typeof(fulfillment)='object' and (
   (fulfillment->>'channel'='dine-in' and (fulfillment->>'table') ~ '^[1-9][0-9]{0,2}$' and not (fulfillment ? 'address' or fulfillment ? 'phone')) or
   (fulfillment->>'channel'='online' and length(fulfillment->>'address') between 5 and 300 and length(regexp_replace(fulfillment->>'phone','[^0-9]','','g')) between 7 and 15 and length(fulfillment->>'phone')<=30 and not fulfillment ? 'table')
  ),false)
);
-- Wrap the established pricing/idempotency transaction; delivery details and order commit together.
create function public.modu_place_routed_order(p_store uuid,p_visit uuid,p_request text,p_cart jsonb,p_revision bigint,p_fulfillment jsonb)
returns public.modu_orders language plpgsql security invoker set search_path='' as $$
declare result public.modu_orders; clean jsonb; begin
 perform 1 from public.modu_visits where store_id=p_store and id=p_visit for update;
 if not found then raise exception 'unauthorized'; end if;
 select * into result from public.modu_orders where visit_id=p_visit and request_id=p_request;
 if found then return result; end if;
 if coalesce(p_fulfillment->>'channel','')='dine-in' then
  clean:=jsonb_build_object('channel','dine-in','table',p_fulfillment->'table');
 elsif coalesce(p_fulfillment->>'channel','')='online' then
  clean:=jsonb_build_object('channel','online','address',btrim(p_fulfillment->>'address'),'phone',btrim(p_fulfillment->>'phone'),'name',left(coalesce(p_fulfillment->>'name',''),60));
 else raise exception 'fulfillmentRequired'; end if;
 select * into result from public.modu_place_order(p_store,p_visit,p_request,p_cart,p_revision);
 update public.modu_orders set fulfillment=clean where id=result.id returning * into result;
 return result;
end $$;
revoke all on function public.modu_place_routed_order(uuid,uuid,text,jsonb,bigint,jsonb) from public,anon,authenticated;
grant execute on function public.modu_place_routed_order(uuid,uuid,text,jsonb,bigint,jsonb) to service_role;
