import type { Metadata } from "next";
import { ApplyWizard } from "@/components/apply/ApplyWizard";
import { PageHero, Section } from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";
import { parseApplyPrefill } from "@/lib/config/apply-prefill";

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
  const prefill = parseApplyPrefill(params);

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title="Start your file."
        description="Submit your deal in about two minutes, then finish your package in the portal. We show what is still missing — terms are evaluated deal by deal. Not a promise of approval."
        image={images.plans}
      />

      <Section tone="paper">
        <div className="mx-auto w-full max-w-[880px]">
          <ApplyWizard priorApplicationId={priorApplicationId} prefill={prefill} />
        </div>
        <p className="mx-auto mt-8 max-w-[36rem] text-center text-[0.875rem] text-steel">
          {/* PLACEHOLDER — compliance disclosure / E-SIGN when live */}
          Submitting creates an application record and portal access. No rates or approvals are
          quoted on this form.
        </p>
      </Section>
    </>
  );
}
