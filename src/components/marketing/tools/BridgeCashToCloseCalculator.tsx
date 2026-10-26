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

export function BridgeCashToCloseCalculator() {
  const [purchase, setPurchase] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [pointsPct, setPointsPct] = useState("");
  const [closingCosts, setClosingCosts] = useState("");
  const [prepaidInterestMonths, setPrepaidInterestMonths] = useState("0");
  const [rate, setRate] = useState("");
  const [reserves, setReserves] = useState("");
  const [credits, setCredits] = useState("");

  const result = useMemo(() => {
    const p = parseNum(purchase);
    const loan = parseNum(loanAmount);
    if (p == null || loan == null) return null;
    const points = ((parseNum(pointsPct) ?? 0) / 100) * loan;
    const closing = parseNum(closingCosts) ?? 0;
    const months = parseNum(prepaidInterestMonths) ?? 0;
    const annualRate = parseNum(rate) ?? 0;
    const prepaid = loan * (annualRate / 100) * (months / 12);
    const reserve = parseNum(reserves) ?? 0;
    const credit = parseNum(credits) ?? 0;
    const dueAtClose = p + points + closing + prepaid + reserve - loan - credit;
    return { points, prepaid, dueAtClose, equity: p - loan };
  }, [purchase, loanAmount, pointsPct, closingCosts, prepaidInterestMonths, rate, reserves, credits]);

  const applyHref = buildApplyHref({
    loanType: "bridge",
    amount: loanAmount || undefined,
    purchasePrice: purchase || undefined,
    source: "calc-bridge",
  });

  return (
    <CalculatorShell
      title="Bridge cash-to-close"
      description="Estimate cash needed at close from purchase, loan proceeds, and your fee / carry assumptions."
      result={
        result ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-[0.8125rem] text-steel">Equity / down (purchase − loan)</dt>
              <dd className="text-[1.25rem] font-semibold text-ink">{money(result.equity)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. points</dt>
              <dd className="text-[1.125rem] font-semibold text-ink">{money(result.points)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. prepaid interest</dt>
              <dd className="text-[1.125rem] font-semibold text-ink">{money(result.prepaid)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. cash to close</dt>
              <dd className="text-[1.5rem] font-semibold text-ink">{money(result.dueAtClose)}</dd>
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
          <label className={calcLabelClass} htmlFor="br-purchase">Purchase price / payoff need</label>
          <input id="br-purchase" className={calcFieldClass} value={purchase} onChange={(e) => setPurchase(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-loan">Assumed loan amount</label>
          <input id="br-loan" className={calcFieldClass} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-points">Assumed points (%)</label>
          <input id="br-points" className={calcFieldClass} value={pointsPct} onChange={(e) => setPointsPct(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-closing">Other closing costs</label>
          <input id="br-closing" className={calcFieldClass} value={closingCosts} onChange={(e) => setClosingCosts(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-rate">Assumed annual rate (%)</label>
          <input id="br-rate" className={calcFieldClass} value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-prepay">Prepaid interest (months)</label>
          <input id="br-prepay" className={calcFieldClass} value={prepaidInterestMonths} onChange={(e) => setPrepaidInterestMonths(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-reserves">Reserves / escrows due at close</label>
          <input id="br-reserves" className={calcFieldClass} value={reserves} onChange={(e) => setReserves(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="br-credits">Credits / deposits applied</label>
          <input id="br-credits" className={calcFieldClass} value={credits} onChange={(e) => setCredits(e.target.value)} inputMode="decimal" />
        </div>
      </div>
    </CalculatorShell>
  );
}
