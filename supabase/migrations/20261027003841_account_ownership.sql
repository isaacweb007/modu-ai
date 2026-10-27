-- Owner identities are verified by Auth in the Edge Function. No client table grants.
alter table public.modu_owners alter column token_hash drop not null;
alter table public.modu_owners add column user_id uuid references auth.users(id) on delete restrict;
alter table public.modu_owners add column creation_request uuid;
alter table public.modu_owners add constraint owner_identity check ((user_id is null and token_hash is not null) or (user_id is not null and token_hash is null));
create index modu_owners_user_idx on public.modu_owners(user_id);
create unique index modu_owners_creation_idx on public.modu_owners(user_id,creation_request);
create function public.modu_auth_session(p_user uuid,p_session uuid) returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from auth.sessions where id=p_session and user_id=p_user and (not_after is null or not_after>now()));
$$;
create function public.modu_create_account_store(p_user uuid,p_request uuid,p_store jsonb,p_menu jsonb,p_workspace jsonb) returns uuid language plpgsql security invoker set search_path='' as $$
declare sid uuid; begin
 perform id from auth.users where id=p_user and email_confirmed_at is not null and is_anonymous is not true for update;
 if not found then raise exception 'signInRequired'; end if;
 select store_id into sid from public.modu_owners where user_id=p_user and creation_request=p_request;
 if sid is not null then return sid; end if;
 if (select count(*) from public.modu_owners where user_id=p_user)>=10 then raise exception 'storeLimit'; end if;
 insert into public.modu_stores(public_data,menu) values(p_store,p_menu) returning id into sid;
 insert into public.modu_owners(store_id,user_id,creation_request,workspace) values(sid,p_user,p_request,p_workspace);
 return sid;
end $$;
create function public.modu_claim_store(p_id uuid,p_user uuid,p_hash text) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from auth.users where id=p_user and email_confirmed_at is not null and is_anonymous is not true) then return false; end if;
 update public.modu_owners set user_id=p_user,token_hash=null where store_id=p_id and user_id is null and token_hash=p_hash;
 return found;
end $$;
revoke all on function public.modu_auth_session(uuid,uuid),public.modu_create_account_store(uuid,uuid,jsonb,jsonb,jsonb),public.modu_claim_store(uuid,uuid,text) from public,anon,authenticated;
grant execute on function public.modu_auth_session(uuid,uuid),public.modu_create_account_store(uuid,uuid,jsonb,jsonb,jsonb),public.modu_claim_store(uuid,uuid,text) to service_role;
-- Retain the legacy creation function only for rollback; HTTP creation now requires an account.
