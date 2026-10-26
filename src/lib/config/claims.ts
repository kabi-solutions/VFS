/**
 * Marketing speed claims — single source of truth.
 *
 * TODO (Vault): Confirm TARGET_DAYS is Vault-approved and substantiable before launch.
 * Do not invent day counts in JSX; always import from here.
 */
export const TARGET_DAYS = 10;

/** Canonical funding-speed sentence used wherever speed is claimed. */
export function fundingSpeedClaim(days: number = TARGET_DAYS): string {
  return `Funding in as few as ${days} business days once your package is complete.`;
}
