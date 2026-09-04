import { images } from "@/lib/marketing/images";

export type SolutionSlug =
  | "private-money"
  | "rehab-fix-flip"
  | "bridge-loans"
  | "ground-up"
  | "dscr-non-qm";

export type SolutionFaq = {
  question: string;
  answer: string;
};

export type SolutionContent = {
  slug: SolutionSlug;
  href: string;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  whoFor: string[];
  differentiators: string[];
  processTitle: string;
  processBody: string;
  processPoints: string[];
  documents: string[];
  faqs: SolutionFaq[];
  image: { src: string; alt: string };
  related: SolutionSlug[];
};

export const solutions: Record<SolutionSlug, SolutionContent> = {
  "private-money": {
    slug: "private-money",
    href: "/solutions/private-money",
    name: "Private Money",
    eyebrow: "Umbrella structure",
    headline: "Custom private capital structured around the deal.",
    description:
      "Private Money is Vault’s umbrella for investor credit — first and second trust deed options evaluated case by case, with a clear path from application to LOI when the file fits.",
    whoFor: [
      "Investors who need acquisition speed outside bank templates",
      "Borrowers comparing structures before choosing rehab, bridge, ground-up, or DSCR",
      "Capital partners diligence-testing Vault’s gated pipeline",
    ],
    differentiators: [
      "Deal-first terms rather than product-only menus",
      "Same audited lifecycle and borrower portal as every Vault file",
      "Direct cross-links into the four specialized structures below",
    ],
    processTitle: "How Private Money fits",
    processBody:
      "Start here when the structure is still open. Apply captures the deal; Vault routes fit into the right product path without restarting the file.",
    processPoints: [
      "Submit property, borrower, and loan intent in one digital Apply",
      "Initial review determines structure fit and LOI when approved",
      "Portal access persists so documents and status stay with you",
    ],
    documents: [
      "Entity formation documents and operating agreement",
      "Government-issued ID for signing parties",
      "Purchase contract, refinance statement, or ownership evidence",
      "Property details and strategy summary (exit and hold)",
      "Liquidity or reserves evidence when requested",
    ],
    faqs: [
      {
        question: "Is Private Money a separate product from rehab or bridge?",
        answer:
          "Private Money is the umbrella. Many files land in rehab, bridge, ground-up, or DSCR after initial review. Starting here does not restart your file when structure is refined.",
      },
      {
        question: "Will I see rates or LTVs on this page?",
        answer:
          "No. Marketing pages describe structure and fit. Specific terms are evaluated deal by deal after Apply so invented figures never appear as product advertising.",
      },
      {
        question: "What happens after I apply?",
        answer:
          "Submitting Apply creates portal access. The file moves through published lifecycle gates — review, package, underwriting, clear to close, and funding — with status history retained.",
      },
    ],
    image: images.privateMoney,
    related: ["rehab-fix-flip", "bridge-loans", "ground-up", "dscr-non-qm"],
  },
  "rehab-fix-flip": {
    slug: "rehab-fix-flip",
    href: "/solutions/rehab-fix-flip",
    name: "Rehab / Fix & Flip",
    eyebrow: "Acquisition + rehab",
    headline: "Acquisition and renovation capital on your timeline.",
    description:
      "Sized for purchase plus rehab scope — built for investors who move between contracts quickly and need document clarity while work is underway.",
    whoFor: [
      "Fix-and-flip operators with defined scopes and exit plans",
      "Investors who need purchase and rehab capital in one file",
      "Borrowers who want status and draw-related docs in one portal",
    ],
    differentiators: [
      "Funding framed around purchase plus renovation scope",
      "Document center tracks binders, contracts, and contractor packages",
      "Plain-language gates from package through funding",
    ],
    processTitle: "What the file emphasizes",
    processBody:
      "Rehab files move fastest when scope, budget, and exit are clear up front — then the portal keeps the package and conditions visible.",
    processPoints: [
      "Capture purchase price, rehab budget, and ARV context in Apply",
      "Upload contracts, insurance, and entity docs once",
      "Track missing-info requests without restarting the application",
    ],
    documents: [
      "Purchase contract or payoff statement",
      "Rehab scope and line-item budget",
      "Contractor bids or qualifications when requested",
      "Insurance binders and entity paperwork",
      "Comparable or ARV support materials when asked",
    ],
    faqs: [
      {
        question: "Does rehab financing cover both purchase and renovation?",
        answer:
          "Files are typically framed around acquisition plus rehab scope. How capital is allocated is determined on the deal after review — not advertised as a fixed split on this site.",
      },
      {
        question: "How do draws work on a flip?",
        answer:
          "When rehab funds are reserved, releases usually follow verified progress against the approved budget. Requests and supporting docs live in the borrower portal.",
      },
      {
        question: "What speeds up underwriting?",
        answer:
          "Clear scope, budget granularity, exit timing, and complete entity packages. Incomplete files enter info-requested states tagged to the stage they came from.",
      },
    ],
    image: images.rehab,
    related: ["private-money", "bridge-loans", "ground-up"],
  },
  "bridge-loans": {
    slug: "bridge-loans",
    href: "/solutions/bridge-loans",
    name: "Bridge Loans",
    eyebrow: "Transitional capital",
    headline: "Short-term capital when ownership is transitional.",
    description:
      "Bridge acquisition, refinance, or hold periods — designed for clean exits into permanent or DSCR financing when the file is ready.",
    whoFor: [
      "Investors closing quickly with a defined exit window",
      "Owners bridging to refinance or sale",
      "Operators needing transitional capital without long bank timelines",
    ],
    differentiators: [
      "Structured for transitional hold, not permanent amortization narratives",
      "Processor and lender assignment tracked on every file",
      "Clear handoff path toward permanent or DSCR options when appropriate",
    ],
    processTitle: "Bridge-specific diligence",
    processBody:
      "Bridge files center on exit certainty, timeline, and package completeness — status stays visible at every gate.",
    processPoints: [
      "Define hold period and exit path in the loan details step",
      "Package submission gathers title, insurance, and entity docs",
      "Underwriting and conditions stay auditable in the portal",
    ],
    documents: [
      "Title and ownership context for the subject property",
      "Exit plan summary (sale, refinance, or takeout)",
      "Insurance and entity documents",
      "Payoff statements when refinancing existing debt",
      "Liquidity evidence appropriate to the hold period",
    ],
    faqs: [
      {
        question: "How is a bridge loan different from permanent financing?",
        answer:
          "Bridge credit is built for a transitional hold with a defined exit — sale, refinance, or takeout — rather than long amortization narratives used in permanent mortgages.",
      },
      {
        question: "Can a bridge file move into DSCR later?",
        answer:
          "When the property and guidelines support it, Vault can evaluate a handoff toward rental DSCR or other takeout paths. That is confirmed on the file, not promised as an automatic conversion.",
      },
      {
        question: "What matters most in review?",
        answer:
          "Exit certainty, timeline realism, collateral quality, and a complete package. Status and conditions remain visible in the portal at each gate.",
      },
    ],
    image: images.bridge,
    related: ["private-money", "rehab-fix-flip", "dscr-non-qm"],
  },
  "ground-up": {
    slug: "ground-up",
    href: "/solutions/ground-up",
    name: "Ground-Up Construction",
    eyebrow: "Draw schedule",
    headline: "Draw schedules that follow the build.",
    description:
      "Foundation, framing, and completion milestones with draw requests tied to verified progress — same audited lifecycle from package through funding.",
    whoFor: [
      "Builders and investor-sponsors with defined construction plans",
      "Projects that need milestone-based capital releases",
      "Teams that want draw history retained on the file",
    ],
    differentiators: [
      "Milestone-based draw framing, not a single lump narrative",
      "Progress verification tied to draw requests",
      "Portal visibility for status, docs, and conditions across the build",
    ],
    processTitle: "Construction file rhythm",
    processBody:
      "Ground-up files need plans, budget, and schedule clarity early — draws follow verified progress after clear-to-close.",
    processPoints: [
      "Apply captures project scope, budget, and timeline context",
      "Package includes plans, permits context, and contractor documentation",
      "Draw requests attach to milestones after funding is structured",
    ],
    documents: [
      "Plans, specs, and construction budget",
      "Permit status or municipality context when available",
      "General contractor qualifications and contracts",
      "Entity and insurance packages",
      "Draw schedule outline aligned to major milestones",
    ],
    faqs: [
      {
        question: "Are funds released all at once?",
        answer:
          "Ground-up structures typically advance capital in draws as milestones are verified. Remaining proceeds stay reserved until subsequent conditions are met.",
      },
      {
        question: "What should be ready before Apply?",
        answer:
          "Project scope, budget realism, timeline, and entity readiness. Plans and permit context strengthen the package once the file is in review.",
      },
      {
        question: "Where is draw history kept?",
        answer:
          "Draw requests and supporting documentation attach to the file in the borrower portal so progress and releases remain auditable.",
      },
    ],
    image: images.groundUp,
    related: ["private-money", "rehab-fix-flip", "bridge-loans"],
  },
  "dscr-non-qm": {
    slug: "dscr-non-qm",
    href: "/solutions/dscr-non-qm",
    name: "DSCR & Non-QM",
    eyebrow: "Rental cash flow",
    headline: "Qualify on rental cash flow — not W-2 paperwork alone.",
    description:
      "Debt-service coverage focused underwriting for rentals — built for portfolio investors and non-traditional income when the property cash flow supports the file.",
    whoFor: [
      "Portfolio landlords evaluating rental coverage",
      "Investors with non-traditional income documentation",
      "Borrowers closing in entity or personal name when the file supports it",
    ],
    differentiators: [
      "Qualification emphasis on property cash flow",
      "Structured for investor rentals rather than consumer mortgage framing",
      "Same portal audit trail from application through funding",
    ],
    processTitle: "What DSCR files need",
    processBody:
      "Rent rolls, leases, and property details matter early. Terms stay qualitative on the site; specifics are evaluated deal by deal after Apply.",
    processPoints: [
      "Provide property and rental context in Apply",
      "Upload leases, insurance, and entity docs in the document center",
      "Track underwriting conditions without invented public rate tables",
    ],
    documents: [
      "Current leases or lease abstracts",
      "Rent roll and expense summary for the subject property",
      "Insurance and entity documents",
      "Property details and ownership evidence",
      "Reserve or liquidity evidence when requested",
    ],
    faqs: [
      {
        question: "Does DSCR replace all personal income review?",
        answer:
          "DSCR emphasizes property cash flow versus debt service. Programs still apply guideline checks, reserves, and collateral review — it is not a shortcut around diligence.",
      },
      {
        question: "What is Non-QM in this context?",
        answer:
          "Non-qualified mortgage credit sits outside the QM safe harbor and often allows alternative documentation for investor rentals. It does not remove underwriting or compliance obligations.",
      },
      {
        question: "Will Vault publish a minimum DSCR on the site?",
        answer:
          "No. Coverage thresholds and calculation methods are evaluated on the file. Marketing pages explain the concept without advertising invented cutoffs.",
      },
    ],
    image: images.dscr,
    related: ["private-money", "bridge-loans", "rehab-fix-flip"],
  },
};

export const solutionList = Object.values(solutions);
