import type { Metadata } from "next";
import {
  FinalCta,
  PageHero,
  PhotoTile,
  Section,
} from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_SECONDARY } from "@/lib/config/ctas";
import { CALCULATOR_DISCLAIMER } from "@/lib/config/calculator-disclaimer";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Investor Tools",
  description:
    "Illustrative DSCR, fix & flip, bridge cash-to-close, and draw schedule calculators — you supply assumptions; not an offer of credit.",
};

export default function ToolsIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Investor tools"
        description="Four calculators that use your leverage and rate assumptions. Results are illustrative — not quotes, approvals, or underwriting."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_SECONDARY.href, label: CTA_SECONDARY.label }}
        image={images.plans}
      />

      <Section>
        <p className="mx-auto max-w-[40rem] text-center text-[0.9375rem] text-steel">
          {CALCULATOR_DISCLAIMER}
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <PhotoTile
            href="/resources/tools/dscr"
            title="DSCR calculator"
            body="Coverage from rent, expenses, and your rate / term assumptions."
            image={images.dscr}
            cta="Open calculator"
          />
          <PhotoTile
            href="/resources/tools/fix-flip"
            title="Fix & flip profit / ARV"
            body="Purchase, rehab, ARV, and carry — with financing inputs you control."
            image={images.rehab}
            cta="Open calculator"
          />
          <PhotoTile
            href="/resources/tools/bridge-cash-to-close"
            title="Bridge cash-to-close"
            body="Estimate cash at close from purchase, proceeds, and fee assumptions."
            image={images.bridge}
            cta="Open calculator"
          />
          <PhotoTile
            href="/resources/tools/draw-schedule"
            title="Draw schedule planner"
            body="Allocate construction or rehab budget across milestones."
            image={images.groundUp}
            cta="Open calculator"
          />
        </div>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Ready to put numbers on a live file?"
        description="Start your file to open the borrower portal. Calculators never replace underwriting."
        primaryLabel={CTA_PRIMARY.label}
        secondaryHref={CTA_SECONDARY.href}
        secondaryLabel={CTA_SECONDARY.label}
      />
    </>
  );
}
