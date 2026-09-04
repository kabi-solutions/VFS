-- Vault Financial Services — Supabase schema (define now, wire later)
-- Status history is append-only via status_events.

create extension if not exists "pgcrypto";

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
  auth_user_id uuid unique,
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
create index documents_application_id_idx on public.documents (application_id);
create index messages_application_id_idx on public.messages (application_id);
