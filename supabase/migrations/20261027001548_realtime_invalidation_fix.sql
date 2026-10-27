create or replace function modu_private.notify_change() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 perform realtime.send('{}'::jsonb,'refresh','modu:'||coalesce(to_jsonb(new)->>'store_id',to_jsonb(new)->>'id'),false);
 return new;
end $$;
do $$ declare tbl text; begin
 foreach tbl in array array['modu_stores','modu_owners','modu_visits','modu_orders','modu_reservations','modu_messages','modu_media','modu_rate_limits'] loop
 execute format('create policy deny_direct_client_access on public.%I as restrictive for all to anon, authenticated using (false) with check (false)',tbl);
 end loop;
end $$;
