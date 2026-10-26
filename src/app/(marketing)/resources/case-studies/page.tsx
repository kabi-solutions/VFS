import type { Metadata } from "next";
import { FinalCta, PageHero, Section, SoftStage } from "@/components/marketing/page";
import { RecentFiles } from "@/components/marketing/RecentFiles";
import { CTA_PRIMARY, CTA_SECONDARY } from "@/lib/config/ctas";
import { recentFiles } from "@/lib/config/proof";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Funded-deal examples appear here when Vault publishes approved, anonymized files — no fabricated case studies.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Case studies"
        description="We publish anonymized deal shapes only when Vault approves them. Until then, this page stays empty-honest — no invented metrics or names."
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_SECONDARY.href, label: CTA_SECONDARY.label }}
        image={images.funded}
      />

      <Section>
        {recentFiles.length === 0 ? (
          <div className="mx-auto max-w-[40rem] rounded-[2rem] bg-paper px-8 py-10 text-center ring-1 ring-black/[0.04]">
            <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
              No published case studies yet
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
              TODO (Vault): Add approved, anonymized recent files to{" "}
              <code className="text-[0.875rem]">src/lib/config/proof.ts</code>. We will not seed
              fabricated examples.
            </p>
          </div>
        ) : (
          <RecentFiles />
        )}
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Your file will tell a clearer story</h2>
          <p className="body-lg mt-5">
            Apply now to open the portal, or check fit in four fields first. Terms are
            evaluated deal by deal.
          </p>
        </div>
      </SoftStage>

      <FinalCta imageSrc={images.funded.src} primaryLabel={CTA_PRIMARY.label} />
    </>
  );
}
