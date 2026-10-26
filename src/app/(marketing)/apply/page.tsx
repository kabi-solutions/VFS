import type { Metadata } from "next";
import { ApplyWizard } from "@/components/apply/ApplyWizard";
import { ApplyFooterNote } from "@/components/apply/ApplyFooterNote";
import { PageHero, Section } from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Apply Now",
  description:
    "Submit a Vault private capital application — property, borrower, loan details, and documents in one digital file.",
};

type ApplySearchParams = Promise<{ prior?: string | string[] }>;

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: ApplySearchParams;
}) {
  const params = await searchParams;
  const priorRaw = params.prior;
  const priorApplicationId = Array.isArray(priorRaw) ? priorRaw[0] : priorRaw;

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Start your file."
        description="Submit your deal in about two minutes, then finish your package in the portal. We show what is still missing — terms are evaluated deal by deal."
        image={images.plans}
      />

      <Section tone="paper">
        <div className="mx-auto w-full max-w-[880px]">
          <ApplyWizard priorApplicationId={priorApplicationId} />
        </div>
        <ApplyFooterNote />
      </Section>
    </>
  );
}
