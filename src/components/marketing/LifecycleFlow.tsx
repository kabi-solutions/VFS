"use client";

import { useId, useState, type ReactNode } from "react";

export type LifecycleStep = {
  id: string;
  title: string;
  body: string;
  icon: "apply" | "review" | "package" | "underwrite" | "close" | "fund";
};

const icons: Record<LifecycleStep["icon"], ReactNode> = {
  apply: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M8 3.5h5.5L18 8v12.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13.5 3.5V8H18M9.5 12h5M9.5 15.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  review: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 16l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  package: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M4.5 8.5 12 4.5l7.5 4v9l-7.5 4-7.5-4v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 12.5v9M4.5 8.5 12 12.5l7.5-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  underwrite: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M7 20V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M5 20h14M9.5 9h5M9.5 12.5h5M9.5 16h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M5 12.5 9.5 17 19 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  fund: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M12 4v16M8.5 8.5c0-1.7 1.6-3 3.5-3s3.5 1.3 3.5 3-1.6 2.5-3.5 2.5-3.5.9-3.5 2.5 1.6 3 3.5 3 3.5-1.3 3.5-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export function LifecycleFlow({ steps }: { steps: LifecycleStep[] }) {
  const [active, setActive] = useState(0);
  const labelId = useId();
  const current = steps[active];

  return (
    <div className="mt-12 overflow-hidden rounded-[2rem] border border-black/[0.04] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8 lg:p-10">
      <div className="hidden md:block">
        <ol className="relative grid grid-cols-6 gap-2" aria-label="Loan lifecycle">
          <div
            className="absolute left-[8%] right-[8%] top-[1.35rem] h-1 rounded-full bg-green-mist"
            aria-hidden
          />
          <div
            className="absolute left-[8%] top-[1.35rem] h-1 rounded-full bg-green transition-[width] duration-300 ease-out"
            style={{ width: `${(active / Math.max(steps.length - 1, 1)) * 84}%` }}
            aria-hidden
          />
          {steps.map((step, index) => {
            const selected = index === active;
            const complete = index < active;
            return (
              <li key={step.id} className="relative z-10 flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  aria-current={selected ? "step" : undefined}
                  aria-describedby={selected ? labelId : undefined}
                  className="group flex w-full flex-col items-center rounded-xl px-1 py-2 text-center focus-visible:outline-offset-4"
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                      selected
                        ? "border-green bg-green text-white shadow-[0_8px_24px_rgba(0,184,92,0.35)]"
                        : complete
                          ? "border-green bg-green-soft text-green"
                          : "border-line-strong bg-paper text-steel group-hover:border-green/40 group-hover:text-ink"
                    }`}
                  >
                    {icons[step.icon]}
                  </span>
                  <span
                    className={`mt-3 text-[0.6875rem] font-semibold tracking-[-0.01em] ${
                      selected ? "text-green" : "text-steel"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mt-1 max-w-[7.5rem] text-[0.8125rem] font-semibold tracking-[-0.015em] ${
                      selected ? "text-ink" : "text-steel"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div
          id={labelId}
          className="mt-10 rounded-[1.5rem] bg-green-mist px-8 py-7"
          role="region"
          aria-live="polite"
        >
          <p className="text-[0.75rem] font-semibold text-green">
            Step {active + 1} of {steps.length}
          </p>
          <h3 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.025em] text-ink">
            {current.title}
          </h3>
          <p className="body-md mt-3 max-w-2xl">{current.body}</p>
        </div>
      </div>

      <ol className="space-y-3 md:hidden" aria-label="Loan lifecycle">
        {steps.map((step, index) => {
          const selected = index === active;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`w-full rounded-[1.25rem] border px-4 py-4 text-left transition-colors ${
                  selected ? "border-green bg-green-mist" : "border-line bg-paper"
                }`}
                aria-expanded={selected}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-green text-white" : "bg-green-soft text-green"
                    }`}
                  >
                    {icons[step.icon]}
                  </span>
                  <span>
                    <span className="block text-[0.6875rem] font-semibold text-steel">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-0.5 block text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                      {step.title}
                    </span>
                    {selected && <span className="body-md mt-2 block">{step.body}</span>}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
