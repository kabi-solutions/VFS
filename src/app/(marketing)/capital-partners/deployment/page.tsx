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
  title: "How Capital Deployment Works",
  description:
    "Lifecycle gates capital partners can diligence — from application through underwriting, clear to close, and funding.",
};

const gates = [
  {
    n: "01",
    title: "Application submitted",
    body: "Borrower file enters the pipeline with property, loan type, and attribution captured at intake.",
  },
  {
    n: "02",
    title: "Initial review",
    body: "Vault screens fit before package work begins. Files that need more detail move to info-requested.",
  },
  {
    n: "03",
    title: "Package submission",
    body: "Documents land against the file. Processors are assigned; missing items are tagged to this stage.",
  },
  {
    n: "04",
    title: "Underwriting",
    body: "Credit and collateral review under published gates. Capital partners diligence the same stage language.",
  },
  {
    n: "05",
    title: "Clear to close",
    body: "Conditions cleared. Escrow assignment is active; closing prep begins with an audit trail intact.",
  },
  {
    n: "06",
    title: "Signing & funding",
    body: "Execution and wire. Funded status and attribution history remain available for reporting.",
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Capital deployment"
        title="How capital deployment works."
        description="A controlled lifecycle with gates lenders care about — assignment, status history, and info-requested loops that return to the originating stage."
        image={images.plans}
        primaryCta={{
          href: "/capital-partners/apply",
          label: "Partner Application",
        }}
        secondaryCta={{
          href: "/capital-partners",
          label: "Why Partner With Vault",
        }}
      />

      <Section>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Lifecycle gates, not a black box.</h2>
          <p className="body-lg mt-5">
            Every file advances through the same sequence. Capital partners evaluate process quality
            before committing capital — then see those gates reflected in file history.
          </p>
        </div>
        <ol className="mx-auto mt-12 max-w-[720px] border-t border-line">
          {gates.map((gate) => (
            <li
              key={gate.n}
              className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7 sm:gap-6"
            >
              <span className="font-mono text-[0.8125rem] tabular-nums text-green">{gate.n}</span>
              <div>
                <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">
                  {gate.title}
                </h3>
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-steel">{gate.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <BrandImage
            src={images.investor.src}
            alt={images.investor.alt}
            greenAccent="corner"
            className="aspect-[4/3] rounded-[2rem]"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
          <div>
            <h2 className="headline-lg text-balance">Controls around the money.</h2>
            <div className="mt-6">
              <CheckList
                items={[
                  "Processor and escrow org assignment per file",
                  "Info-requested returns to the stage it came from",
                  "Attribution retained for funded-loan reporting",
                  "Denied and funded timestamps on the record",
                ]}
              />
            </div>
          </div>
        </div>
      </SoftStage>

      <Section tone="paper" narrow>
        <RelatedLinks
          title="Capital partner next steps"
          links={[
            {
              href: "/capital-partners",
              label: "Why Partner With Vault",
              body: "Process, risk posture, and audit trail.",
            },
            {
              href: "/capital-partners/apply",
              label: "Partner Application",
              body: "Creates a pending capital_partner organization for diligence.",
            },
            {
              href: "/trust/security",
              label: "Security & Data Protection",
              body: "Role-based access and audit history.",
            },
          ]}
        />
      </Section>

      <FinalCta
        title="Open a pending partner organization."
        description="A Partner Application creates a capital_partner record in pending_review for diligence — not a disposable lead."
        primaryHref="/capital-partners/apply"
        primaryLabel="Partner Application"
        secondaryHref="/contact"
        secondaryLabel="Contact Vault"
        imageSrc={images.funded.src}
      />
    </>
  );
}
