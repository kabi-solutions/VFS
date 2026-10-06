import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, SoftStage } from "@/components/marketing/page";
import { PartnerApplicationForm } from "@/components/marketing/PartnerApplicationForm";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Partner Application",
  description:
    "Submit a capital partner application to open a partnership diligence intake with Vault Financial Services.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Capital partners"
        title="Partner Application."
        description="Open a capital-partner diligence intake with Vault. This is partnership review — not a disposable lead form — so we can evaluate mandate fit, reporting needs, and deployment readiness."
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
                <span className="font-medium text-charcoal">Organization:</span> capital-partner
                record opened for your firm
              </li>
              <li>
                <span className="font-medium text-charcoal">Review:</span> Vault diligence before
                activation — not an automated approval email
              </li>
              <li>
                <span className="font-medium text-charcoal">Next step:</span> Follow-up on mandate
                fit, reporting, and deployment readiness
              </li>
            </ul>
            <p className="mt-8 text-[0.875rem] text-steel">
              Contact details are used for partnership diligence and follow-up only. See Privacy
              under Trust for how Vault handles business contact information.
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
