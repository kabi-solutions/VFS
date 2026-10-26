import type { Metadata } from "next";
import { DscrCalculator } from "@/components/marketing/tools/DscrCalculator";
import { FinalCta, PageHero, Section } from "@/components/marketing/page";
import { CTA_PRIMARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "DSCR Calculator",
  description:
    "Illustrative debt-service coverage calculator. You supply rate and term assumptions — not an offer of credit.",
};

export default function DscrToolPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="DSCR calculator"
        description="Model coverage from rents and expenses using your own rate and amortization assumptions."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: "/resources/tools", label: "All tools" }}
        image={images.dscr}
      />
      <Section tone="paper">
        <DscrCalculator />
      </Section>
      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
