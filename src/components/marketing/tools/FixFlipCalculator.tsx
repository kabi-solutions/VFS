"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CALCULATOR_RATE_HINT } from "@/lib/config/calculator-disclaimer";
import { buildApplyHref } from "@/lib/config/apply-prefill";
import {
  CalculatorShell,
  calcFieldClass,
  calcLabelClass,
  money,
  parseNum,
} from "./CalculatorShell";

export function FixFlipCalculator() {
  const [purchase, setPurchase] = useState("");
  const [rehab, setRehab] = useState("");
  const [arv, setArv] = useState("");
  const [holding, setHolding] = useState("");
  const [sellingCostsPct, setSellingCostsPct] = useState("6");
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("6");

  const result = useMemo(() => {
    const p = parseNum(purchase);
    const r = parseNum(rehab) ?? 0;
    const a = parseNum(arv);
    const hold = parseNum(holding) ?? 0;
    const sellPct = parseNum(sellingCostsPct) ?? 0;
    const loan = parseNum(loanAmount) ?? 0;
    const annualRate = parseNum(rate) ?? 0;
    const m = parseNum(months) ?? 0;
    if (p == null || a == null) return null;
    const sellingCosts = a * (sellPct / 100);
    const interest = loan * (annualRate / 100) * (m / 12);
    const totalCost = p + r + hold + interest + sellingCosts;
    const profit = a - totalCost;
    return { totalCost, profit, sellingCosts, interest };
  }, [purchase, rehab, arv, holding, sellingCostsPct, loanAmount, rate, months]);

  const applyHref = buildApplyHref({
    loanType: "rehab_fix_flip",
    amount: loanAmount || undefined,
    purchasePrice: purchase || undefined,
    rehabBudget: rehab || undefined,
    arv: arv || undefined,
    source: "calc-fix-flip",
  });

  return (
    <CalculatorShell
      title="Fix & flip profit / ARV"
      description="Estimate profit from purchase, rehab, ARV, and your financing assumptions."
      result={
        result ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-[0.8125rem] text-steel">All-in cost (your assumptions)</dt>
              <dd className="text-[1.25rem] font-semibold text-ink">{money(result.totalCost)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. selling costs</dt>
              <dd className="text-[1.125rem] font-semibold text-ink">{money(result.sellingCosts)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. interest carry</dt>
              <dd className="text-[1.125rem] font-semibold text-ink">{money(result.interest)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. profit</dt>
              <dd className="text-[1.5rem] font-semibold text-ink">{money(result.profit)}</dd>
            </div>
          </dl>
        ) : undefined
      }
      cta={
        <Button href={applyHref} shine>
          Apply Now
        </Button>
      }
    >
      <p className="text-[0.8125rem] text-steel">{CALCULATOR_RATE_HINT}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={calcLabelClass} htmlFor="ff-purchase">Purchase price</label>
          <input id="ff-purchase" className={calcFieldClass} value={purchase} onChange={(e) => setPurchase(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-rehab">Rehab budget</label>
          <input id="ff-rehab" className={calcFieldClass} value={rehab} onChange={(e) => setRehab(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-arv">After-repair value (ARV)</label>
          <input id="ff-arv" className={calcFieldClass} value={arv} onChange={(e) => setArv(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-hold">Holding costs (taxes, insurance, utilities)</label>
          <input id="ff-hold" className={calcFieldClass} value={holding} onChange={(e) => setHolding(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-loan">Assumed loan amount</label>
          <input id="ff-loan" className={calcFieldClass} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-rate">Assumed annual rate (%)</label>
          <input id="ff-rate" className={calcFieldClass} value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-months">Hold (months)</label>
          <input id="ff-months" className={calcFieldClass} value={months} onChange={(e) => setMonths(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="ff-sell">Selling costs (%)</label>
          <input id="ff-sell" className={calcFieldClass} value={sellingCostsPct} onChange={(e) => setSellingCostsPct(e.target.value)} inputMode="decimal" />
        </div>
      </div>
    </CalculatorShell>
  );
}
