import type { ApplicationStatus, LoanType } from "@/lib/types/database";

/** Plain-language status copy for borrower and ops UI — no rates or timelines promised. */
export const applicationStatusLabels: Record<
  ApplicationStatus,
  { label: string; plain: string }
> = {
  application_submitted: {
    label: "Application submitted",
    plain: "Your file is in. Vault will open initial review next.",
  },
  initial_review: {
    label: "Initial review",
    plain: "Vault is reviewing fit and structure for this deal.",
  },
  loi_issued: {
    label: "LOI issued",
    plain: "A letter of intent was issued. Review terms in your portal when available.",
  },
  package_submission: {
    label: "Package submission",
    plain: "Your processor is gathering the full credit package.",
  },
  info_requested: {
    label: "Information requested",
    plain: "Additional items are needed before the file can move forward.",
  },
  underwriting: {
    label: "Underwriting",
    plain: "The lender desk is reviewing the package.",
  },
  clear_to_close: {
    label: "Clear to close",
    plain: "Conditions are satisfied for closing preparation.",
  },
  closing_prep: {
    label: "Closing prep",
    plain: "Escrow and title are preparing closing documents.",
  },
  signing_funding: {
    label: "Signing & funding",
    plain: "Signing is underway; funding follows when complete.",
  },
  funded: {
    label: "Funded",
    plain: "This file is funded.",
  },
  denied: {
    label: "Denied",
    plain: "This file was not approved. Contact Vault if you have questions.",
  },
};

export const loanTypeLabels: Record<LoanType, string> = {
  private_money: "Private Money",
  rehab_fix_flip: "Rehab / Fix & Flip",
  bridge: "Bridge",
  ground_up: "Ground-Up Construction",
  new_construction: "New Construction",
  dscr_non_qm: "DSCR & Non-QM",
};

export const docTypeLabels: Record<string, string> = {
  purchase_contract: "Purchase contract",
  payoff_statement: "Payoff demand / mortgage statement",
  entity_docs: "Entity documents (articles / OA)",
  insurance: "Insurance",
  bank_statements: "Bank statements (2 months)",
  photo_id: "Photo ID",
  lease_agreement: "Lease agreement(s)",
  rehab_budget: "Rehab budget / scope",
  construction_budget: "Construction budget template",
  contractor_license: "Contractor / builders license",
  contractor_drivers_license: "Contractor driver's license",
  contractor_w9: "Contractor W-9",
  workers_comp_insurance: "Workers' compensation insurance",
  commercial_gl_insurance: "Commercial general liability insurance",
  personal_liability_insurance: "Personal liability insurance (subject property)",
  sreo_schedule: "SREO schedule upload",
  track_record_schedule: "Track record upload",
  loi: "Letter of intent",
  other: "Other",
};
