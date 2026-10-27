-- Product scope changed before deploying account-auth routes. Return to the existing demo backend.
-- Fail rather than remove identities if an account was linked in the meantime.
do $$ begin
 if exists(select 1 from public.modu_owners where user_id is not null) then raise exception 'Account data exists; refusing demo rollback'; end if;
end $$;
drop function public.modu_auth_session(uuid,uuid);
drop function public.modu_create_account_store(uuid,uuid,jsonb,jsonb,jsonb);
drop function public.modu_claim_store(uuid,uuid,text);
drop index public.modu_owners_creation_idx;
drop index public.modu_owners_user_idx;
alter table public.modu_owners drop constraint owner_identity;
alter table public.modu_owners drop column creation_request;
alter table public.modu_owners drop column user_id;
alter table public.modu_owners alter column token_hash set not null;
