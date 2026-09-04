import type { Organization } from "@/lib/types/database";
import { organizations } from "@/lib/mock/data";

export type CapitalPartnerApplicationInput = {
  firmName: string;
  contactName: string;
  email: string;
  phone: string;
  deployableCapital: string;
  notes: string;
};

export type CapitalPartnerApplicationRecord = CapitalPartnerApplicationInput & {
  id: string;
  organizationId: string;
  submittedAt: string;
};

/** In-memory pending partner applications for the marketing mock layer. */
const pendingApplications: CapitalPartnerApplicationRecord[] = [];

export function listCapitalPartnerApplications(): CapitalPartnerApplicationRecord[] {
  return [...pendingApplications];
}

/**
 * Creates a pending `capital_partner` organization record for diligence —
 * not a disposable lead. Mirrors organizations.status = pending_review.
 */
export function submitCapitalPartnerApplication(
  input: CapitalPartnerApplicationInput,
): { application: CapitalPartnerApplicationRecord; organization: Organization } {
  const now = new Date().toISOString();
  const organization: Organization = {
    id: `org-cp-${Date.now()}`,
    name: input.firmName.trim(),
    org_type: "capital_partner",
    status: "pending_review",
    website: null,
    contact_email: input.email.trim().toLowerCase(),
    created_at: now,
    updated_at: now,
  };

  organizations.push(organization);

  const application: CapitalPartnerApplicationRecord = {
    id: `cpa-${Date.now()}`,
    organizationId: organization.id,
    submittedAt: now,
    ...input,
  };

  pendingApplications.push(application);

  return { application, organization };
}
