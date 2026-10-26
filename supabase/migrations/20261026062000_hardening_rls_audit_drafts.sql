-- Hardening: assigned-only RLS, audit_events (append-only), apply_drafts, staff seed.
-- Additive only — does not rename/drop existing business columns.

-- ---------------------------------------------------------------------------
-- 1) Tighten can_access_application: assigned-only for processor/lender/escrow
-- ---------------------------------------------------------------------------
create or replace function private.can_access_application(app public.loan_applications)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when auth.uid() is null then false
    when private.current_user_role() = 'vault' then true
    when private.current_user_role() = 'borrower'
      then app.borrower_id = private.current_user_id()
    when private.current_user_role() = 'processor'
      then (
        app.assigned_processor_id = private.current_user_id()
        or (
          app.processor_org_id is not null
          and app.processor_org_id = private.current_org_id()
        )
      )
    when private.current_user_role() = 'lender'
      then (
        app.lender_org_id is not null
        and app.lender_org_id = private.current_org_id()
      )
    when private.current_user_role() = 'escrow'
      then (
        app.escrow_org_id is not null
        and app.escrow_org_id = private.current_org_id()
      )
    else false
  end;
$$;

-- ---------------------------------------------------------------------------
-- 2) loi_documents write must require loan access (A4=1)
-- ---------------------------------------------------------------------------
drop policy if exists loi_documents_write on public.loi_documents;
create policy loi_documents_write on public.loi_documents
  for all to authenticated
  using (
    private.current_user_role() in ('vault', 'processor')
    and exists (
      select 1 from public.loan_applications a
      where a.id = loi_documents.application_id
        and private.can_access_application(a)
    )
  )
  with check (
    private.current_user_role() in ('vault', 'processor')
    and exists (
      select 1 from public.loan_applications a
      where a.id = loi_documents.application_id
        and private.can_access_application(a)
    )
  );

-- ---------------------------------------------------------------------------
-- 3) users SELECT: vault all; others self + parties on accessible loans (A5=2)
-- ---------------------------------------------------------------------------
drop policy if exists users_select_self_or_staff on public.users;
create policy users_select_scoped on public.users
  for select to authenticated
  using (
    id = private.current_user_id()
    or private.current_user_role() = 'vault'
    or exists (
      select 1
      from public.loan_applications a
      where private.can_access_application(a)
        and (
          a.borrower_id = users.id
          or a.assigned_processor_id = users.id
        )
    )
  );

-- ---------------------------------------------------------------------------
-- 4) audit_events — append-only; readable if can access loan (B1=3, B2=1)
-- ---------------------------------------------------------------------------
create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users (id),
  actor_role public.user_role,
  loan_id uuid references public.loan_applications (id) on delete set null,
  action text not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_events_loan_id_created_at_idx
  on public.audit_events (loan_id, created_at);
create index if not exists audit_events_created_at_idx
  on public.audit_events (created_at desc);

alter table public.audit_events enable row level security;

create policy audit_events_select on public.audit_events
  for select to authenticated
  using (
    private.current_user_role() = 'vault'
    or (
      loan_id is not null
      and exists (
        select 1 from public.loan_applications a
        where a.id = audit_events.loan_id
          and private.can_access_application(a)
      )
    )
  );

create policy audit_events_insert on public.audit_events
  for insert to authenticated
  with check (
    private.current_user_role() = 'vault'
    or (
      loan_id is not null
      and exists (
        select 1 from public.loan_applications a
        where a.id = audit_events.loan_id
          and private.can_access_application(a)
      )
    )
  );

-- No UPDATE or DELETE policies for any role (including vault) — append-only.

-- Helper to write audit rows from triggers (security definer; bypasses RLS insert checks)
create or replace function private.write_audit(
  p_actor_id uuid,
  p_actor_role public.user_role,
  p_loan_id uuid,
  p_action text,
  p_before jsonb,
  p_after jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_events (actor_id, actor_role, loan_id, action, before_state, after_state)
  values (p_actor_id, p_actor_role, p_loan_id, p_action, p_before, p_after);
end;
$$;

revoke all on function private.write_audit(uuid, public.user_role, uuid, text, jsonb, jsonb) from public;

create or replace function private.audit_loan_applications()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := private.current_user_id();
  v_role public.user_role := private.current_user_role();
  v_action text;
begin
  if tg_op = 'INSERT' then
    perform private.write_audit(v_actor, v_role, new.id, 'loan.insert', null, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status then
      v_action := 'loan.status_transition';
    elsif new.assigned_processor_id is distinct from old.assigned_processor_id
       or new.processor_org_id is distinct from old.processor_org_id
       or new.lender_org_id is distinct from old.lender_org_id
       or new.escrow_org_id is distinct from old.escrow_org_id then
      v_action := 'loan.assignment_change';
    elsif new.package is distinct from old.package
       or new.package_complete is distinct from old.package_complete then
      v_action := 'loan.package_update';
    else
      v_action := 'loan.update';
    end if;
    perform private.write_audit(v_actor, v_role, new.id, v_action, to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    perform private.write_audit(v_actor, v_role, old.id, 'loan.delete', to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists audit_loan_applications_trg on public.loan_applications;
create trigger audit_loan_applications_trg
  after insert or update or delete on public.loan_applications
  for each row execute function private.audit_loan_applications();

create or replace function private.audit_documents()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := private.current_user_id();
  v_role public.user_role := private.current_user_role();
begin
  if tg_op = 'INSERT' then
    perform private.write_audit(v_actor, v_role, new.application_id, 'document.upload', null, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    perform private.write_audit(v_actor, v_role, new.application_id, 'document.update', to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    perform private.write_audit(v_actor, v_role, old.application_id, 'document.remove', to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists audit_documents_trg on public.documents;
create trigger audit_documents_trg
  after insert or update or delete on public.documents
  for each row execute function private.audit_documents();

create or replace function private.audit_conditions()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := private.current_user_id();
  v_role public.user_role := private.current_user_role();
begin
  if tg_op = 'INSERT' then
    perform private.write_audit(v_actor, v_role, new.application_id, 'condition.create', null, to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    perform private.write_audit(v_actor, v_role, new.application_id, 'condition.update', to_jsonb(old), to_jsonb(new));
    return new;
  elsif tg_op = 'DELETE' then
    perform private.write_audit(v_actor, v_role, old.application_id, 'condition.delete', to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists audit_conditions_trg on public.conditions;
create trigger audit_conditions_trg
  after insert or update or delete on public.conditions
  for each row execute function private.audit_conditions();

create or replace function private.audit_users_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and new.role is distinct from old.role then
    perform private.write_audit(
      private.current_user_id(),
      private.current_user_role(),
      null,
      'user.role_change',
      jsonb_build_object('user_id', old.id, 'role', old.role),
      jsonb_build_object('user_id', new.id, 'role', new.role)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists audit_users_role_trg on public.users;
create trigger audit_users_role_trg
  after update on public.users
  for each row execute function private.audit_users_role();

-- ---------------------------------------------------------------------------
-- 5) apply_drafts (C2=1)
-- ---------------------------------------------------------------------------
create table if not exists public.apply_drafts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references public.users (id) on delete cascade,
  owner_email text,
  location jsonb not null default '{}'::jsonb,
  loan_type public.loan_type,
  package jsonb not null default '{}'::jsonb,
  pending_docs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists apply_drafts_owner_user_id_idx on public.apply_drafts (owner_user_id);
create index if not exists apply_drafts_owner_email_idx on public.apply_drafts (owner_email);

alter table public.apply_drafts enable row level security;

create policy apply_drafts_select on public.apply_drafts
  for select to authenticated
  using (
    private.current_user_role() = 'vault'
    or owner_user_id = private.current_user_id()
    or (
      owner_email is not null
      and lower(owner_email) = lower((private.current_app_user()).email)
    )
  );

create policy apply_drafts_insert on public.apply_drafts
  for insert to authenticated
  with check (
    owner_user_id = private.current_user_id()
    or owner_user_id is null
  );

create policy apply_drafts_update on public.apply_drafts
  for update to authenticated
  using (
    owner_user_id = private.current_user_id()
    or private.current_user_role() = 'vault'
  )
  with check (
    owner_user_id = private.current_user_id()
    or private.current_user_role() = 'vault'
  );

create policy apply_drafts_delete on public.apply_drafts
  for delete to authenticated
  using (
    owner_user_id = private.current_user_id()
    or private.current_user_role() = 'vault'
  );

-- ---------------------------------------------------------------------------
-- 6) Staff seed orgs + users (no fake loans) — C3=2
-- Passwords are NOT set here; link auth_user_id when staff sign up / are invited.
-- ---------------------------------------------------------------------------
insert into public.organizations (id, name, org_type, status, contact_email)
values
  ('a1000000-0000-4000-8000-000000000001', 'Vault Financial Services LLC', 'vault', 'active', 'ops@vaultfs.com'),
  ('a1000000-0000-4000-8000-000000000002', 'Apex Loan Processing', 'processor', 'active', 'files@apexprocessing.example'),
  ('a1000000-0000-4000-8000-000000000003', 'Summit Private Credit', 'lender', 'active', 'uw@summitpc.example'),
  ('a1000000-0000-4000-8000-000000000004', 'Pacific Escrow & Title', 'escrow', 'active', 'closing@pacificescrow.example')
on conflict (id) do nothing;

insert into public.users (id, email, full_name, phone, role, organization_id)
values
  ('b1000000-0000-4000-8000-000000000001', 'vault.ops@vaultfs.com', 'Vault Operations', null, 'vault', 'a1000000-0000-4000-8000-000000000001'),
  ('b1000000-0000-4000-8000-000000000002', 'processor@apexprocessing.example', 'Apex Processor', null, 'processor', 'a1000000-0000-4000-8000-000000000002'),
  ('b1000000-0000-4000-8000-000000000003', 'uw@summitpc.example', 'Summit Underwriter', null, 'lender', 'a1000000-0000-4000-8000-000000000003'),
  ('b1000000-0000-4000-8000-000000000004', 'closing@pacificescrow.example', 'Pacific Escrow Officer', null, 'escrow', 'a1000000-0000-4000-8000-000000000004')
on conflict (email) do nothing;
