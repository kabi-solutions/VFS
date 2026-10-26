import type { Metadata } from "next";
import {
  CheckList,
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Fix & Flip Financing 101",
  description:
    "How fix-and-flip financing typically covers purchase, rehab budget, documents, draws, and exit planning — without invented rate tables.",
};

export default function FixFlipFinancingPage() {
  return (
    <>
      <PageHero
        eyebrow="Guide"
        title="Fix & flip financing 101"
        description="Acquisition plus renovation capital for investors who plan to improve a property and exit through sale or refinance within a defined hold."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/solutions/rehab-fix-flip", label: "Rehab / Fix & Flip" }}
        image={images.rehab}
      />

      <Section narrow>
        <h2 className="headline-lg max-w-[16ch] text-balance">What fix-and-flip financing is</h2>
        <p className="body-lg mt-5">
          Flip facilities often fund a share of purchase price and a share of the rehab budget. How
          much depends on collateral, ARV logic, borrower experience, and program guidelines —
          evaluated on the file, not advertised as a universal percent on this site.
        </p>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who it’s for</h2>
            <p className="body-lg mt-5">
              Operators with a defined scope, budget, and exit. First-time investors can apply, but
              files move faster when experience and contractor readiness are clear.
            </p>
          </div>
          <div>
            <CheckList
              items={[
                "Investors buying properties that need renovation before sale or refinance",
                "Sponsors who can document rehab scope with enough granularity for draws",
                "Borrowers prepared to track status and documents in a portal",
              ]}
            />
          </div>
        </div>
      </Section>

      <SoftStage src={images.rehab.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Process from contract to draws</h2>
          <p className="body-lg mt-5">
            Apply captures purchase, budget, and ARV context. Package gathers contracts and
            insurance. After funding, rehab reserves typically release against verified work.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList
            items={[
              "Lock property details and rehab budget in Apply",
              "Upload contracts, entity docs, and insurance binders",
              "Clear underwriting conditions before close",
              "Request draws with supporting documentation in the portal",
            ]}
          />
        </div>
      </SoftStage>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Documents to prepare</h2>
          <div className="mt-8">
            <CheckList
              items={[
                "Purchase contract or payoff statement and property details",
                "Rehab scope and budget with enough granularity for draws",
                "Timeline to market or refinance and a credible exit",
                "Entity and identity documents for portal onboarding",
                "Contractor bids or qualifications when requested",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Risks and caveats</h2>
          <p className="body-lg mt-5">
            Over-optimistic ARVs, thin budgets, and unclear exits slow or stop files. Draw delays
            can stall construction if documentation is incomplete. Vault does not guarantee terms on
            marketing pages — underwriting decides fit after Apply.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="headline-lg text-balance">Next steps</h2>
        <p className="body-lg mt-5 max-w-[40rem]">
          Continue with How Hard Money Works, review Rehab / Fix & Flip, or start an application.
        </p>
        <div className="mt-10">
          <RelatedLinks
            title="Related"
            links={[
              {
                href: "/resources/guides/how-hard-money-works",
                label: "How Hard Money Works",
                body: "Asset-based credit in plain English.",
              },
              {
                href: "/resources/glossary",
                label: "ARV & draw definitions",
                body: "Glossary entries for rehab terms.",
              },
              {
                href: "/resources/case-studies",
                label: "Case studies",
                body: "Illustrative deal shapes.",
              },
            ]}
          />
        </div>
      </Section>

      <FinalCta imageSrc={images.funded.src} />
    </>
  );
}
