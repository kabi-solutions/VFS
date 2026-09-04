import type { Metadata } from "next";
import {
  CheckList,
  FinalCta,
  PageHero,
  PhotoTile,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { BrandImage } from "@/components/marketing/BrandImage";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Why Partner With Vault",
  description:
    "Capital partnership built around controlled underwriting gates, risk posture you can diligence, and an audit trail on every file.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Capital partners"
        title="Why partner with Vault."
        description="Deploy into a private-credit pipeline with published gates, assigned processors and escrow, and status history retained for diligence — not a black-box originations desk."
        image={images.capital}
        primaryCta={{
          href: "/capital-partners/apply",
          label: "Partner Application",
        }}
        secondaryCta={{
          href: "/capital-partners/deployment",
          label: "How Deployment Works",
        }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Process you can diligence.</h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
              Files move through a published lifecycle from application through funding. Capital
              partners see the same gate language Vault uses internally — not a parallel shadow
              process.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Underwriting gates defined before capital is committed",
                  "Processor and escrow assignment per file",
                  "Info-requested loops tagged to the originating stage",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Risk posture, stated plainly.</h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
              Product pages describe structure and fit. Specific terms are evaluated deal by deal.
              Partnership diligence starts with how Vault runs files — not invented rate sheets.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Role-based access for Vault, processors, lenders, and escrow",
                  "Attribution history retained on funded loans",
                  "No published LTV or APR figures on the public site",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="headline-lg text-balance">An audit trail on every gate.</h2>
            <p className="body-lg mt-5">
              Status history is retained as the file advances. When information is missing, the file
              enters an info-requested state, then returns to the same stage once resubmitted.
            </p>
          </div>
          <div className="rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <CheckList
              items={[
                "Application submitted → initial review",
                "Package submission → underwriting",
                "Clear to close → signing & funding",
              ]}
            />
          </div>
        </div>
      </SoftStage>

      <Section tone="paper">
        <div className="grid gap-6 lg:grid-cols-2">
          <PhotoTile
            href="/capital-partners/deployment"
            title="How capital deployment works"
            body="Lifecycle gates lenders care about — from intake through funding."
            image={images.plans}
            cta="View deployment"
          />
          <div className="flex flex-col justify-center rounded-[1.75rem] bg-white p-8 ring-1 ring-black/[0.04] sm:p-10">
            <p className="text-[0.875rem] font-semibold text-green">Partner intake</p>
            <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">
              Application creates a pending organization.
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-steel">
              A Partner Application opens a{" "}
              <span className="font-medium text-charcoal">capital_partner</span> record in{" "}
              <span className="font-medium text-charcoal">pending_review</span> for diligence — not a
              disposable lead form.
            </p>
            <BrandImage
              src={images.funded.src}
              alt={images.funded.alt}
              greenAccent="edge"
              className="mt-8 aspect-[16/10] rounded-[1.5rem]"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
        </div>
      </Section>

      <FinalCta
        title="Ready to begin partnership diligence?"
        description="Submit a Partner Application to create a pending capital-partner organization record. Vault will use it for diligence before activation."
        primaryHref="/capital-partners/apply"
        primaryLabel="Partner Application"
        secondaryHref="/capital-partners/deployment"
        secondaryLabel="How Deployment Works"
        imageSrc={images.capital.src}
      />
    </>
  );
}
