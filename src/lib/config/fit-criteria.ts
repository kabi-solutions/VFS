/**
 * Qualification / “Do you fit?” criteria shown on homepage and solution pages.
 *
 * TODO (Vault): Confirm every constant below before launch. Values are placeholders
 * for fit messaging only — not an offer of credit or underwriting guideline.
 */

export const FIT_CAPTION =
  "These are fit criteria, not an offer of credit. Terms are evaluated deal by deal.";

/** TODO (Vault): Confirm property-use framing. */
export const FIT_PROPERTY_USE =
  "Business-purpose, non-owner-occupied investment real estate";

/** TODO (Vault): Confirm property types Vault will discuss. */
export const FIT_PROPERTY_TYPES = [
  "1–4 unit residential investment",
  "Small multifamily (as program allows)",
  "Select commercial / mixed-use (case by case)",
] as const;

/**
 * TODO (Vault): Confirm loan size range for public fit messaging.
 * Keep qualitative until counsel/ops approve numeric bounds for marketing.
 */
export const FIT_LOAN_SIZE_MIN = 100_000;
export const FIT_LOAN_SIZE_MAX = 5_000_000;
export const FIT_LOAN_SIZE_LABEL = `Typically $${FIT_LOAN_SIZE_MIN.toLocaleString("en-US")}–$${FIT_LOAN_SIZE_MAX.toLocaleString("en-US")} (deal-dependent)`;

/** TODO (Vault): Confirm entity / vesting expectations. */
export const FIT_ENTITY =
  "Entity borrowers preferred; individual vesting evaluated when the file supports it";

/** TODO (Vault): Confirm experience framing for public fit box. */
export const FIT_EXPERIENCE =
  "First project through high-volume operators — experience shapes structure, not a hard gate on the form";

/** TODO (Vault): Confirm which markets belong in public fit copy; detail lives at /locations. */
export const FIT_STATES_HREF = "/locations";
export const FIT_STATES_LABEL =
  "Priority markets listed under Locations — licensing confirmed via diligence pack";

export type FitCriterion = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

export const fitCriteria: FitCriterion[] = [
  { id: "use", label: "Property use", value: FIT_PROPERTY_USE },
  {
    id: "types",
    label: "Property types",
    value: FIT_PROPERTY_TYPES.join("; "),
  },
  { id: "size", label: "Loan size", value: FIT_LOAN_SIZE_LABEL },
  { id: "entity", label: "Borrower", value: FIT_ENTITY },
  { id: "experience", label: "Experience", value: FIT_EXPERIENCE },
  {
    id: "states",
    label: "Markets",
    value: FIT_STATES_LABEL,
    href: FIT_STATES_HREF,
  },
];
