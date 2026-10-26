"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  FIT_LOAN_SIZE_MAX,
  FIT_LOAN_SIZE_MIN,
  FIT_CAPTION,
} from "@/lib/config/fit-criteria";
import {
  TIMELINE_OPTIONS,
  buildApplyHref,
  isLoanType,
} from "@/lib/config/apply-prefill";
import { loanTypeLabels } from "@/lib/mock/status-labels";
import type { LoanType } from "@/lib/types/database";

type FitResult = "likely" | "edge" | "unclear";

function evaluateFit(amount: number | null, loanType: string): FitResult {
  if (amount == null || amount <= 0 || !loanType) return "unclear";
  if (amount < FIT_LOAN_SIZE_MIN * 0.5 || amount > FIT_LOAN_SIZE_MAX * 1.25) {
    return "edge";
  }
  if (amount >= FIT_LOAN_SIZE_MIN && amount <= FIT_LOAN_SIZE_MAX) return "likely";
  return "edge";
}

const fitCopy: Record<FitResult, { title: string; body: string }> = {
  likely: {
    title: "This looks like a conversation Vault can take.",
    body: "Based on loan size and product shape alone — not credit, collateral, or licensing. Start a file so the team can review the full package.",
  },
  edge: {
    title: "Possible edge case — still worth a file or a call.",
    body: "Size or structure may sit outside the typical range. That is not a denial. Talk to Vault or start a file with context.",
  },
  unclear: {
    title: "Add a few details to see a preliminary fit read.",
    body: "Address, loan type, amount, and timeline help us route the conversation. No indication here is an approval.",
  },
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[1rem] text-ink outline-none focus:border-green";
const labelClass = "block text-[0.875rem] font-medium text-charcoal";

export function DealScreener() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loanType, setLoanType] = useState<LoanType | "">("");
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const amountNum = useMemo(() => {
    const n = Number(String(amount).replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }, [amount]);

  const fit = evaluateFit(amountNum, loanType);
  const copy = fitCopy[submitted ? fit : "unclear"];

  function onCheck(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function onStartFile() {
    if (!isLoanType(loanType) && loanType !== "") return;
    const href = buildApplyHref({
      address: address.trim() || undefined,
      loanType: loanType || undefined,
      amount: amount.trim() || undefined,
      timeline: timeline || undefined,
      source: "screener",
    });
    router.push(href);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={onCheck}
        className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_16px_50px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:px-8"
      >
        <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
          Four fields. No credit decision.
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel">
          Preliminary fit only — not underwriting, pricing, or approval.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="screener-address" className={labelClass}>
              Property address
            </label>
            <input
              id="screener-address"
              className={fieldClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
              placeholder="Street, city, state"
            />
          </div>
          <div>
            <label htmlFor="screener-loan-type" className={labelClass}>
              Loan type
            </label>
            <select
              id="screener-loan-type"
              className={fieldClass}
              value={loanType}
              onChange={(e) => setLoanType(e.target.value as LoanType | "")}
              required
            >
              <option value="">Select…</option>
              {(Object.keys(loanTypeLabels) as LoanType[]).map((t) => (
                <option key={t} value={t}>
                  {loanTypeLabels[t]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="screener-amount" className={labelClass}>
              Requested loan amount (USD)
            </label>
            <input
              id="screener-amount"
              className={fieldClass}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 450000"
              required
            />
          </div>
          <div>
            <label htmlFor="screener-timeline" className={labelClass}>
              Funding timeline
            </label>
            <select
              id="screener-timeline"
              className={fieldClass}
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              required
            >
              <option value="">Select…</option>
              {TIMELINE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="submit">Check fit</Button>
          <Button type="button" variant="secondary" onClick={onStartFile}>
            Start your file
          </Button>
        </div>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-steel">{FIT_CAPTION}</p>
      </form>

      <div className="rounded-[2rem] bg-green-mist px-6 py-8 sm:px-8">
        <p className="text-[0.8125rem] font-semibold tracking-[0.06em] text-green uppercase">
          Fit indication
        </p>
        <h3 className="mt-3 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
          {copy.title}
        </h3>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-charcoal">{copy.body}</p>
        {submitted ? (
          <div className="mt-6">
            <Button type="button" shine onClick={onStartFile}>
              Start your file with these details
            </Button>
            <p className="mt-3 text-[0.8125rem] text-steel">
              Never a promise of approval. Terms are evaluated deal by deal.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
