"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type LifecycleStep = {
  id: string;
  title: string;
  body: string;
  image: { src: string; alt: string };
};

export function LifecycleFlow({ steps }: { steps: LifecycleStep[] }) {
  const [active, setActive] = useState(0);
  const labelId = useId();
  const current = steps[active] ?? steps[0];

  if (!current) return null;

  return (
    <div className="mt-12">
      <div className="overflow-hidden rounded-[var(--radius-panel)] bg-white shadow-[var(--shadow-card)] ring-1 ring-[var(--card-ring)]">
        <div className="grid lg:min-h-[28rem] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative isolate aspect-[16/10] min-w-0 overflow-hidden lg:aspect-auto lg:min-h-[28rem]">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ease-out ${
                  index === active
                    ? "z-[1] opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 560px"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-green">
                    {step.title}
                  </p>
                  <p className="mt-2 max-w-[28rem] text-[1.0625rem] font-medium leading-relaxed text-white sm:text-[1.125rem]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex min-w-0 flex-col justify-center bg-paper px-5 py-8 sm:px-8 xl:px-10">
            <p className="text-[0.875rem] font-semibold text-green">Your file, end to end</p>
            <h3 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.75rem]">
              Six gates. One audited path.
            </h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-steel">
              Select a stage to see what happens next — the same sequence you track in the borrower
              portal.
            </p>

            <ol className="mt-8 space-y-2" aria-label="Loan lifecycle" id={labelId}>
              {steps.map((step, index) => {
                const selected = index === active;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => {
                        if (
                          typeof window !== "undefined" &&
                          window.matchMedia("(hover: hover)").matches
                        ) {
                          setActive(index);
                        }
                      }}
                      onFocus={() => setActive(index)}
                      aria-current={selected ? "step" : undefined}
                      className={`group flex w-full items-center gap-4 rounded-[var(--radius-card)] px-4 py-3.5 text-left transition-all duration-200 ${
                        selected
                          ? "bg-white shadow-[var(--shadow-card)] ring-1 ring-green/25"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.875rem] font-semibold ${
                          selected ? "bg-green text-white" : "bg-white text-steel ring-1 ring-line"
                        }`}
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-[1.0625rem] font-semibold tracking-[-0.02em] ${
                            selected ? "text-ink" : "text-charcoal"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`mt-0.5 block truncate text-[0.875rem] ${
                            selected ? "text-steel" : "text-steel/80"
                          }`}
                        >
                          {step.body}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {current.title}: {current.body}
      </p>
    </div>
  );
}
