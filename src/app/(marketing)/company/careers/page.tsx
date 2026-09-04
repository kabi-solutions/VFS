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
  title: "Careers",
  description:
    "Careers at Vault Financial Services — private lending operations, credit, and capital markets roles. Openings are confirmed through Contact until an ATS is connected.",
};

/* PLACEHOLDER — replace with live ATS postings and accurate locations */
const openings = [
  {
    title: "Loan Processor",
    team: "Operations",
    location: "Las Vegas, NV / Hybrid",
    type: "Full-time",
    summary:
      "Own package intake, info-requested loops, and condition tracking across the published loan lifecycle.",
  },
  {
    title: "Underwriter",
    team: "Credit",
    location: "Las Vegas, NV / Hybrid",
    type: "Full-time",
    summary:
      "Evaluate investor real estate credit files — private money, bridge, rehab, and DSCR — with clear condition ownership.",
  },
  {
    title: "Capital Markets Associate",
    team: "Capital",
    location: "Las Vegas, NV",
    type: "Full-time",
    summary:
      "Support partner diligence, pending organization review, and deployment reporting for capital partners.",
  },
] as const;

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Careers"
        description="Join a private lending team built around file quality, audited process, and institutional plain English — not invented rate tables."
        primaryCta={{ href: "/contact", label: "Contact recruiting" }}
        secondaryCta={{ href: "/company/about", label: "About Vault" }}
        image={images.capital}
      />

      <SoftStage src={images.plans.src}>
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance text-ink">How we work together</h2>
            <p className="body-lg mt-5">
              {/* PLACEHOLDER — culture statements pending Vault HR */}
              Roles sit on a shared lifecycle. Processors, underwriters, and capital markets share one
              system of record for status, documents, and conditions.
            </p>
          </div>
          <CheckList
            items={[
              "Published stages with retained status history",
              "Clear ownership of conditions and info requests",
              "Borrower and partner portals that outlast a single email thread",
              "Compliance-minded copy — no fake metrics in marketing work",
            ]}
          />
        </div>
      </SoftStage>

      <Section>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Open roles</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — confirm openings, compensation bands, and application email with Vault */}
            Listings below are illustrative. Apply through Contact until Vault connects an ATS.
          </p>
        </div>

        <ul className="mt-12 space-y-4">
          {openings.map((job) => (
            <li
              key={job.title}
              className="rounded-[1.75rem] border border-line bg-paper/60 px-6 py-7 sm:px-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                  {job.title}
                </h3>
                <p className="text-[0.875rem] font-medium text-green">{job.type}</p>
              </div>
              <p className="mt-2 text-[0.9375rem] text-steel">
                {job.team} · {job.location}
              </p>
              <p className="mt-4 max-w-[44rem] text-[1.0625rem] leading-relaxed text-charcoal">
                {job.summary}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink">
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance text-white">Don&apos;t see a fit?</h2>
          <p className="mt-5 text-[1.125rem] leading-relaxed text-white/70">
            Send a brief note through Contact. We keep speculative outreach for credit, operations,
            and capital markets when openings are not yet public.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/company/leadership",
              label: "Leadership",
              body: "Who owns credit, ops, and capital markets.",
            },
            {
              href: "/company/about",
              label: "About",
              body: "Operating model and institutional voice.",
            },
            {
              href: "/trust/security",
              label: "Security",
              body: "How we think about systems and access.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.capital.src}
        title="Interested in joining Vault?"
        description="Use Contact to reach recruiting. Role details and compensation remain Vault-confirmed before any public offer language."
        primaryHref="/contact"
        primaryLabel="Contact recruiting"
        secondaryHref="/company/leadership"
        secondaryLabel="Leadership"
      />
    </>
  );
}
