import type { Metadata } from "next";
import { DealScreener } from "@/components/marketing/DealScreener";
import { QualificationBox } from "@/components/marketing/QualificationBox";
import { FinalCta, Section } from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_TERTIARY } from "@/lib/config/ctas";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Is Vault the Right Fit for Your Project?",
  description:
    "Give us 2 minutes for a preliminary pre-approval read. Four fields. No credit decision.",
};

export default function ScreenerPage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto max-w-[1080px] px-6 pb-6 pt-14 lg:px-8 lg:pt-16">
          <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-green uppercase">
            Pre-approval screener
          </p>
          <h1 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
            Is Vault the right fit for your project?
          </h1>
          <p className="body-lg mt-4 max-w-[36rem]">
            Give us 2 minutes and we&apos;ll give you a pre-approval. Four fields. No credit
            decision.
          </p>
        </div>
      </section>

      <Section tone="paper" className="!pt-4">
        <DealScreener />
      </Section>

      <Section>
        <div className="mx-auto max-w-[720px]">
          <QualificationBox compact />
        </div>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Ready to start your file?"
        description="Apply Now opens Vector by Vault so you can finish your package and track status."
        primaryLabel={CTA_PRIMARY.label}
        secondaryHref={CTA_TERTIARY.href}
        secondaryLabel={CTA_TERTIARY.label}
      />
    </>
  );
}
