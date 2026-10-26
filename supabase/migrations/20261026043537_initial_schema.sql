-- Vault Financial Services — initial schema, RLS, and document storage
-- Status history is append-only via status_events.

create extension if not exists "pgcrypto";

create schema if not exists private;

create type public.user_role as enum (
  'borrower',
  'vault',
  'processor',
  'lender',
  'escrow'
);

create type public.org_type as enum (
  'vault',
  'processor',
  'lender',
  'escrow',
  'capital_partner'
);

create type public.org_status as enum (
  'pending_review',
  'active',
  'inactive',
  'rejected'
);

create type public.loan_type as enum (
  'private_money',
  'rehab_fix_flip',
  'bridge',
  'ground_up',
  'new_construction',
  'dscr_non_qm'
);

create type public.application_status as enum (
  'application_submitted',
  'initial_review',
  'loi_issued',
  'package_submission',
  'info_requested',
  'underwriting',
  'clear_to_close',
  'closing_prep',
  'signing_funding',
  'funded',
  'denied'
);

create type public.document_status as enum (
  'pending',
  'received',
  'approved',
  'rejected'
);

create type public.condition_status as enum (
  'open',
  'satisfied',
  'waived'
);

create type public.message_visibility as enum (
  'borrower_visible',
  'internal',
  'lender_visible',
  'escrow_visible'
);

create table public.attribution_sources (
  id text primary key,
  label text not null,
  created_at timestamptz not null default now()
);

insert into public.attribution_sources (id, label) values
  ('organic_search', 'Organic Search'),
  ('paid_search', 'Paid Search'),
  ('paid_social', 'Paid Social'),
  ('email_campaign', 'Email Campaign'),
  ('retargeting', 'Retargeting'),
  ('partner_referral', 'Partner Referral'),
  ('direct_apply', 'Direct Apply'),
  ('referral_other', 'Referral — Other');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type public.org_type not null,
  status public.org_status not null default 'pending_review',
  website text,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  email text not null unique,
  full_name text not null,
  phone text,
  role public.user_role not null,
  organization_id uuid references public.organizations (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.loan_applications (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  borrower_id uuid not null references public.users (id),
  loan_type public.loan_type not null,
  status public.application_status not null default 'application_submitted',
  info_requested_from public.application_status,
  prior_application_id uuid references public.loan_applications (id),
  property_address text not null,
  property_city text not null,
  property_state text not null,
  property_postal text not null,
  purchase_price numeric(14, 2),
  loan_amount numeric(14, 2) not null,
  estimated_arv numeric(14, 2),
  processor_org_id uuid references public.organizations (id),
  lender_org_id uuid references public.organizations (id),
  escrow_org_id uuid references public.organizations (id),
  assigned_processor_id uuid references public.users (id),
  attribution_source_id text references public.attribution_sources (id),
  commission_rate numeric(7, 4),
  package jsonb,
  package_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  funded_at timestamptz,
  denied_at timestamptz
);

create table public.status_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  actor_id uuid references public.users (id),
  from_status public.application_status,
  to_status public.application_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  doc_type text not null,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  file_size_bytes integer,
  status public.document_status not null default 'pending',
  uploaded_by uuid references public.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  sender_id uuid not null references public.users (id),
  visibility public.message_visibility not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.conditions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  description text not null,
  status public.condition_status not null default 'open',
  created_by uuid references public.users (id),
  created_at timestamptz not null default now(),
  satisfied_at timestamptz
);

create table public.loi_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  generated_by uuid references public.users (id),
  storage_path text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.commission_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.loan_applications (id) on delete cascade,
  funded_amount numeric(14, 2) not null,
  commission_rate numeric(7, 4) not null,
  commission_amount numeric(14, 2) not null,
  attribution_source_id text references public.attribution_sources (id),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index status_events_application_id_created_at_idx
  on public.status_events (application_id, created_at);
create index loan_applications_status_idx on public.loan_applications (status);
create index loan_applications_borrower_id_idx on public.loan_applications (borrower_id);
create index loan_applications_package_complete_idx on public.loan_applications (package_complete);
create index documents_application_id_idx on public.documents (application_id);
create index messages_application_id_idx on public.messages (application_id);
create index users_auth_user_id_idx on public.users (auth_user_id);
create index users_role_idx on public.users (role);

-- ---------------------------------------------------------------------------
-- Helpers (private schema — security definer; not exposed via Data API)
-- Role/authorization lives in public.users, never in editable user_metadata.
-- ---------------------------------------------------------------------------

create or replace function private.current_app_user()
returns public.users
language sql
stable
security definer
set search_path = public
as $$
  select u.*
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function private.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select (private.current_app_user()).id;
$$;

create or replace function private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select (private.current_app_user()).role;
$$;

create or replace function private.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select (private.current_app_user()).organization_id;
$$;

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
      then app.processor_org_id = private.current_org_id()
        or app.assigned_processor_id = private.current_user_id()
        or (
          app.assigned_processor_id is null
          and app.status in ('loi_issued', 'package_submission', 'info_requested')
        )
    when private.current_user_role() = 'lender'
      then app.lender_org_id = private.current_org_id()
        or app.status in (
          'underwriting', 'clear_to_close', 'closing_prep', 'signing_funding', 'funded'
        )
    when private.current_user_role() = 'escrow'
      then app.escrow_org_id = private.current_org_id()
        or app.status in ('clear_to_close', 'closing_prep', 'signing_funding')
    else false
  end;
$$;

revoke all on function private.current_app_user() from public;
revoke all on function private.current_user_id() from public;
revoke all on function private.current_user_role() from public;
revoke all on function private.current_org_id() from public;
revoke all on function private.can_access_application(public.loan_applications) from public;

grant execute on function private.current_app_user() to authenticated;
grant execute on function private.current_user_id() to authenticated;
grant execute on function private.current_user_role() to authenticated;
grant execute on function private.current_org_id() to authenticated;
grant execute on function private.can_access_application(public.loan_applications) to authenticated;

-- Next reference code helper (private + service_role public wrapper)
create or replace function private.next_application_reference_code()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  max_n integer;
begin
  select coalesce(max((regexp_match(reference_code, '^VFS-([0-9]+)$'))[1]::integer), 1000)
    into max_n
  from public.loan_applications;
  return 'VFS-' || (max_n + 1)::text;
end;
$$;

revoke all on function private.next_application_reference_code() from public;
grant execute on function private.next_application_reference_code() to service_role;

create or replace function public.next_application_reference_code()
returns text
language sql
security definer
set search_path = public
as $$
  select private.next_application_reference_code();
$$;

revoke all on function public.next_application_reference_code() from public;
revoke all on function public.next_application_reference_code() from anon, authenticated;
grant execute on function public.next_application_reference_code() to service_role;

-- Touch updated_at
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function private.set_updated_at();

create trigger users_set_updated_at
  before update on public.users
  for each row execute function private.set_updated_at();

create trigger loan_applications_set_updated_at
  before update on public.loan_applications
  for each row execute function private.set_updated_at();

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.attribution_sources enable row level security;
alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.loan_applications enable row level security;
alter table public.status_events enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.conditions enable row level security;
alter table public.loi_documents enable row level security;
alter table public.commission_records enable row level security;

-- Attribution sources: readable by authenticated
create policy attribution_sources_select on public.attribution_sources
  for select to authenticated using (true);

-- Organizations
create policy organizations_select on public.organizations
  for select to authenticated using (
    private.current_user_role() = 'vault'
    or id = private.current_org_id()
    or status = 'active'
  );

create policy organizations_vault_write on public.organizations
  for all to authenticated
  using (private.current_user_role() = 'vault')
  with check (private.current_user_role() = 'vault');

-- Users
create policy users_select_self_or_staff on public.users
  for select to authenticated using (
    id = private.current_user_id()
    or private.current_user_role() in ('vault', 'processor', 'lender', 'escrow')
  );

create policy users_update_self on public.users
  for update to authenticated
  using (id = private.current_user_id())
  with check (id = private.current_user_id());

create policy users_vault_write on public.users
  for all to authenticated
  using (private.current_user_role() = 'vault')
  with check (private.current_user_role() = 'vault');

-- Loan applications
create policy loan_applications_select on public.loan_applications
  for select to authenticated using (private.can_access_application(loan_applications));

create policy loan_applications_insert_borrower on public.loan_applications
  for insert to authenticated
  with check (
    borrower_id = private.current_user_id()
    and private.current_user_role() = 'borrower'
  );

create policy loan_applications_update on public.loan_applications
  for update to authenticated
  using (private.can_access_application(loan_applications))
  with check (private.can_access_application(loan_applications));

-- Status events (append-only for actors who can access the app)
create policy status_events_select on public.status_events
  for select to authenticated using (
    exists (
      select 1 from public.loan_applications a
      where a.id = status_events.application_id
        and private.can_access_application(a)
    )
  );

create policy status_events_insert on public.status_events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.loan_applications a
      where a.id = status_events.application_id
        and private.can_access_application(a)
    )
  );

-- Documents
create policy documents_select on public.documents
  for select to authenticated using (
    exists (
      select 1 from public.loan_applications a
      where a.id = documents.application_id
        and private.can_access_application(a)
    )
  );

create policy documents_insert on public.documents
  for insert to authenticated
  with check (
    exists (
      select 1 from public.loan_applications a
      where a.id = documents.application_id
        and private.can_access_application(a)
    )
  );

create policy documents_update on public.documents
  for update to authenticated
  using (
    exists (
      select 1 from public.loan_applications a
      where a.id = documents.application_id
        and private.can_access_application(a)
    )
  )
  with check (
    exists (
      select 1 from public.loan_applications a
      where a.id = documents.application_id
        and private.can_access_application(a)
    )
  );

-- Messages
create policy messages_select on public.messages
  for select to authenticated using (
    exists (
      select 1 from public.loan_applications a
      where a.id = messages.application_id
        and private.can_access_application(a)
    )
    and (
      private.current_user_role() in ('vault', 'processor')
      or (
        private.current_user_role() = 'borrower'
        and visibility = 'borrower_visible'
      )
      or (
        private.current_user_role() = 'lender'
        and visibility in ('lender_visible', 'internal')
      )
      or (
        private.current_user_role() = 'escrow'
        and visibility in ('escrow_visible', 'internal')
      )
    )
  );

create policy messages_insert on public.messages
  for insert to authenticated
  with check (
    sender_id = private.current_user_id()
    and exists (
      select 1 from public.loan_applications a
      where a.id = messages.application_id
        and private.can_access_application(a)
    )
  );

-- Conditions
create policy conditions_select on public.conditions
  for select to authenticated using (
    exists (
      select 1 from public.loan_applications a
      where a.id = conditions.application_id
        and private.can_access_application(a)
    )
  );

create policy conditions_write on public.conditions
  for all to authenticated
  using (
    private.current_user_role() in ('vault', 'lender', 'processor')
    and exists (
      select 1 from public.loan_applications a
      where a.id = conditions.application_id
        and private.can_access_application(a)
    )
  )
  with check (
    private.current_user_role() in ('vault', 'lender', 'processor')
    and exists (
      select 1 from public.loan_applications a
      where a.id = conditions.application_id
        and private.can_access_application(a)
    )
  );

-- LOI documents
create policy loi_documents_select on public.loi_documents
  for select to authenticated using (
    exists (
      select 1 from public.loan_applications a
      where a.id = loi_documents.application_id
        and private.can_access_application(a)
    )
  );

create policy loi_documents_write on public.loi_documents
  for all to authenticated
  using (private.current_user_role() in ('vault', 'processor'))
  with check (private.current_user_role() in ('vault', 'processor'));

-- Commission records — vault only
create policy commission_records_vault on public.commission_records
  for all to authenticated
  using (private.current_user_role() = 'vault')
  with check (private.current_user_role() = 'vault');

-- ---------------------------------------------------------------------------
-- Storage: private application-documents bucket
-- Path convention: {application_id}/{uuid}-{file_name}
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-documents',
  'application-documents',
  false,
  26214400,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do nothing;

create policy application_documents_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'application-documents'
    and exists (
      select 1 from public.loan_applications a
      where a.id::text = (storage.foldername(name))[1]
        and private.can_access_application(a)
    )
  );

create policy application_documents_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'application-documents'
    and exists (
      select 1 from public.loan_applications a
      where a.id::text = (storage.foldername(name))[1]
        and private.can_access_application(a)
    )
  );

create policy application_documents_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'application-documents'
    and exists (
      select 1 from public.loan_applications a
      where a.id::text = (storage.foldername(name))[1]
        and private.can_access_application(a)
    )
  )
  with check (
    bucket_id = 'application-documents'
    and exists (
      select 1 from public.loan_applications a
      where a.id::text = (storage.foldername(name))[1]
        and private.can_access_application(a)
    )
  );

create policy application_documents_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'application-documents'
    and private.current_user_role() in ('vault', 'processor')
    and exists (
      select 1 from public.loan_applications a
      where a.id::text = (storage.foldername(name))[1]
        and private.can_access_application(a)
    )
  );

-- Seed core vault org (stable UUID for app config / docs)
insert into public.organizations (id, name, org_type, status, website, contact_email)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Vault Financial Services LLC',
  'vault',
  'active',
  'https://www.vaultfs.com',
  'ops@vaultfs.com'
)
on conflict (id) do nothing;