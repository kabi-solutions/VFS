import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CheckList,
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";
import { getStateBySlug, starterStates } from "@/lib/marketing/states";

export function generateStaticParams() {
  return starterStates.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) {
    return { title: "Market" };
  }
  return {
    title: `${state.name} Lending`,
    description: `Private lending context for investors in ${state.name}. ${state.blurb}`,
  };
}

export default async function StateLocationPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  return (
    <>
      <PageHero
        eyebrow={`${state.abbr} · Markets`}
        title={`${state.name} investor lending`}
        description={`${state.blurb} Vault evaluates files against product fit and market coverage — not a promise that every structure is available in every county.`}
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
        image={images.funded}
      />

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Products discussed in {state.name}</h2>
          <p className="body-lg mt-5">
            Availability is confirmed during review. Qualitatively, investors in {state.name}{" "}
            typically inquire about:
          </p>
          <div className="mt-8">
            <CheckList
              items={[
                "Private money and hard-money structures for acquisition",
                "Rehab / fix-and-flip credit when renovation scope is defined",
                "Bridge holds with a clear exit into sale or refinance",
                "Ground-up construction with milestone draws where the project fits",
                "DSCR / non-QM rental credit when property cash flow supports the file",
              ]}
            />
          </div>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-steel">
            Terms stay deal-specific. Vault does not publish rate or LTV tables on state pages.
          </p>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Process in this market</h2>
            <p className="body-lg mt-5">
              Same gated lifecycle as every Vault file — application through funding — with portal
              visibility for documents and status.
            </p>
          </div>
          <div>
            <div className="mt-2 lg:mt-0">
              <CheckList
                items={[
                  "Start Apply to create borrower portal access for your entity",
                  "Upload property, entity, and strategy documents when requested",
                  "Respond to info-requested loops without restarting the file",
                  "Track clear-to-close and funding gates in the portal",
                ]}
              />
            </div>
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Licensing & coverage</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — counsel to supply state-specific licensing disclosure; do not invent NMLS or license IDs */}
            Listing {state.name} as a starter market does not by itself mean Vault holds every
            license that may be required for every loan type in every locality. Authoritative
            licensing language will appear under Trust when counsel finalizes copy. Ask Contact or
            your Vault representative for current coverage on your transaction.
          </p>
        </div>
      </SoftStage>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">{state.name} FAQs</h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            <div className="py-7">
              <dt className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                Does a {state.name} page mean every product is available everywhere?
              </dt>
              <dd className="body-md mt-3">
                No. Product fit and coverage are confirmed on the file. County-level and structure
                constraints can apply even within a listed state.
              </dd>
            </div>
            <div className="py-7">
              <dt className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                Where do I find licensing IDs for {state.abbr}?
              </dt>
              <dd className="body-md mt-3">
                Licensing identifiers are not invented on marketing pages. Request materials via
                Contact or review Trust → Licensing when Vault publishes the compliance pack.
              </dd>
            </div>
            <div className="py-7">
              <dt className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                How do I start a {state.name} file?
              </dt>
              <dd className="body-md mt-3">
                Apply with property and borrower details. Portal access is created on submit so you
                can return with documents and track status.
              </dd>
            </div>
          </dl>
        </div>
      </Section>

      <Section tone="mist">
        <RelatedLinks
          title="Next steps"
          links={[
            {
              href: "/locations",
              label: "All starter markets",
              body: "Return to the states index.",
            },
            {
              href: "/solutions/private-money",
              label: "Private Money",
              body: "Asset-based product overview.",
            },
            {
              href: "/resources/faqs",
              label: "FAQs",
              body: "Markets, documents, and portal.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title={`Ready to submit a ${state.name} file?`}
        description="Apply creates your portal. Prefer a conversation first — Contact Vault with property and strategy context."
        secondaryHref="/contact"
        secondaryLabel="Contact Vault"
      />
    </>
  );
}
