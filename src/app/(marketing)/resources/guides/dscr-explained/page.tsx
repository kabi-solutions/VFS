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
  title: "DSCR Explained",
  description:
    "How debt service coverage ratio (DSCR) is used to qualify investment rental financing — definitions, documents, Non-QM context, and caveats.",
};

export default function DscrExplainedPage() {
  return (
    <>
      <PageHero
        eyebrow="Guide"
        title="DSCR explained"
        description="Debt service coverage ratio weighs property cash flow against debt service — a common lens for rental and non-QM investor credit."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/solutions/dscr-non-qm", label: "DSCR / Non-QM" }}
        image={images.dscr}
      />

      <Section narrow>
        <h2 className="headline-lg max-w-[16ch] text-balance">What DSCR means</h2>
        <p className="body-lg mt-5">
          DSCR compares a property’s net operating income (or a program-defined cash-flow measure)
          to its annual debt payments. A ratio above 1.0 means operating cash flow covers debt
          service; programs set their own minimums and calculation methods. Vault evaluates coverage
          on the file rather than publishing a marketing threshold here.
        </p>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who it’s for</h2>
            <p className="body-lg mt-5">
              Portfolio landlords and investors whose rental cash flow is the primary qualification
              story — including entity borrowers and operators with non-traditional personal income
              documentation.
            </p>
          </div>
          <div>
            <CheckList
              items={[
                "Qualification can emphasize rents and expenses over full personal W-2 underwriting",
                "Fits stabilized or near-stabilized rentals where cash flow is measurable",
                "Pairs with entity borrowers and portfolio operators in many non-QM contexts",
                "Still requires collateral review, reserves, and guideline compliance",
              ]}
            />
          </div>
        </div>
      </Section>

      <SoftStage src={images.dscr.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">How the process usually runs</h2>
          <p className="body-lg mt-5">
            Apply captures property and rental context. Package gathers leases, rent rolls, and
            entity docs. Underwriting tests coverage and guidelines. Status stays in the portal.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList
            items={[
              "Provide rents, expenses, and property details early",
              "Upload leases, insurance, and entity paperwork",
              "Respond to conditions without restarting the application",
              "Close when clear-to-close and funding gates are met",
            ]}
          />
        </div>
      </SoftStage>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Documents typically requested</h2>
          <div className="mt-8">
            <CheckList
              items={[
                "Current leases or lease abstracts",
                "Rent roll and expense summary for the subject property",
                "Insurance and entity documents",
                "Property details and ownership evidence",
                "Reserve or liquidity evidence when requested",
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Risks, Non-QM, and caveats</h2>
          <p className="body-lg mt-5">
            Non-qualified mortgage credit sits outside the QM safe harbor. It allows alternative
            documentation paths; it does not remove diligence. Vacancy, expense creep, and weak
            leases can break coverage. Expect rent rolls and entity paperwork — and do not treat
            marketing copy as a guaranteed DSCR cutoff.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <h2 className="headline-lg text-balance">Next steps</h2>
        <p className="body-lg mt-5 max-w-[40rem]">
          Review the DSCR / Non-QM product page, skim glossary definitions, or start Apply for a
          rental file.
        </p>
        <div className="mt-10">
          <RelatedLinks
            title="Related"
            links={[
              {
                href: "/solutions/dscr-non-qm",
                label: "DSCR / Non-QM product",
                body: "Who it’s for and how it differs.",
              },
              {
                href: "/resources/glossary",
                label: "Glossary: DSCR & Non-QM",
                body: "Short institutional definitions.",
              },
              {
                href: "/resources/faqs",
                label: "FAQs",
                body: "Documents, markets, and portal access.",
              },
            ]}
          />
        </div>
      </Section>

      <FinalCta imageSrc={images.funded.src} />
    </>
  );
}
