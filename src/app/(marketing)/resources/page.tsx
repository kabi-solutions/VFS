import type { Metadata } from "next";
import {
  FinalCta,
  LinkBento,
  PageHero,
  PhotoTile,
  Section,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Guides, glossary, FAQs, and illustrative case studies for Vault private lending.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Learning Center"
        description="Plain-language guides and reference material for investors evaluating private capital — without invented rate tables."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/resources/faqs", label: "Read FAQs" }}
        image={images.plans}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          <PhotoTile
            href="/resources/guides/how-hard-money-works"
            title="How Hard Money Works"
            body="Asset-based credit, collateral, and exit — in institutional plain English."
            image={images.privateMoney}
            cta="Read guide"
          />
          <PhotoTile
            href="/resources/guides/fix-flip-financing-101"
            title="Fix & Flip Financing 101"
            body="Purchase, rehab budget, hold period, and what underwriters look for."
            image={images.rehab}
            cta="Read guide"
          />
          <PhotoTile
            href="/resources/guides/dscr-explained"
            title="DSCR Explained"
            body="Cash-flow qualification for rental investors and non-QM context."
            image={images.dscr}
            cta="Read guide"
          />
          <PhotoTile
            href="/resources/case-studies"
            title="Case Studies"
            body="Anonymized, illustrative funded-deal shapes — pending Vault-owned stories."
            image={images.funded}
            cta="View examples"
          />
        </div>
      </Section>

      <Section tone="paper">
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Reference desk</h2>
          <p className="body-lg mt-5">
            Jump to structured answers and term definitions when you need them mid-deal.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <LinkBento
            title="Glossary"
            href="/resources/glossary"
            links={[
              { href: "/resources/glossary", label: "Lending terms A–Z" },
              { href: "/resources/guides/dscr-explained", label: "DSCR deep dive" },
              { href: "/resources/guides/how-hard-money-works", label: "Hard money overview" },
            ]}
          />
          <LinkBento
            title="FAQs"
            href="/resources/faqs"
            links={[
              { href: "/resources/faqs", label: "Expanded FAQs" },
              { href: "/apply", label: "Start an application" },
              { href: "/locations", label: "States we serve" },
            ]}
          />
        </div>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Ready to put a file in motion?"
        description="Apply creates your borrower portal so documents and status live in one audited trail."
      />
    </>
  );
}
