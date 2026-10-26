import type { ApplicationPackage } from "@/lib/apply/package";
import type {
  Condition,
  Document,
  LoanApplication,
  Organization,
  StatusEvent,
  User,
} from "@/lib/types/database";

function num(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function requireNum(value: unknown, fallback = 0): number {
  return num(value) ?? fallback;
}

export function mapUser(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    auth_user_id: row.auth_user_id ? String(row.auth_user_id) : null,
    email: String(row.email),
    full_name: String(row.full_name),
    phone: row.phone != null ? String(row.phone) : null,
    role: row.role as User["role"],
    organization_id: row.organization_id ? String(row.organization_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapOrganization(row: Record<string, unknown>): Organization {
  return {
    id: String(row.id),
    name: String(row.name),
    org_type: row.org_type as Organization["org_type"],
    status: row.status as Organization["status"],
    website: row.website != null ? String(row.website) : null,
    contact_email: row.contact_email != null ? String(row.contact_email) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapApplication(row: Record<string, unknown>): LoanApplication {
  return {
    id: String(row.id),
    reference_code: String(row.reference_code),
    borrower_id: String(row.borrower_id),
    loan_type: row.loan_type as LoanApplication["loan_type"],
    status: row.status as LoanApplication["status"],
    info_requested_from: (row.info_requested_from as LoanApplication["info_requested_from"]) ?? null,
    prior_application_id: row.prior_application_id ? String(row.prior_application_id) : null,
    property_address: String(row.property_address),
    property_city: String(row.property_city),
    property_state: String(row.property_state),
    property_postal: String(row.property_postal),
    purchase_price: num(row.purchase_price),
    loan_amount: requireNum(row.loan_amount),
    estimated_arv: num(row.estimated_arv),
    processor_org_id: row.processor_org_id ? String(row.processor_org_id) : null,
    lender_org_id: row.lender_org_id ? String(row.lender_org_id) : null,
    escrow_org_id: row.escrow_org_id ? String(row.escrow_org_id) : null,
    assigned_processor_id: row.assigned_processor_id
      ? String(row.assigned_processor_id)
      : null,
    attribution_source_id:
      (row.attribution_source_id as LoanApplication["attribution_source_id"]) ?? null,
    commission_rate: num(row.commission_rate),
    package: (row.package as ApplicationPackage | null) ?? null,
    package_complete: Boolean(row.package_complete),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    funded_at: row.funded_at ? String(row.funded_at) : null,
    denied_at: row.denied_at ? String(row.denied_at) : null,
  };
}

export function mapStatusEvent(row: Record<string, unknown>): StatusEvent {
  return {
    id: String(row.id),
    application_id: String(row.application_id),
    actor_id: row.actor_id ? String(row.actor_id) : null,
    from_status: (row.from_status as StatusEvent["from_status"]) ?? null,
    to_status: row.to_status as StatusEvent["to_status"],
    note: row.note != null ? String(row.note) : null,
    created_at: String(row.created_at),
  };
}

export function mapDocument(row: Record<string, unknown>): Document {
  return {
    id: String(row.id),
    application_id: String(row.application_id),
    doc_type: String(row.doc_type),
    file_name: String(row.file_name),
    storage_path: String(row.storage_path),
    mime_type: row.mime_type != null ? String(row.mime_type) : null,
    file_size_bytes: num(row.file_size_bytes),
    status: row.status as Document["status"],
    uploaded_by: row.uploaded_by ? String(row.uploaded_by) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapCondition(row: Record<string, unknown>): Condition {
  return {
    id: String(row.id),
    application_id: String(row.application_id),
    description: String(row.description),
    status: row.status as Condition["status"],
    created_by: row.created_by ? String(row.created_by) : null,
    created_at: String(row.created_at),
    satisfied_at: row.satisfied_at ? String(row.satisfied_at) : null,
  };
}
