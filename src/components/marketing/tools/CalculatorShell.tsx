import type { ReactNode } from "react";
import { CALCULATOR_DISCLAIMER } from "@/lib/config/calculator-disclaimer";

export function CalculatorShell({
  title,
  description,
  children,
  result,
  cta,
}: {
  title: string;
  description: string;
  children: ReactNode;
  result?: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] bg-white px-6 py-8 shadow-[0_16px_50px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:px-8">
        <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel">{description}</p>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
      <div className="rounded-[2rem] bg-paper px-6 py-8 sm:px-8">
        <p className="text-[0.8125rem] font-semibold tracking-[0.06em] text-green uppercase">
          Result
        </p>
        <div className="mt-4">{result ?? <p className="text-steel">Enter assumptions to see results.</p>}</div>
        {cta ? <div className="mt-6">{cta}</div> : null}
        <p className="mt-6 text-[0.8125rem] leading-relaxed text-steel">{CALCULATOR_DISCLAIMER}</p>
      </div>
    </div>
  );
}

export const calcFieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[1rem] text-ink outline-none focus:border-green";
export const calcLabelClass = "block text-[0.875rem] font-medium text-charcoal";

export function money(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function ratio(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(2);
}

export function parseNum(value: string): number | null {
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}
