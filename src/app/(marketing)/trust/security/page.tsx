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
  title: "Security & Data Protection",
  description:
    "Vault’s operating security model: role-based access, audited lifecycle history, and how borrower and partner data is handled.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Security & data protection."
        description="Access is role-scoped. Status history is retained. Security language here describes the operating model — not a substitute for a formal security questionnaire."
        image={images.capital}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Access model</h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
              Borrowers, Vault operators, processors, lenders, and escrow each see what their role
              requires. Organization assignment binds users to the firms active on a file.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Borrower portal scoped to their applications",
                  "Processor access tied to assigned processor org",
                  "Lender visibility for capital partners on relevant files",
                  "Escrow access for closing coordination",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Audit trail</h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
              Lifecycle status is not overwritten in silence. Gates, info-requested loops, and
              funding outcomes remain on the record for operational review and partner diligence.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Published status sequence from application to funded or denied",
                  "Info-requested tagged to the originating stage",
                  "Timestamps on funded and denied outcomes",
                  "Attribution retained for reporting on funded loans",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Data handling</h2>
          <p className="body-lg mt-5">
            Application, document, and contact data exist to originate and service credit files, run
            partner diligence, and meet operational and legal obligations. Marketing pages do not
            publish borrower documents. Formal privacy language lives under Legal when counsel
            finalizes copy.
          </p>
          <div className="mt-8">
            <CheckList
              items={[
                "Collect what the file needs — property, entity, identity, and strategy context",
                "Limit portal visibility by role and organization assignment",
                "Retain lifecycle history so status changes stay reviewable",
                "Route security questionnaires through Contact until attestations are published",
              ]}
            />
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Built for operational diligence</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — formal security / SOC / infra disclosures when available */}
            Formal infrastructure attestations and vendor security questionnaires will be linked
            here when Vault publishes them. Until then, this page describes access, audit, and data
            handling posture only.
          </p>
        </div>
      </SoftStage>

      <Section>
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/trust/licensing",
              label: "Licensing & Compliance",
              body: "How to request Vault’s compliance pack.",
            },
            {
              href: "/trust/legal",
              label: "Legal",
              body: "Privacy, Terms, and lending disclosure outlines.",
            },
            {
              href: "/capital-partners/deployment",
              label: "How Deployment Works",
              body: "Lifecycle gates capital partners diligence.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Need a security questionnaire answered?"
        description="Contact Vault with your diligence scope. Borrower files start with Apply."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/apply"
        secondaryLabel="Apply Now"
      />
    </>
  );
}
