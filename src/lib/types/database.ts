/** Types mirroring supabase/schema.sql — swap mock layer for live queries later. */

export type UserRole = "borrower" | "vault" | "processor" | "lender" | "escrow";

export type OrgType =
  | "vault"
  | "processor"
  | "lender"
  | "escrow"
  | "capital_partner";

export type OrgStatus = "pending_review" | "active" | "inactive" | "rejected";

export type LoanType =
  | "private_money"
  | "rehab_fix_flip"
  | "bridge"
  | "ground_up"
  | "dscr_non_qm";

export type ApplicationStatus =
  | "application_submitted"
  | "initial_review"
  | "loi_issued"
  | "package_submission"
  | "info_requested"
  | "underwriting"
  | "clear_to_close"
  | "closing_prep"
  | "signing_funding"
  | "funded"
  | "denied";

export type DocumentStatus = "pending" | "received" | "approved" | "rejected";
export type ConditionStatus = "open" | "satisfied" | "waived";
export type MessageVisibility =
  | "borrower_visible"
  | "internal"
  | "lender_visible"
  | "escrow_visible";

export type AttributionSourceId =
  | "organic_search"
  | "paid_search"
  | "paid_social"
  | "email_campaign"
  | "retargeting"
  | "partner_referral"
  | "direct_apply"
  | "referral_other";

export interface Organization {
  id: string;
  name: string;
  org_type: OrgType;
  status: OrgStatus;
  website: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoanApplication {
  id: string;
  reference_code: string;
  borrower_id: string;
  loan_type: LoanType;
  status: ApplicationStatus;
  info_requested_from: ApplicationStatus | null;
  prior_application_id: string | null;
  property_address: string;
  property_city: string;
  property_state: string;
  property_postal: string;
  purchase_price: number | null;
  loan_amount: number;
  estimated_arv: number | null;
  processor_org_id: string | null;
  lender_org_id: string | null;
  escrow_org_id: string | null;
  assigned_processor_id: string | null;
  attribution_source_id: AttributionSourceId | null;
  commission_rate: number | null;
  created_at: string;
  updated_at: string;
  funded_at: string | null;
  denied_at: string | null;
}

export interface StatusEvent {
  id: string;
  application_id: string;
  actor_id: string | null;
  from_status: ApplicationStatus | null;
  to_status: ApplicationStatus;
  note: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  doc_type: string;
  file_name: string;
  storage_path: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  status: DocumentStatus;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  application_id: string;
  sender_id: string;
  visibility: MessageVisibility;
  body: string;
  created_at: string;
}

export interface Condition {
  id: string;
  application_id: string;
  description: string;
  status: ConditionStatus;
  created_by: string | null;
  created_at: string;
  satisfied_at: string | null;
}

export interface CommissionRecord {
  id: string;
  application_id: string;
  funded_amount: number;
  commission_rate: number;
  commission_amount: number;
  attribution_source_id: AttributionSourceId | null;
  paid_at: string | null;
  created_at: string;
}

export interface SessionUser {
  user: User;
  organization: Organization | null;
}
