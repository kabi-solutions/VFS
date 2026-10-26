import type { Metadata } from "next";
import { ApplyWizard } from "@/components/apply/ApplyWizard";
import { PageHero, Section } from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";
import { parseApplyPrefill } from "@/lib/config/apply-prefill";
import { CTA_PRIMARY } from "@/lib/config/ctas";

export const metadata: Metadata = {
  title: "Start your file",
  description:
    "Submit a Vault private capital application — property, borrower, loan details, and documents in one digital file.",
};

type ApplySearchParams = Promise<Record<string, string | string[] | undefined>>;

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
        description="Submit once with the hard essentials, then soft-collect the full package — property, strategy, track record, SREO, contractor, and documents. Missing items stay visible for follow-up. Terms are evaluated deal by deal."
        image={images.plans}
      />

      <Section tone="paper">
        <div className="mx-auto max-w-[720px]">
          <ApplyWizard priorApplicationId={priorApplicationId} />
        </div>
        <p className="mx-auto mt-8 max-w-[36rem] text-center text-[0.875rem] text-steel">
          {/* PLACEHOLDER — compliance disclosure / E-SIGN when live */}
          Submitting creates an application record and portal access in this mock environment. No
          rates or approvals are quoted on this form.
        </p>
      </Section>
    </>
  );
}
