import type { Metadata } from "next";
import { FixFlipCalculator } from "@/components/marketing/tools/FixFlipCalculator";
import { FinalCta, PageHero, Section } from "@/components/marketing/page";
import { CTA_PRIMARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Fix & Flip Profit / ARV Calculator",
  description:
    "Illustrative fix-and-flip profit calculator using your purchase, rehab, ARV, and financing assumptions.",
};

export default function FixFlipToolPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Fix & flip profit / ARV"
        description="Estimate profit with purchase, rehab, ARV, and financing inputs you control."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: "/resources/tools", label: "All tools" }}
        image={images.rehab}
      />
      <Section tone="paper">
        <FixFlipCalculator />
      </Section>
      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
