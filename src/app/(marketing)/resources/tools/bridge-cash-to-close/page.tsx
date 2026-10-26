import type { Metadata } from "next";
import { BridgeCashToCloseCalculator } from "@/components/marketing/tools/BridgeCashToCloseCalculator";
import { FinalCta, PageHero, Section } from "@/components/marketing/page";
import { CTA_PRIMARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Bridge Cash-to-Close Calculator",
  description:
    "Illustrative bridge cash-to-close calculator. You supply fee and rate assumptions — not an offer of credit.",
};

export default function BridgeToolPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Bridge cash-to-close"
        description="Estimate cash needed at close from purchase, loan proceeds, and your fee assumptions."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: "/resources/tools", label: "All tools" }}
        image={images.bridge}
      />
      <Section tone="paper">
        <BridgeCashToCloseCalculator />
      </Section>
      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
