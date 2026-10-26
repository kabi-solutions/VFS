import type { Metadata } from "next";
import { DrawScheduleCalculator } from "@/components/marketing/tools/DrawScheduleCalculator";
import { FinalCta, PageHero, Section } from "@/components/marketing/page";
import { CTA_PRIMARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Draw Schedule Planner",
  description:
    "Illustrative construction draw schedule planner. Milestone weights are yours to adjust — not an offer of credit.",
};

export default function DrawScheduleToolPage() {
  return (
    <>
      <PageHero
        eyebrow="Tools"
        title="Draw schedule planner"
        description="Allocate budget across milestones for ground-up or heavy rehab scopes."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: "/resources/tools", label: "All tools" }}
        image={images.groundUp}
      />
      <Section tone="paper">
        <DrawScheduleCalculator />
      </Section>
      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
