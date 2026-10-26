import type { Metadata } from "next";
import { DealScreener } from "@/components/marketing/DealScreener";
import { QualificationBox } from "@/components/marketing/QualificationBox";
import { FinalCta, PageHero, Section } from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_TERTIARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Check If Your Deal Fits",
  description:
    "Four-field preliminary screener for Vault investor credit. Not an offer of credit or approval.",
};

export default function ScreenerPage() {
  return (
    <>
      <PageHero
        eyebrow="Screener"
        title="Check if your deal fits"
        description="Address, loan type, amount, and timeline — a preliminary fit read only. Never a promise of approval."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_TERTIARY.href, label: CTA_TERTIARY.label }}
        image={images.investor}
      />

      <Section tone="paper">
        <DealScreener />
      </Section>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <QualificationBox />
        </div>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Prefer to talk first?"
        description="Talk to Vault with property and strategy context, or start your file when you are ready."
        primaryLabel={CTA_PRIMARY.label}
        secondaryHref={CTA_TERTIARY.href}
        secondaryLabel={CTA_TERTIARY.label}
      />
    </>
  );
}
