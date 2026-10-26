import Link from "next/link";
import { FIT_CAPTION, fitCriteria } from "@/lib/config/fit-criteria";

export function QualificationBox({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <aside
      className={`rounded-[1.75rem] bg-paper px-6 py-7 ring-1 ring-black/[0.04] sm:px-8 ${className}`}
      aria-labelledby="fit-criteria-heading"
    >
      <p className="text-[0.8125rem] font-semibold tracking-[0.06em] text-green uppercase">
        Do you fit?
      </p>
      <h2
        id="fit-criteria-heading"
        className={`mt-2 font-semibold tracking-[-0.02em] text-ink ${
          compact ? "text-[1.125rem]" : "text-[1.375rem]"
        }`}
      >
        Fit criteria for investor files
      </h2>
      <ul className="mt-5 space-y-3">
        {fitCriteria.map((item) => (
          <li key={item.id} className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
            <span className="text-[0.8125rem] font-semibold text-steel">{item.label}</span>
            <span className="text-[0.9375rem] leading-relaxed text-charcoal">
              {item.href ? (
                <Link href={item.href} className="text-green hover:text-green-hover">
                  {item.value}
                </Link>
              ) : (
                item.value
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[0.8125rem] leading-relaxed text-steel">{FIT_CAPTION}</p>
    </aside>
  );
}
