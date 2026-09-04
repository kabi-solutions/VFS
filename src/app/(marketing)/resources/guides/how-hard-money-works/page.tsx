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
  title: "How Hard Money Works",
  description:
    "A plain-language guide to hard money and private asset-based lending for real estate investors — definitions, process, documents, and caveats.",
};

export default function HowHardMoneyWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Guide"
        title="How hard money works"
        description="Hard money is asset-based private credit. Collateral, exit, and experience usually matter more than a traditional consumer mortgage scorecard."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/solutions/private-money", label: "Private Money" }}
        image={images.privateMoney}
      />

      <Section narrow>
        <h2 className="headline-lg max-w-[16ch] text-balance">What hard money means</h2>
        <p className="body-lg mt-5">
          Hard money loans are typically shorter-term facilities secured by investment real estate.
          Capital comes from private lenders or investment vehicles rather than insured bank deposit
          products. Structure is tailored to the deal — purchase, rehab, or hold — and underwriting
          emphasizes the property and the plan to repay.
        </p>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who it’s for</h2>
            <p className="body-lg mt-5">
              Investors who need speed and deal-specific structure — flippers, bridge borrowers, and
              sponsors whose files do not fit long bank templates. Primary-residence consumer
              mortgages are outside this framing.
            </p>
          </div>
          <div>
            <CheckList
              items={[
                "Operators with a defined exit and hold period",
                "Borrowers comfortable documenting collateral and experience",
                "Entities or sponsors ready for portal-based diligence",
                "Capital partners evaluating how private credit is originated",
              ]}
            />
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Typical process</h2>
          <p className="body-lg mt-5">
            Apply captures the deal. Review determines structure fit. Package and underwriting
            gather documents and conditions. Clear to close and funding follow when gates are met —
            with status visible in the borrower portal.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList
            items={[
              "Submit property, borrower, and loan intent",
              "Respond to info requests without restarting the file",
              "Upload contracts, insurance, and entity docs once",
              "Track lifecycle status through funding",
            ]}
          />
        </div>
      </SoftStage>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Documents lenders commonly review</h2>
          <div className="mt-8">
            <CheckList
              items={[
                "Collateral quality and valuation inputs (as-is and, when relevant, after-repair)",
                "Borrower or sponsor experience with similar strategies",
                "Exit path — sale, refinance, or takeout — and timeline realism",
                "Liquidity and reserves appropriate to the hold and rehab scope",
                "Entity formation and identity paperwork for portal onboarding",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Risks and caveats</h2>
          <p className="body-lg mt-5">
            Hard money is not cheap, permanent bank credit. Shorter terms, higher cost of capital,
            and collateral-first diligence are normal. Vault does not publish rate or LTV tables on
            marketing pages — fit and pricing are evaluated after you submit an application.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="headline-lg text-balance">Next steps</h2>
        <p className="body-lg mt-5 max-w-[40rem]">
          Read Private Money for product framing, browse the glossary for definitions, or start Apply
          to create portal access.
        </p>
        <div className="mt-10">
          <RelatedLinks
            title="Related"
            links={[
              {
                href: "/resources/glossary",
                label: "Glossary",
                body: "ARV, LTV, bridge, draw, and more.",
              },
              {
                href: "/solutions/rehab-fix-flip",
                label: "Rehab / Fix & Flip",
                body: "Product page for renovation credit.",
              },
              {
                href: "/resources/guides/fix-flip-financing-101",
                label: "Fix & Flip Financing 101",
                body: "Purchase, budget, and hold basics.",
              },
            ]}
          />
        </div>
      </Section>

      <FinalCta imageSrc={images.funded.src} />
    </>
  );
}
