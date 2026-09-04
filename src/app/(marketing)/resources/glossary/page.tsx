import type { Metadata } from "next";
import { FinalCta, PageHero, RelatedLinks, Section } from "@/components/marketing/page";
import { glossaryTerms } from "@/lib/marketing/glossary";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Institutional plain-language definitions of private lending terms used across Vault products.",
};

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Lending glossary"
        description="Short definitions for terms you will see in applications, term sheets, and underwriting — written for operators, not jargon for its own sake."
        primaryCta={{ href: "/resources", label: "Learning Center" }}
        secondaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
      />

      <Section narrow>
        <dl className="divide-y divide-line border-y border-line">
          {glossaryTerms.map((item) => (
            <div key={item.term} className="grid gap-3 py-8 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-10">
              <dt className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                {item.term}
              </dt>
              <dd className="body-md">{item.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section tone="paper">
        <RelatedLinks
          title="Keep learning"
          links={[
            {
              href: "/resources/guides/how-hard-money-works",
              label: "How Hard Money Works",
              body: "Structure and fit in plain English.",
            },
            {
              href: "/resources/faqs",
              label: "Expanded FAQs",
              body: "Borrower and partner questions without rate tables.",
            },
            {
              href: "/solutions/private-money",
              label: "Private Money",
              body: "Product page for asset-based credit.",
            },
          ]}
        />
      </Section>

      <FinalCta imageSrc={images.plans.src} />
    </>
  );
}
