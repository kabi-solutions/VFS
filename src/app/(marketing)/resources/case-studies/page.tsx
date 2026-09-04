import type { Metadata } from "next";
import { CheckList, FinalCta, PageHero, Section, SoftStage } from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Illustrative, anonymized examples of how Vault private capital can support investor strategies.",
};

const studies = [
  {
    title: "Metro rehab acquisition",
    market: "Sun Belt metro",
    product: "Fix & flip / rehab",
    shape:
      "Investor acquired a dated single-family asset with a defined renovation scope and a planned resale exit within a short hold.",
    points: [
      "Purchase plus rehab budget sized to as-is and after-repair underwriting inputs",
      "Draw releases tied to verified work against the approved budget",
      "Exit framed as sale or refinance — terms evaluated deal by deal",
    ],
  },
  {
    title: "Transitional bridge hold",
    market: "Coastal secondary market",
    product: "Bridge",
    shape:
      "Borrower needed short-term capital while positioning a recently acquired property for takeout refinance after lease-up.",
    points: [
      "Emphasis on exit timing and collateral quality over permanent amortization",
      "File moved through published lifecycle gates with document requests in portal",
      "Takeout path documented before funding — not a rate-sheet promise",
    ],
  },
  {
    title: "Rental DSCR refinance",
    market: "Growth corridor",
    product: "DSCR / non-QM",
    shape:
      "Operator refinanced a stabilized rental using property cash-flow coverage rather than full personal income underwriting.",
    points: [
      "Qualification framed around debt service coverage from rents",
      "Entity borrower paperwork and rent roll collected in the portal",
      "Program fit confirmed in underwriting — no published APR on this page",
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Case studies"
        description="Anonymized, illustrative deal shapes pending Vault-owned funded narratives — not rate advertisements or guarantees of terms."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/resources", label: "Learning Center" }}
        image={images.funded}
      />

      <Section>
        {/* PLACEHOLDER — replace with Vault-approved anonymized funded deals; no precise APRs or LTVs */}
        <p className="mx-auto max-w-[40rem] text-center text-[0.9375rem] text-steel">
          Figures below stay qualitative on purpose. Specific pricing is evaluated after application.
        </p>
        <ul className="mt-12 space-y-10">
          {studies.map((study) => (
            <li
              key={study.title}
              className="rounded-[2rem] bg-paper px-8 py-10 ring-1 ring-black/[0.04] sm:px-10"
            >
              <p className="text-[0.875rem] font-semibold text-green">
                {study.product} · {study.market}
              </p>
              <h2 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
                {study.title}
              </h2>
              <p className="body-md mt-4 max-w-2xl">{study.shape}</p>
              <div className="mt-6 max-w-xl">
                <CheckList items={study.points} />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">Your file will tell a clearer story</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — Vault marketing to supply real funded narratives when approved */}
            When Vault publishes live case studies, they will sit here with counsel-approved
            anonymization. Until then, Apply is the path to a real underwriting conversation.
          </p>
        </div>
      </SoftStage>

      <FinalCta imageSrc={images.funded.src} />
    </>
  );
}
