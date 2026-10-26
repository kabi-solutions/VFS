import type { ReactNode } from "react";
import Link from "next/link";
import {
  FIT_CAPTION,
  FIT_ENTITY,
  FIT_EXPERIENCE,
  FIT_LOAN_SIZE_LABEL,
  FIT_PROPERTY_TYPES,
  FIT_PROPERTY_USE,
  FIT_STATES_HREF,
  FIT_STATES_LABEL,
} from "@/lib/config/fit-criteria";
import { CTA_PRIMARY, CTA_SECONDARY } from "@/lib/config/ctas";
import { Button } from "@/components/ui/Button";

type CriterionVisual = {
  id: string;
  label: string;
  body: ReactNode;
  wide?: boolean;
};

function FitIndex({ index }: { index: number }) {
  return (
    <span className="font-semibold tabular-nums tracking-[-0.04em] text-green" aria-hidden>
      {String(index).padStart(2, "0")}
    </span>
  );
}

function buildCriteria(): CriterionVisual[] {
  return [
    {
      id: "use",
      label: "Property use",
      body: <p className="text-[1.0625rem] leading-relaxed text-charcoal">{FIT_PROPERTY_USE}</p>,
    },
    {
      id: "size",
      label: "Loan size",
      body: <p className="text-[1.0625rem] leading-relaxed text-charcoal">{FIT_LOAN_SIZE_LABEL}</p>,
    },
    {
      id: "types",
      label: "Property types",
      wide: true,
      body: (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {FIT_PROPERTY_TYPES.map((type) => (
            <li key={type} className="flex items-center gap-2 text-[1.0625rem] text-charcoal">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" aria-hidden />
              {type}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "entity",
      label: "Borrower",
      body: <p className="text-[1.0625rem] leading-relaxed text-charcoal">{FIT_ENTITY}</p>,
    },
    {
      id: "experience",
      label: "Experience",
      body: <p className="text-[1.0625rem] leading-relaxed text-charcoal">{FIT_EXPERIENCE}</p>,
    },
    {
      id: "states",
      label: "Markets",
      body: (
        <p className="text-[1.0625rem] leading-relaxed text-charcoal">
          <Link href={FIT_STATES_HREF} className="font-medium text-green hover:text-green-hover">
            {FIT_STATES_LABEL}
          </Link>
        </p>
      ),
    },
  ];
}

function CriterionBlock({
  item,
  index,
  className = "",
}: {
  item: CriterionVisual;
  index: number;
  className?: string;
}) {
  return (
    <li className={className}>
      <div className="flex items-baseline gap-3">
        <FitIndex index={index} />
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-steel">
          {item.label}
        </p>
      </div>
      <div className="mt-4 max-w-[36rem] pl-10">{item.body}</div>
    </li>
  );
}

export function QualificationBox({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const criteria = buildCriteria();

  if (compact) {
    return (
      <aside
        className={`relative overflow-hidden border-y border-line bg-gradient-to-br from-green-mist to-paper px-6 py-8 sm:px-8 ${className}`}
        aria-labelledby="fit-criteria-heading"
      >
        <p className="text-[0.8125rem] font-semibold tracking-[0.06em] text-green uppercase">
          Do you fit?
        </p>
        <h2
          id="fit-criteria-heading"
          className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink"
        >
          Fit criteria for investor files
        </h2>
        <ol className="mt-6 divide-y divide-line">
          {criteria.map((item, i) => (
            <CriterionBlock
              key={item.id}
              item={item}
              index={i + 1}
              className="py-4 first:pt-0 last:pb-0"
            />
          ))}
        </ol>
        <p className="mt-5 text-[0.8125rem] leading-relaxed text-steel">{FIT_CAPTION}</p>
      </aside>
    );
  }

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      aria-labelledby="fit-criteria-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-green-mist via-[#eef8f2] to-paper" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,184,92,0.14)_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="absolute -left-20 top-24 h-80 w-80 rounded-full bg-green/[0.09] blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
        <div className="grid items-end gap-8 border-b border-line pb-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-green uppercase">
              Do you fit?
            </p>
            <h2 id="fit-criteria-heading" className="headline-lg mt-3 max-w-[14ch] text-balance">
              Fit criteria for investor files
            </h2>
          </div>
          <p className="body-lg max-w-[32rem] lg:justify-self-end lg:text-right">
            Non-price gates so you know in a glance whether Vault is the right desk for the deal —
            before you start a file.
          </p>
        </div>

        {/* Keep source order: pair non-wide items; wide items span full width. */}
        <ol className="mt-2">
          {(() => {
            const nodes: ReactNode[] = [];
            let pair: { item: CriterionVisual; index: number }[] = [];
            const flushPair = () => {
              if (!pair.length) return;
              nodes.push(
                <li key={pair.map((p) => p.item.id).join("-")} className="grid sm:grid-cols-2">
                  {pair.map((p, idx) => (
                    <div
                      key={p.item.id}
                      className={`border-b border-line py-8 lg:py-10 ${
                        idx === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"
                      }`}
                    >
                      <div className="flex items-baseline gap-3">
                        <FitIndex index={p.index} />
                        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-steel">
                          {p.item.label}
                        </p>
                      </div>
                      <div className="mt-4 max-w-[28rem] pl-10">{p.item.body}</div>
                    </div>
                  ))}
                  {pair.length === 1 ? <div className="hidden border-b border-line sm:block" /> : null}
                </li>,
              );
              pair = [];
            };

            criteria.forEach((item, i) => {
              const index = i + 1;
              if (item.wide) {
                flushPair();
                nodes.push(
                  <li key={item.id} className="border-b border-line py-8 lg:py-10">
                    <div className="flex items-baseline gap-3">
                      <FitIndex index={index} />
                      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-steel">
                        {item.label}
                      </p>
                    </div>
                    <div className="mt-4 pl-10">{item.body}</div>
                  </li>,
                );
                return;
              }
              pair.push({ item, index });
              if (pair.length === 2) flushPair();
            });
            flushPair();
            return nodes;
          })()}
        </ol>

        <div className="mt-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-[28rem] text-[0.875rem] leading-relaxed text-steel">{FIT_CAPTION}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={CTA_SECONDARY.href} shine>
              {CTA_SECONDARY.label}
            </Button>
            <Button href={CTA_PRIMARY.href} variant="secondary">
              {CTA_PRIMARY.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
