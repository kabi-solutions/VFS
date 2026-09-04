import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckList,
  FinalCta,
  PageHero,
  PhotoTile,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Licensing & Compliance",
  description:
    "How Vault approaches licensing diligence: what will be published, how to request a compliance pack, and where state coverage is discussed.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Licensing & compliance."
        description="Written for diligence. Licensing identifiers and state coverage are published only when Vault’s compliance pack is ready — never invented for the site."
        secondaryCta={{ href: "/contact", label: "Request compliance pack" }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[16ch] text-balance">What Vault will publish</h2>
            <p className="body-lg mt-5">
              {/* PLACEHOLDER — Vault licensing pack (NMLS, state licenses, disclosures) */}
              When counsel and compliance finalize materials, this page will host the authoritative
              schedule — not marketing claims scattered across product pages.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Company and individual license identifiers when authorized for public display",
                  "State-by-state coverage notes tied to product types where required",
                  "Links to consumer or commercial disclosure documents counsel approves",
                  "Update cadence so diligence teams know when the pack was last refreshed",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[16ch] text-balance">What you will not see here yet</h2>
            <p className="body-lg mt-5">
              No NMLS numbers, license IDs, or “licensed in every state” assertions appear on this
              site until Vault supplies them. Location pages describe markets; they are not a
              license roster.
            </p>
            <div className="mt-8 rounded-[1.75rem] bg-paper px-7 py-7 ring-1 ring-black/[0.04]">
              <p className="text-[0.875rem] font-semibold tracking-[0.06em] text-green uppercase">
                Interim posture
              </p>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-charcoal">
                {/* PLACEHOLDER — replace with Vault-supplied licensing schedule */}
                State-by-state licensing schedule and disclosure links await Vault compliance
                materials. Ask Contact for the current diligence path on your transaction.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">How to request a compliance pack</h2>
          <p className="body-lg mt-5">
            Capital partners, counsel, and counterparties can request licensing materials through
            Contact. Include your firm, the states and products in scope, and whether you need a
            formal questionnaire response. Vault will route the request to compliance — not invent
            identifiers to unblock a form.
          </p>
          <p className="mt-8 text-[0.9375rem] leading-relaxed text-steel">
            Prefer a conversation first?{" "}
            <Link href="/contact" className="font-medium text-green hover:text-green-hover">
              Contact Vault
            </Link>
            .
          </p>
        </div>
      </SoftStage>

      <Section tone="paper">
        <h2 className="headline-lg max-w-[18ch] text-balance">State coverage context</h2>
        <p className="body-lg mt-5 max-w-[40rem]">
          Starter markets under Locations describe where Vault prioritizes investor demand. Formal
          licensing language stays on Trust pages when counsel finalizes copy.
        </p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <PhotoTile
            href="/locations"
            title="Locations"
            body="Starter state landings and how coverage is framed."
            image={images.community}
            cta="View markets"
          />
          <PhotoTile
            href="/trust/legal"
            title="Legal"
            body="Privacy, Terms, and lending disclosure outlines."
            image={images.capital}
            cta="View legal"
          />
        </div>
      </Section>

      <Section>
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/trust/security",
              label: "Security & Data Protection",
              body: "Role-based access and audit history.",
            },
            {
              href: "/capital-partners",
              label: "Why Partner With Vault",
              body: "Diligence posture for capital partners.",
            },
            {
              href: "/resources/faqs",
              label: "FAQs",
              body: "Markets, licensing questions, and portal.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Need licensing materials for diligence?"
        description="Contact Vault with the states and products in scope. Apply remains the path for live borrower files."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/apply"
        secondaryLabel="Apply Now"
      />
    </>
  );
}
