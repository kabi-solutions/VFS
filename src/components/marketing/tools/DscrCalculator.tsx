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
  ratio,
} from "./CalculatorShell";

export function DscrCalculator() {
  const [rent, setRent] = useState("");
  const [expenses, setExpenses] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [rate, setRate] = useState("");
  const [termYears, setTermYears] = useState("30");

  const result = useMemo(() => {
    const monthlyRent = parseNum(rent);
    const monthlyExp = parseNum(expenses) ?? 0;
    const principal = parseNum(loanAmount);
    const annualRate = parseNum(rate);
    const years = parseNum(termYears);
    if (
      monthlyRent == null ||
      principal == null ||
      annualRate == null ||
      years == null ||
      principal <= 0 ||
      years <= 0
    ) {
      return null;
    }
    const noi = monthlyRent - monthlyExp;
    const monthlyRate = annualRate / 100 / 12;
    const n = years * 12;
    const payment =
      monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    const dscr = payment > 0 ? noi / payment : NaN;
    return { noi, payment, dscr };
  }, [rent, expenses, loanAmount, rate, termYears]);

  const applyHref = buildApplyHref({
    loanType: "dscr_non_qm",
    amount: loanAmount || undefined,
    source: "calc-dscr",
  });

  return (
    <CalculatorShell
      title="DSCR calculator"
      description="Debt-service coverage from your rent, expense, rate, and term assumptions."
      result={
        result ? (
          <dl className="space-y-3">
            <div>
              <dt className="text-[0.8125rem] text-steel">Monthly NOI (your inputs)</dt>
              <dd className="text-[1.25rem] font-semibold text-ink">{money(result.noi)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">Est. monthly debt service</dt>
              <dd className="text-[1.25rem] font-semibold text-ink">{money(result.payment)}</dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-steel">DSCR</dt>
              <dd className="text-[1.5rem] font-semibold text-ink">{ratio(result.dscr)}x</dd>
            </div>
          </dl>
        ) : undefined
      }
      cta={
        <Button href={applyHref} shine>
          Start your file
        </Button>
      }
    >
      <p className="text-[0.8125rem] text-steel">{CALCULATOR_RATE_HINT}</p>
      <div>
        <label className={calcLabelClass} htmlFor="dscr-rent">
          Gross monthly rent
        </label>
        <input id="dscr-rent" className={calcFieldClass} value={rent} onChange={(e) => setRent(e.target.value)} inputMode="decimal" />
      </div>
      <div>
        <label className={calcLabelClass} htmlFor="dscr-exp">
          Monthly operating expenses
        </label>
        <input id="dscr-exp" className={calcFieldClass} value={expenses} onChange={(e) => setExpenses(e.target.value)} inputMode="decimal" />
      </div>
      <div>
        <label className={calcLabelClass} htmlFor="dscr-loan">
          Loan amount
        </label>
        <input id="dscr-loan" className={calcFieldClass} value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} inputMode="decimal" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={calcLabelClass} htmlFor="dscr-rate">
            Assumed annual rate (%)
          </label>
          <input id="dscr-rate" className={calcFieldClass} value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" />
        </div>
        <div>
          <label className={calcLabelClass} htmlFor="dscr-term">
            Amortization (years)
          </label>
          <input id="dscr-term" className={calcFieldClass} value={termYears} onChange={(e) => setTermYears(e.target.value)} inputMode="decimal" />
        </div>
      </div>
    </CalculatorShell>
  );
}
