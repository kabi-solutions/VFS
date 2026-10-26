"use client";

import {
  getPackageCompleteness,
  type ApplicationPackage,
  type CompletenessItem,
} from "@/lib/apply/package";
import type { LoanType } from "@/lib/types/database";

type Props = {
  pkg: ApplicationPackage;
  loanType: LoanType;
  docTypes?: string[];
  onJump?: (item: CompletenessItem) => void;
  className?: string;
};

export function PackageMeter({
  pkg,
  loanType,
  docTypes = [],
  onJump,
  className = "",
}: Props) {
  const completeness = getPackageCompleteness(pkg, loanType, docTypes);
  const outstanding = completeness.missing.length;
  const percent = completeness.percent;

  return (
    <div
      className={`rounded-[1.25rem] bg-green-mist/80 px-4 py-4 sm:px-5 ${className}`}
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.9375rem] font-semibold text-ink">
          Package {percent}% complete
          {outstanding > 0 ? (
            <span className="font-medium text-steel">
              {" "}
              — {outstanding} item{outstanding === 1 ? "" : "s"} outstanding
            </span>
          ) : (
            <span className="font-medium text-green"> — nothing outstanding</span>
          )}
        </p>
        <div
          className="h-2 w-28 overflow-hidden rounded-full bg-white/80 sm:w-36"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Package completeness"
        >
          <div
            className="h-full rounded-full bg-green transition-[width] duration-300"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          />
        </div>
      </div>
      {outstanding > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {completeness.missing.slice(0, 8).map((item) => (
            <li key={item.id}>
              {onJump ? (
                <button
                  type="button"
                  onClick={() => onJump(item)}
                  className="rounded-full bg-white px-2.5 py-1 text-[0.8125rem] font-medium text-charcoal ring-1 ring-line transition hover:ring-green/40"
                >
                  {item.label}
                </button>
              ) : (
                <span className="rounded-full bg-white px-2.5 py-1 text-[0.8125rem] text-charcoal ring-1 ring-line">
                  {item.label}
                </span>
              )}
            </li>
          ))}
          {outstanding > 8 ? (
            <li className="self-center text-[0.8125rem] text-steel">+{outstanding - 8} more</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
