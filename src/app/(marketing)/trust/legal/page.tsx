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
  title: "Legal",
  description:
    "Privacy, Terms of Use, and lending disclosure outlines for Vault Financial Services. Summaries pending counsel review — structured for what users expect.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Legal."
        description="Privacy, Terms, and lending disclosures in one place. Section summaries below are interim outlines pending counsel review — not final legal text."
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
      />

      <Section narrow>
        <article id="privacy" className="scroll-mt-28">
          <h2 className="headline-lg text-balance">Privacy notice (summary)</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
            {/* PLACEHOLDER — counsel-approved Privacy copy */}
            Summary pending counsel review. Vault intends to describe how personal and business
            data is collected through Apply, Partner Application, Contact, and Client Login; the
            purposes of processing; retention; and how to submit rights requests.
          </p>
          <div className="mt-8">
            <CheckList
              items={[
                "Categories of data collected from forms, portal activity, and support channels",
                "Uses limited to originating credit, partner diligence, operations, and legal compliance",
                "Sharing with processors, lenders, escrow, and vendors under role-scoped access",
                "How to request access, correction, or deletion where applicable law provides",
              ]}
            />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-line-strong bg-paper/80 px-6 py-5">
            <p className="text-[0.875rem] font-medium text-charcoal">
              {/* PLACEHOLDER — full document or PDF link */}
              Full privacy notice document pending Vault legal review.
            </p>
          </div>
        </article>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Terms of Use (summary)</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — counsel-approved Terms copy */}
            Summary pending counsel review. Expected topics include acceptable use of the marketing
            site and borrower portal, account credentials, prohibition on scraping sensitive data,
            limitation of liability, and governing law.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList
            items={[
              "Site and portal content is informational — not a commitment to lend",
              "Users must not misuse credentials or attempt unauthorized access",
              "Vault may update terms; material changes will be posted when counsel finalizes process",
              "Disputes and governing law to be stated in the counsel-approved document",
            ]}
          />
        </div>
      </SoftStage>

      <Section tone="paper" narrow>
        <article id="lending" className="scroll-mt-28">
          <h2 className="headline-lg text-balance">Lending disclosures (summary)</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
            {/* PLACEHOLDER — counsel-approved lending disclosures */}
            Summary pending counsel review. Product pages describe structure and fit. They do not
            publish rates, LTVs, or APR figures. Formal consumer or commercial disclosures required
            by applicable law will link here when counsel supplies them.
          </p>
          <div className="mt-8">
            <CheckList
              items={[
                "Marketing copy is not a loan offer, commitment, or guarantee of terms",
                "Specific pricing and structure are evaluated after application on a deal basis",
                "State and federal disclosure packets to be linked when approved",
                "Licensing identifiers belong under Licensing & Compliance — not invented here",
              ]}
            />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-line-strong bg-white px-6 py-5">
            <p className="text-[0.875rem] font-medium text-charcoal">
              {/* PLACEHOLDER — full document or PDF link */}
              Full lending disclosure set pending Vault legal review.
            </p>
          </div>
        </article>
      </Section>

      <Section>
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/trust/licensing",
              label: "Licensing & Compliance",
              body: "How to request the compliance pack.",
            },
            {
              href: "/trust/security",
              label: "Security & Data Protection",
              body: "Access model, audit trail, data handling.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.plans.src}
        title="Questions about legal documents?"
        description="Contact Vault for counsel-routed requests. For a live credit file, start Apply to create portal access."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/apply"
        secondaryLabel="Apply Now"
      />
    </>
  );
}
