import type { LoanType } from "@/lib/types/database";

/** Query keys used by screener / calculators to prefill Apply. */
export const APPLY_PREFILL_KEYS = [
  "address",
  "loanType",
  "amount",
  "timeline",
  "purchasePrice",
  "rehabBudget",
  "arv",
  "source",
] as const;

export type ApplyPrefillKey = (typeof APPLY_PREFILL_KEYS)[number];

export type ApplyPrefill = Partial<Record<ApplyPrefillKey, string>>;

const LOAN_TYPE_VALUES: LoanType[] = [
  "private_money",
  "rehab_fix_flip",
  "bridge",
  "ground_up",
  "new_construction",
  "dscr_non_qm",
];

export function isLoanType(value: string | undefined | null): value is LoanType {
  return !!value && (LOAN_TYPE_VALUES as string[]).includes(value);
}

export function parseApplyPrefill(
  params: Record<string, string | string[] | undefined>,
): ApplyPrefill {
  const out: ApplyPrefill = {};
  for (const key of APPLY_PREFILL_KEYS) {
    const raw = params[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (value && value.trim()) out[key] = value.trim();
  }
  return out;
}

export function buildApplyHref(prefill: ApplyPrefill = {}): string {
  const qs = new URLSearchParams();
  for (const key of APPLY_PREFILL_KEYS) {
    const value = prefill[key];
    if (value) qs.set(key, value);
  }
  const q = qs.toString();
  return q ? `/apply?${q}` : "/apply";
}

/** Screener timeline options → months hint for strategy.anticipated_hold_months */
export const TIMELINE_OPTIONS = [
  { value: "30", label: "Within 30 days", months: "1" },
  { value: "60", label: "30–60 days", months: "2" },
  { value: "90", label: "60–90 days", months: "3" },
  { value: "180", label: "3–6 months", months: "6" },
  { value: "flexible", label: "Flexible / exploring", months: "" },
] as const;

export function timelineToHoldMonths(timeline: string | undefined): string {
  const match = TIMELINE_OPTIONS.find((o) => o.value === timeline);
  return match?.months ?? "";
}
