-- Connected role demos reuse the real order pipeline, with a new shop and short-lived credentials.
alter table public.modu_stores add column demo_expires_at timestamptz;

create function public.modu_create_connected_demo(
 p_store jsonb,p_menu jsonb,p_workspace jsonb,p_password jsonb,
 p_legacy_hash text,p_owner_hash text,p_floor_hash text,p_kitchen_hash text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare created jsonb; sid uuid; until_at timestamptz:=now()+interval '24 hours'; f jsonb; k jsonb;
begin
 if jsonb_array_length(p_menu)<1 or length(p_store->>'address')<1 then raise exception 'invalid'; end if;
 created:=public.modu_create_password_store(p_legacy_hash,p_store,p_menu,p_workspace,p_password,p_owner_hash,false);
 sid:=(created->>'storeId')::uuid;
 update public.modu_stores set published=true,demo_expires_at=until_at where id=sid;
 update public.modu_owner_sessions set expires_at=until_at where store_id=sid;
 f:=public.modu_staff_manage(sid,p_owner_hash,'create',null,'{"name":"Minh · Demo","role":"floor","permissions":["ordersView","ordersAccept","ordersServe","bookingsView","bookingsManage","requestsView","deliveryView","menuView"]}'::jsonb,p_floor_hash);
 k:=public.modu_staff_manage(sid,p_owner_hash,'create',null,'{"name":"Jin · Demo","role":"kitchen","permissions":["ordersView","ordersPrepare","menuView"]}'::jsonb,p_kitchen_hash);
 update public.modu_staff set expires_at=until_at where store_id=sid;
 return jsonb_build_object('storeId',sid,'expiresAt',until_at,
   'floor',jsonb_build_object('member',f||jsonb_build_object('expiresAt',until_at)),
   'kitchen',jsonb_build_object('member',k||jsonb_build_object('expiresAt',until_at)));
end $$;
revoke all on function public.modu_create_connected_demo(jsonb,jsonb,jsonb,jsonb,text,text,text,text) from public,anon,authenticated;
grant execute on function public.modu_create_connected_demo(jsonb,jsonb,jsonb,jsonb,text,text,text,text) to service_role;
