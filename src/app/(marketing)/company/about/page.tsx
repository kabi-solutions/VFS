import type { Metadata } from "next";
import {
  CheckList,
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { BrandImage } from "@/components/marketing/BrandImage";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vault Financial Services — private real estate credit with a durable borrower portal and an audited path to funding.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Our story"
        description="Vault Financial Services originates private real estate credit for investors who need certainty of close, disciplined underwriting, and a process that holds through funding."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/company/leadership", label: "Leadership" }}
        image={images.capital}
      />

      <Section narrow>
        <p className="text-[0.875rem] font-semibold text-green">Institutional private lending</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Built for the file — not the brochure.
        </h2>
        <div className="mt-8 space-y-5 text-[1.125rem] leading-relaxed text-steel">
          <p>
            {/* PLACEHOLDER — confirm founding narrative and Southern Nevada roots with Vault */}
            Vault operates a national lending model with deep roots in Southern Nevada. We underwrite
            investor real estate credit — private money, rehab, bridge, ground-up, and DSCR — with
            terms evaluated deal by deal after application.
          </p>
          <p>
            Borrowers open a durable portal when they apply. Documents, conditions, and status history
            stay attached to the file across the published lifecycle — from initial review through
            clear to close and funding.
          </p>
          <p>
            We do not publish invented rates, LTVs, or licensing numbers on marketing pages. Product
            fit is explained in plain language; specific economics follow diligence on the live file.
          </p>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance text-ink">How we work</h2>
          <p className="body-lg mt-5">
            Process discipline is the product. Every stage is named, gated, and retained for audit.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-[32rem]">
          <CheckList
            items={[
              "Digital Apply creates borrower portal access on submit",
              "Published lifecycle with status history at each gate",
              "Processor routing, conditions, and info-requested loops on the file",
              "Capital partners enter through diligence — not disposable lead forms",
            ]}
          />
        </div>
      </SoftStage>

      <Section tone="ink">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-[0.875rem] font-semibold text-green">Where we lend</p>
            <h2 className="headline-lg mt-3 max-w-[16ch] text-balance text-white">
              National operating model. State-specific coverage.
            </h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-white/70">
              {/* PLACEHOLDER — licensing may not exist in all listed markets */}
              Starter markets and state landing pages live under Locations. Licensing disclosures are
              maintained under Trust — not as decorative badges on this page.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
            {/* PLACEHOLDER — commissioned photography */}
            <BrandImage
              src={images.hero.src}
              alt={images.hero.alt}
              greenAccent="edge"
              className="absolute inset-0"
              sizes="(max-width: 1024px) 90vw, 480px"
            />
            <div className="absolute inset-0 bg-ink/55" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="text-[1.125rem] font-semibold text-white">States we serve</p>
              <p className="mt-1.5 text-[0.9375rem] text-white/75">
                Explore market pages and coverage language without invented license IDs.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <RelatedLinks
          title="Continue exploring"
          links={[
            {
              href: "/company/leadership",
              label: "Leadership",
              body: "Team bios and roles — photos pending Vault approval.",
            },
            {
              href: "/company/community-impact",
              label: "Community impact",
              body: "Youth housing support in Southern Nevada.",
            },
            {
              href: "/solutions/private-money",
              label: "Private Money",
              body: "Custom private capital structured around the deal.",
            },
            {
              href: "/capital-partners",
              label: "Capital partners",
              body: "Deploy capital into Vault-originated credit.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Ready to put a file in motion?"
        description="Apply creates your borrower portal so documents and status live in one audited trail."
      />
    </>
  );
}
