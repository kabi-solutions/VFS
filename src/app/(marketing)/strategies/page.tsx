import type { Metadata } from "next";
import Link from "next/link";
import {
  FinalCta,
  PageHero,
  Section,
} from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_SECONDARY } from "@/lib/config/ctas";
import { experienceList, strategyList } from "@/lib/config/strategies";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Strategies & Experience",
  description:
    "Fix & flip, BRRRR, buy & hold, and ground-up — plus framing for first project, scaling, and high-volume operators.",
};

export default function StrategiesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Strategies"
        title="Land on the right structure."
        description="Choose how you invest — or where you are in volume — and we route you to the product framing that fits."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_SECONDARY.href, label: CTA_SECONDARY.label }}
        image={images.privateMoney}
      />

      <Section>
        <h2 className="headline-lg max-w-[16ch] text-balance">By strategy</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {strategyList.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/strategies/${s.slug}`}
                className="block rounded-[1.75rem] bg-paper px-6 py-7 ring-1 ring-black/[0.04] transition-colors hover:bg-green-mist/60"
              >
                <p className="text-[0.875rem] font-semibold text-green">{s.name}</p>
                <p className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                  {s.headline}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel">{s.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper">
        <h2 className="headline-lg max-w-[16ch] text-balance">By experience</h2>
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {experienceList.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/strategies/experience/${e.slug}`}
                className="block h-full rounded-[1.75rem] bg-white px-6 py-7 ring-1 ring-black/[0.04] transition-colors hover:bg-green-soft/40"
              >
                <p className="text-[0.875rem] font-semibold text-green">{e.name}</p>
                <p className="mt-2 text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">
                  {e.headline}
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel">{e.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
