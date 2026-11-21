/**
 * Marketing speed claims — single source of truth.
 *
 * Confirmed for public site: typical ~10 days; as little as 2 days has occurred.
 * Do not invent day counts in JSX; always import from here.
 */
export const TARGET_DAYS = 10;
export const FASTEST_DAYS = 2;

/** Short hero / strip claim. */
export function fundingSpeedClaimShort(): string {
  return "Funding in days, not weeks.";
}

/** Canonical funding-speed sentence used wherever speed is claimed. */
export function fundingSpeedClaim(days: number = TARGET_DAYS): string {
  return `Funding in as few as ${days} business days once your package is complete.`;
}

/** FAQ / long-form funding timeline (ops-approved wording). */
export function fundingSpeedClaimDetailed(): string {
  return `While the timing on any project can never be guaranteed, we have funded projects in as little as ${FASTEST_DAYS} days. Typically, projects are funded in ${TARGET_DAYS} days. Certain required steps, such as an appraisal can extend this time and is outside of the control of any lender.`;
}
