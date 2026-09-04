import type { Metadata } from "next";
import {
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Press & Media",
  description:
    "Press mentions and media contact for Vault Financial Services. Approved coverage and media kit requests are coordinated through Contact.",
};

/* PLACEHOLDER — replace with real outlets, dates, and links after Vault approval */
const mentions = [
  {
    outlet: "Regional Business Journal",
    date: "2025",
    headline: "Private lenders expand digital borrower portals for investor credit",
    summary:
      "Illustrative mention describing audited lifecycle tooling for real estate private credit. Not a published Vault article.",
  },
  {
    outlet: "Housing Finance Weekly",
    date: "2025",
    headline: "Asset-based underwriting stays central as investor demand shifts",
    summary:
      "Citation on deal-first private money structures — awaiting verified outlet link and Vault approval.",
  },
  {
    outlet: "Southern Nevada Business Desk",
    date: "2024",
    headline: "Local capital groups deepen youth housing partnerships",
    summary:
      "Community-impact angle aligned with NPHY support messaging — confirm with Vault before publishing.",
  },
] as const;

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Press & Media"
        description="Coverage of Vault Financial Services and media inquiries. Mentions appear here after Vault supplies approved clips and outlet links."
        primaryCta={{ href: "/contact", label: "Media inquiries" }}
        secondaryCta={{ href: "/company/about", label: "About Vault" }}
        image={images.plans}
      />

      <Section>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Selected mentions</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — confirm press list and embargo rules with Vault */}
            No fabricated awards or circulation metrics. Each row awaits a real outlet link and
            Vault-approved headline.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-line border-y border-line">
          {mentions.map((item) => (
            <li key={item.headline} className="grid gap-3 py-8 sm:grid-cols-[7rem_1fr] sm:gap-8">
              <div>
                <p className="text-[0.875rem] font-semibold text-green">{item.date}</p>
                <p className="mt-1 text-[0.875rem] text-steel">{item.outlet}</p>
              </div>
              <div>
                <p className="text-[1.1875rem] font-semibold tracking-[-0.02em] text-ink">
                  {item.headline}
                </p>
                <p className="mt-2 max-w-[40rem] text-[1.0625rem] leading-relaxed text-steel">
                  {item.summary}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[34rem] text-center">
          <h2 className="headline-lg text-balance text-ink">Media kit & inquiries</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — brand assets and boilerplate pending Vault */}
            For interviews, logo assets, or corporate boilerplate, use Contact. Do not invent NMLS
            identifiers or rate tables in third-party copy.
          </p>
        </div>
      </SoftStage>

      <Section tone="paper">
        <RelatedLinks
          title="Company context"
          links={[
            {
              href: "/company/about",
              label: "About",
              body: "Operating model and institutional voice.",
            },
            {
              href: "/company/leadership",
              label: "Leadership",
              body: "Team roles and bios pending Vault-approved headshots.",
            },
            {
              href: "/company/community-impact",
              label: "Community impact",
              body: "Southern Nevada youth housing support.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.plans.src}
        title="Reach the press desk"
        description="Send media requests through Contact. Marketing pages will not invent quotes or licensing numbers for you."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/company/about"
        secondaryLabel="Our story"
      />
    </>
  );
}
