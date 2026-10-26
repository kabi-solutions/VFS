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
    "Privacy, Terms of Use, and lending disclosure summaries for Vault Financial Services — how we handle data, site use, and credit communications.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Legal."
        description="Privacy, Terms, and lending disclosures in one place. Summaries below describe how Vault operates; contact us for the full counsel-approved document set."
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
      />

      <Section narrow>
        <article id="privacy" className="scroll-mt-28">
          <h2 className="headline-lg text-balance">Privacy notice (summary)</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
            Vault collects personal and business information through Apply, Partner Application,
            Contact, and Client Login to originate credit, conduct partner diligence, operate the
            portal, and meet legal obligations. We retain records as needed for the file lifecycle
            and applicable retention rules, and we honor rights requests where the law provides.
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
          <div className="mt-6 rounded-[1.5rem] border border-line-strong bg-paper/80 px-6 py-5">
            <p className="text-[0.875rem] font-medium text-charcoal">
              Request the full privacy notice through Contact — Vault will provide the current
              counsel-approved document for your diligence file.
            </p>
          </div>
        </article>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Terms of Use (summary)</h2>
          <p className="body-lg mt-5">
            The marketing site and borrower portal are provided for informational and operational
            use. Content is not a commitment to lend. Users must protect credentials, refrain from
            unauthorized access or scraping of sensitive data, and use the platform for legitimate
            business purposes related to Vault credit.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList
            items={[
              "Site and portal content is informational — not a commitment to lend",
              "Users must not misuse credentials or attempt unauthorized access",
              "Vault may update terms; material changes will be posted on this Trust section",
              "Governing law and dispute resolution are stated in the full Terms document",
            ]}
          />
        </div>
      </SoftStage>

      <Section tone="paper" narrow>
        <article id="lending" className="scroll-mt-28">
          <h2 className="headline-lg text-balance">Lending disclosures (summary)</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
            Product pages describe structure and fit. They do not publish rates, LTVs, or APR
            figures. Vault credit is for business-purpose, non-owner-occupied real estate and is
            subject to credit approval and applicable state licensing. Formal disclosure packets
            required by law are provided during the loan process and available on request.
          </p>
          <div className="mt-8">
            <CheckList
              items={[
                "Marketing copy is not a loan offer, commitment, or guarantee of terms",
                "Specific pricing and structure are evaluated after application on a deal basis",
                "State and federal disclosure packets are delivered with the file when required",
                "Licensing identifiers belong under Licensing & Compliance — request the pack for IDs",
              ]}
            />
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-line-strong bg-white px-6 py-5">
            <p className="text-[0.875rem] font-medium text-charcoal">
              Need the full lending disclosure set for diligence? Contact Vault with your firm and
              the products or states in scope.
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
              label: "Licensing",
              body: "How to request Vault’s compliance and licensing pack.",
            },
            {
              href: "/trust/security",
              label: "Security",
              body: "Role-based access and audited status history.",
            },
            {
              href: "/contact",
              label: "Contact",
              body: "Reach Vault for document requests and questions.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.plans.src}
        title="Questions on legal or compliance materials?"
        description="Contact Vault with your firm, the documents you need, and the states or products in scope."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/trust/licensing"
        secondaryLabel="Licensing"
      />
    </>
  );
}
