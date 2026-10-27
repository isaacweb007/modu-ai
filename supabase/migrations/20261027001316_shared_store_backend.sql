-- All application reads and writes go through the authenticated Edge API.
-- Public broadcast contains only an invalidation signal, never business data.
create schema if not exists modu_private;
revoke all on schema modu_private from public, anon, authenticated;
create table public.modu_stores (
 id uuid primary key default gen_random_uuid(), public_data jsonb not null default '{}',
 menu jsonb not null default '[]' check (jsonb_typeof(menu)='array'),
 published boolean not null default false, revision bigint not null default 1,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.modu_owners (
 store_id uuid primary key references public.modu_stores(id) on delete cascade,
 token_hash text not null unique check(length(token_hash)=64), workspace jsonb not null default '{}'
);
create table public.modu_visits (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 token_hash text not null unique check(length(token_hash)=64), table_no int not null check(table_no between 1 and 999),
 lang text not null, created_at timestamptz not null default now(), unique(store_id,id)
);
create table public.modu_orders (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 visit_id uuid not null, request_id text not null, number bigint generated always as identity,
 lines jsonb not null, total bigint not null check(total>0),
 status text not null default 'pending' check(status in ('pending','accepted','preparing','ready','completed')),
 payment text not null default 'unpaid' check(payment='unpaid'), created_at timestamptz not null default now(),
 unique(visit_id,request_id), foreign key(store_id,visit_id) references public.modu_visits(store_id,id) on delete cascade
);
create table public.modu_reservations (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 visit_id uuid not null, request_id text not null, number bigint generated always as identity,
 date date not null, time time not null, party_size int not null check(party_size between 1 and 20), name text not null,
 status text not null default 'pending' check(status in ('pending','confirmed','cancelled')),
 created_at timestamptz not null default now(), unique(visit_id,request_id),
 foreign key(store_id,visit_id) references public.modu_visits(store_id,id) on delete cascade
);
create table public.modu_messages (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 visit_id uuid not null, request_id text not null, kind text not null check(kind in ('thread','event')),
 payload jsonb not null, reviewed boolean not null default false, created_at timestamptz not null default now(),
 unique(visit_id,request_id), foreign key(store_id,visit_id) references public.modu_visits(store_id,id) on delete cascade
);
create table public.modu_media (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.modu_stores(id) on delete cascade,
 path text not null unique, name text not null, type text not null, size bigint not null check(size between 1 and 26214400),
 kind text not null check(kind in ('menu','venue')), created_at timestamptz not null default now()
);
create table public.modu_rate_limits(key text primary key, starts_at timestamptz not null, count int not null);
create index on public.modu_visits(store_id,created_at desc);
create index on public.modu_orders(store_id,created_at desc);
create index on public.modu_orders(visit_id);
create index on public.modu_reservations(store_id,created_at desc);
create index on public.modu_reservations(visit_id);
create index on public.modu_messages(store_id,created_at desc);
create index on public.modu_messages(visit_id);
create index on public.modu_media(store_id);
do $$ declare tbl text; begin
 foreach tbl in array array['modu_stores','modu_owners','modu_visits','modu_orders','modu_reservations','modu_messages','modu_media','modu_rate_limits'] loop
 execute format('alter table public.%I enable row level security',tbl);
 execute format('revoke all on public.%I from anon, authenticated',tbl);
 execute format('grant all on public.%I to service_role',tbl);
 end loop;
end $$;

create function public.modu_rate_limit(p_key text,p_limit int,p_seconds int) returns boolean language plpgsql security invoker set search_path='' as $$
declare n int; begin
 insert into public.modu_rate_limits as r values(p_key,now(),1)
 on conflict(key) do update set count=case when r.starts_at<now()-make_interval(secs=>p_seconds) then 1 else r.count+1 end,
 starts_at=case when r.starts_at<now()-make_interval(secs=>p_seconds) then now() else r.starts_at end returning count into n;
 return n<=p_limit;
end $$;
create function public.modu_create_store(p_hash text,p_store jsonb,p_menu jsonb,p_workspace jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare sid uuid; begin
 insert into public.modu_stores(public_data,menu) values(p_store,p_menu) returning id into sid;
 insert into public.modu_owners(store_id,token_hash,workspace) values(sid,p_hash,p_workspace);
 return sid;
end $$;
create function public.modu_save_store(p_id uuid,p_revision bigint,p_store jsonb,p_menu jsonb,p_workspace jsonb,p_published boolean) returns bigint language plpgsql security invoker set search_path='' as $$
declare rev bigint; begin
 update public.modu_stores set public_data=p_store,menu=p_menu,published=p_published,revision=revision+1,updated_at=now()
 where id=p_id and revision=p_revision returning revision into rev;
 if rev is null then raise exception 'ownerConflict'; end if;
 update public.modu_owners set workspace=p_workspace where store_id=p_id;
 return rev;
end $$;
create function public.modu_place_order(p_store uuid,p_visit uuid,p_request text,p_cart jsonb,p_revision bigint) returns public.modu_orders language plpgsql security invoker set search_path='' as $$
declare st public.modu_stores; result public.modu_orders; item jsonb; pair record; quantity int; price bigint; amount bigint:=0; lines jsonb:='[]'; begin
 -- Serialize one visit, including retries whose response was lost.
 perform 1 from public.modu_visits where store_id=p_store and id=p_visit for update;
 if not found then raise exception 'unauthorized'; end if;
 select * into result from public.modu_orders where visit_id=p_visit and request_id=p_request;
 if found then return result; end if;
 select * into st from public.modu_stores where id=p_store for share;
 if not st.published then raise exception 'storeNotReady'; end if;
 if st.revision<>p_revision then raise exception 'menuConflict'; end if;
 if jsonb_typeof(p_cart)<>'object' or p_cart='{}' then raise exception 'emptyCart'; end if;
 if (select count(*) from jsonb_object_keys(p_cart))>30 then raise exception 'maxQty'; end if;
 for pair in select * from jsonb_each_text(p_cart) loop
 if pair.value !~ '^[0-9]{1,2}$' then raise exception 'maxQty'; end if;
 quantity:=pair.value::int;
 if quantity not between 1 and 20 then raise exception 'maxQty'; end if;
 select value into item from jsonb_array_elements(st.menu) where value->>'id'=pair.key;
 if item is null or coalesce((item->>'available')::boolean,true)=false then raise exception 'soldOut'; end if;
 price:=(item->>'price')::bigint;
 amount:=amount+price*quantity;
 lines:=lines||jsonb_build_array(jsonb_build_object('itemId',pair.key,'quantity',quantity,'unitPrice',price,'name',item->'name'));
 end loop;
 insert into public.modu_orders(store_id,visit_id,request_id,lines,total) values(p_store,p_visit,p_request,lines,amount) returning * into result;
 return result;
end $$;
create function modu_private.notify_change() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 perform realtime.send('{}'::jsonb,'refresh','modu:'||case when TG_TABLE_NAME='modu_stores' then new.id else new.store_id end::text,false);
 return new;
end $$;
do $$ declare tbl text; begin
 foreach tbl in array array['modu_stores','modu_visits','modu_orders','modu_reservations','modu_messages','modu_media'] loop
 execute format('create trigger modu_refresh after insert or update on public.%I for each row execute function modu_private.notify_change()',tbl);
 end loop;
end $$;
revoke all on function public.modu_rate_limit(text,int,int),public.modu_create_store(text,jsonb,jsonb,jsonb),public.modu_save_store(uuid,bigint,jsonb,jsonb,jsonb,boolean),public.modu_place_order(uuid,uuid,text,jsonb,bigint) from public,anon,authenticated;
grant execute on function public.modu_rate_limit(text,int,int),public.modu_create_store(text,jsonb,jsonb,jsonb),public.modu_save_store(uuid,bigint,jsonb,jsonb,jsonb,boolean),public.modu_place_order(uuid,uuid,text,jsonb,bigint) to service_role;
revoke all on function modu_private.notify_change() from public,anon,authenticated;
grant usage on schema modu_private to service_role;
grant execute on function modu_private.notify_change() to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('modu-store-media','modu-store-media',false,26214400,array['image/jpeg','image/png','image/webp','image/heic','image/heif','video/mp4','video/webm','video/quicktime']);
