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
  const current = steps[active];

  return (
    <div className="mt-12">
      <div className="hidden overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] lg:block">
        <div className="grid min-h-[28rem] grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[28rem]">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  index === active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={index !== active}
              >
                <Image
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-green">
                    {step.title}
                  </p>
                  <p className="mt-2 max-w-[28rem] text-[1.125rem] font-medium leading-relaxed text-white">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center bg-paper px-8 py-10 xl:px-10">
            <p className="text-[0.875rem] font-semibold text-green">Your file, end to end</p>
            <h3 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
              Six gates. One audited path.
            </h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-steel">
              Hover or select a stage to see what happens next — the same sequence you track in the
              borrower portal.
            </p>

            <ol className="mt-8 space-y-2" aria-label="Loan lifecycle" id={labelId}>
              {steps.map((step, index) => {
                const selected = index === active;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      aria-current={selected ? "step" : undefined}
                      className={`group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 ${
                        selected
                          ? "bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] ring-1 ring-green/25"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl ${
                          selected ? "ring-2 ring-green ring-offset-2 ring-offset-paper" : ""
                        }`}
                      >
                        <Image
                          src={step.image.src}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="56px"
                        />
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

      <ol className="space-y-4 lg:hidden" aria-label="Loan lifecycle">
        {steps.map((step, index) => {
          const selected = index === active;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => setActive(index)}
                className={`w-full overflow-hidden rounded-[1.75rem] text-left shadow-[0_16px_40px_rgba(0,0,0,0.06)] ring-1 transition-all ${
                  selected ? "ring-green/40" : "ring-black/[0.04]"
                }`}
                aria-expanded={selected}
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-white">
                      {step.title}
                    </p>
                  </div>
                </div>
                {selected ? (
                  <div className="bg-white px-5 py-4">
                    <p className="text-[1rem] leading-relaxed text-steel">{step.body}</p>
                  </div>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="sr-only" aria-live="polite">
        {current.title}: {current.body}
      </p>
    </div>
  );
}
