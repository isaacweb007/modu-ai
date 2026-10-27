create index modu_orders_store_visit_idx on public.modu_orders(store_id,visit_id);
create index modu_reservations_store_visit_idx on public.modu_reservations(store_id,visit_id);
create index modu_messages_store_visit_idx on public.modu_messages(store_id,visit_id);
alter table public.modu_owners add column workspace_revision bigint not null default 1;
create or replace function public.modu_save_store(p_id uuid,p_revision bigint,p_store jsonb,p_menu jsonb,p_workspace jsonb,p_published boolean) returns bigint language plpgsql security invoker set search_path='' as $$
declare rev bigint; begin
 update public.modu_stores set public_data=p_store,menu=p_menu,published=p_published,revision=revision+1,updated_at=now()
 where id=p_id and revision=p_revision returning revision into rev;
 if rev is null then raise exception 'ownerConflict'; end if;
 update public.modu_owners set workspace=p_workspace-'expectedRevision',workspace_revision=workspace_revision+1 where store_id=p_id and workspace_revision=(p_workspace->>'expectedRevision')::bigint;
 if not found then raise exception 'ownerConflict'; end if;
 return rev;
end $$;
