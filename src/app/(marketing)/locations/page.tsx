import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckList,
  FinalCta,
  PageHero,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";
import { starterStates } from "@/lib/marketing/states";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "How Vault market coverage works for investor lending — starter states, licensing caveats, and how to apply by state.",
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets"
        title="States we serve"
        description="A national operating model with state-specific coverage. These starter markets power dynamic landings — licensing is not implied solely by presence on this list."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
        image={images.community}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">How coverage works</h2>
            <p className="body-lg mt-5">
              Vault prioritizes markets where investor acquisition, rehab, bridge, and rental
              activity support a durable pipeline. Starter state pages explain local context and how
              to engage — product fit is confirmed during application review, not assumed from the
              map alone.
            </p>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">How to apply by state</h2>
            <div className="mt-6">
              <CheckList
                items={[
                  "Open the state landing for market context and next steps",
                  "Start Apply with property address and loan intent — portal access is created on submit",
                  "Upload entity and property documents when the processor requests them",
                  "Use Contact if you need a coverage conversation before submitting",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Licensing caveat</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — counsel to confirm licensed markets before production claims */}
            Formal licensing and disclosure language will live under Trust when finalized. Do not
            treat this index as a license roster. A listed state means Vault is prepared to discuss
            investor files there — not that every license ID is published on the marketing site.
          </p>
          <p className="mt-6 text-[0.9375rem] text-steel">
            See{" "}
            <Link href="/trust/licensing" className="font-medium text-green hover:text-green-hover">
              Licensing & Compliance
            </Link>{" "}
            to request the diligence pack.
          </p>
        </div>
      </SoftStage>

      <Section tone="paper">
        <h2 className="headline-lg text-center text-balance">Starter markets</h2>
        <p className="mx-auto mt-4 max-w-[36rem] text-center body-md">
          Select a state for products discussed qualitatively, process, and an Apply path for that
          market.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {starterStates.map((state) => (
            <li key={state.slug}>
              <Link
                href={`/locations/${state.slug}`}
                className="group flex h-full flex-col rounded-[1.75rem] bg-white px-6 py-7 ring-1 ring-black/[0.04] transition hover:shadow-[0_16px_50px_rgba(0,0,0,0.07)]"
              >
                <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-green">
                  {state.abbr}
                </span>
                <span className="mt-2 text-[1.25rem] font-semibold tracking-[-0.02em] text-ink group-hover:text-green">
                  {state.name}
                </span>
                <span className="body-md mt-3 flex-1">{state.blurb}</span>
                <span className="mt-5 text-[0.875rem] font-medium text-green">View market</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Financing a deal in one of these markets?"
        description="Apply to create portal access, or contact Vault with a market-specific question before you submit."
      />
    </>
  );
}
