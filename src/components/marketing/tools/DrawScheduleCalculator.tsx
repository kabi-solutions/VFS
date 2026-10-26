"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { buildApplyHref } from "@/lib/config/apply-prefill";
import {
  CalculatorShell,
  calcFieldClass,
  calcLabelClass,
  money,
  parseNum,
} from "./CalculatorShell";

const DEFAULT_WEIGHTS = [
  { id: "foundation", label: "Foundation / site", pct: 15 },
  { id: "framing", label: "Framing / shell", pct: 25 },
  { id: "mech", label: "MEP / rough-in", pct: 20 },
  { id: "finish", label: "Finishes", pct: 25 },
  { id: "final", label: "Final / retainage release", pct: 15 },
];

export function DrawScheduleCalculator() {
  const [totalBudget, setTotalBudget] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);

  const result = useMemo(() => {
    const budget = parseNum(totalBudget);
    const loan = parseNum(loanAmount) ?? budget;
    if (budget == null || budget <= 0) return null;
    const weightSum = weights.reduce((s, w) => s + w.pct, 0);
    const rows = weights.map((w) => {
      const share = weightSum > 0 ? w.pct / weightSum : 0;
      return {
        ...w,
        budgetShare: budget * share,
        loanShare: (loan ?? 0) * share,
      };
    });
    return { rows, weightSum, loan: loan ?? 0 };
  }, [totalBudget, loanAmount, weights]);

  const applyHref = buildApplyHref({
    loanType: "ground_up",
    amount: loanAmount || totalBudget || undefined,
    rehabBudget: totalBudget || undefined,
    source: "calc-draw",
  });

  function updatePct(id: string, pct: string) {
    const n = parseNum(pct) ?? 0;
    setWeights((prev) => prev.map((w) => (w.id === id ? { ...w, pct: n } : w)));
  }

  return (
    <CalculatorShell
      title="Draw schedule planner"
      description="Allocate a construction or rehab budget across milestones. Adjust weights to match your scope — illustrative only."
      result={
        result ? (
          <div>
            <p className="text-[0.8125rem] text-steel">
              Weight total: {result.weightSum}%
              {Math.abs(result.weightSum - 100) > 0.01
                ? " (normalized in the split below)"
                : ""}
            </p>
            <ul className="mt-4 space-y-3">
              {result.rows.map((row) => (
                <li key={row.id} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <span className="text-[0.9375rem] text-charcoal">{row.label}</span>
                  <span className="text-right">
                    <span className="block text-[1rem] font-semibold text-ink">
                      {money(row.loanShare)}
                    </span>
                    <span className="text-[0.75rem] text-steel">
                      budget {money(row.budgetShare)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : undefined
      }
      cta={
        <Button href={applyHref} shine>
          Start your file
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={calcLabelClass} htmlFor="draw-budget">Total construction / rehab budget</label>
          <input id="draw-budget" className={calcFieldClass} value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="draw-loan">Assumed loan amount (optional)</label>
          <input id="draw-loan" className={calcFieldClass} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} inputMode="decimal" />
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <p className="text-[0.875rem] font-medium text-charcoal">Milestone weights (%)</p>
        {weights.map((w) => (
          <div key={w.id} className="grid grid-cols-[1fr_6rem] items-center gap-3">
            <label className="text-[0.9375rem] text-charcoal" htmlFor={`draw-${w.id}`}>
              {w.label}
            </label>
            <input
              id={`draw-${w.id}`}
              className={calcFieldClass}
              value={String(w.pct)}
              onChange={(e) => updatePct(w.id, e.target.value)}
              inputMode="decimal"
            />
          </div>
        ))}
      </div>
    </CalculatorShell>
  );
}
