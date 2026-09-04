import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SoftStage } from "@/components/marketing/page";
import { PartnerApplicationForm } from "@/components/marketing/PartnerApplicationForm";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Partner Application",
  description:
    "Submit a capital partner application to create a pending capital_partner organization record for diligence.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Capital partners"
        title="Partner Application."
        description="This form creates a pending capital-partner organization for diligence. It is not a disposable lead capture — Vault uses the record to evaluate partnership fit."
        primaryCta={{
          href: "/capital-partners/deployment",
          label: "How Deployment Works",
          variant: "secondary",
        }}
        secondaryCta={{
          href: "/capital-partners",
          label: "Why Partner With Vault",
          variant: "secondary",
        }}
      />

      <Section tone="mist">
        <div className="mx-auto grid max-w-[880px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12">
          <div>
            <h2 className="headline-lg max-w-[12ch] text-balance">What happens on submit.</h2>
            <ul className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-steel">
              <li>
                <span className="font-medium text-charcoal">Organization type:</span> capital_partner
              </li>
              <li>
                <span className="font-medium text-charcoal">Initial status:</span> pending_review
              </li>
              <li>
                <span className="font-medium text-charcoal">Next step:</span> Vault diligence before
                activation — not an automated approval email.
              </li>
            </ul>
            <p className="mt-8 text-[0.875rem] text-steel">
              {/* PLACEHOLDER — partner intake privacy / data-use disclosure */}
              Contact details are used for partnership diligence and follow-up only.
            </p>
          </div>
          <PartnerApplicationForm />
        </div>
      </Section>

      <SoftStage src={images.capital.src}>
        <p className="mx-auto max-w-[36rem] text-center text-[1.125rem] leading-relaxed text-steel">
          Prefer to review process first? See{" "}
          <Link
            href="/capital-partners/deployment"
            className="font-medium text-green hover:text-green-hover"
          >
            How Capital Deployment Works
          </Link>{" "}
          or{" "}
          <Link href="/trust/security" className="font-medium text-green hover:text-green-hover">
            Security &amp; Data Protection
          </Link>
          .
        </p>
      </SoftStage>
    </>
  );
}
