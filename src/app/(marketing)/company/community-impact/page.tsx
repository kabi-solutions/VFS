import type { Metadata } from "next";
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
  title: "Community Impact",
  description:
    "Vault Financial Services supports youth housing initiatives in Southern Nevada, including NPHY. Details pending Vault confirmation.",
};

export default function CommunityImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Community impact"
        description="Private lending sits inside a local community. Vault directs a portion of funded-deal proceeds toward youth housing initiatives in Southern Nevada."
        primaryCta={{ href: "/company/about", label: "About Vault" }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
        image={images.community}
      />

      <Section narrow>
        <p className="text-[0.875rem] font-semibold text-green">Southern Nevada</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Youth housing support, not marketing garnish.
        </h2>
        <div className="mt-8 space-y-5 text-[1.125rem] leading-relaxed text-steel">
          <p>
            {/* PLACEHOLDER — confirm NPHY sponsorship copy, % of funded deals, and program details with Vault */}
            A portion of funded deals supports youth housing initiatives in Southern Nevada, including
            work aligned with Nevada Partnership for Homeless Youth (NPHY). Exact allocation mechanics
            and program partners are pending Vault confirmation before any quantitative claims.
          </p>
          <p>
            This page prioritizes credibility over conversion. Apply lives elsewhere on the site; the
            work here is about where Vault chooses to put community capital.
          </p>
        </div>
      </Section>

      <SoftStage src={images.community.src}>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance text-ink">What we stand behind</h2>
          <p className="body-lg mt-5">
            Language stays careful until Vault signs off on percentages, partner logos, and annual
            reporting.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-[34rem]">
          <CheckList
            items={[
              "Focus on youth housing stability in Southern Nevada",
              "Partnership posture with NPHY-aligned initiatives",
              "No invented dollar totals or impact percentages on this page",
              "Updates published only after Vault compliance review",
            ]}
          />
        </div>
      </SoftStage>

      <Section tone="ink">
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance text-white">Why it belongs next to the business</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-white/70">
            {/* PLACEHOLDER — confirm narrative with Vault leadership */}
            Vault originates investor credit nationally with Southern Nevada roots. Community impact is
            part of that local accountability — separate from product marketing and rate language we
            refuse to invent.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-2">
          <PhotoTile
            href="/locations/nevada"
            title="Nevada coverage"
            body="Southern Nevada focus, including community impact initiatives."
            image={images.hero}
            cta="View Nevada"
          />
          <PhotoTile
            href="/company/about"
            title="Our story"
            body="Institutional private lending with an audited path to funding."
            image={images.capital}
            cta="About Vault"
          />
        </div>
      </Section>

      <Section tone="paper">
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/company/about",
              label: "About",
              body: "Operating model and institutional voice.",
            },
            {
              href: "/company/press",
              label: "Press & Media",
              body: "Media inquiries and approved coverage clips.",
            },
            {
              href: "/locations",
              label: "States we serve",
              body: "Starter markets and state landing pages.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.community.src}
        title="Questions about our impact work?"
        description="Ask Vault directly. We will not invent sponsorship percentages or licensing numbers to fill this page."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/company/about"
        secondaryLabel="Our story"
      />
    </>
  );
}
