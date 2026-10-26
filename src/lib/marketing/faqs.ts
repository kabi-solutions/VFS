import type { FaqItem } from "@/components/marketing/FaqAccordion";
import { fundingSpeedClaim } from "@/lib/config/claims";

/**
 * FAQ pattern: lead with the direct answer, then the qualifier.
 * Shared by homepage and Resources / FAQs.
 */
export const homepageFaqs: FaqItem[] = [
  {
    question: "How fast can funding happen?",
    answer: `${fundingSpeedClaim()} Timeline depends on package completeness, diligence, and third parties — never a guaranteed close date.`,
  },
  {
    question: "How fast can I start an application?",
    answer:
      "You can start a file in one sitting: property, borrower, and loan intent in a structured digital flow. On submit, borrower portal access is created so you can return with documents without starting over.",
  },
  {
    question: "Will I know where my file stands?",
    answer:
      "Yes — every file moves through six published gates (application, review, package, underwriting, clear to close, and funding) with plain-language status and retained history. Qualifier: status language is operational, not a credit decision.",
  },
  {
    question: "What if information is missing?",
    answer:
      "The Processor requests what’s needed and the file enters an info-requested state tagged to its stage, then returns there once you resubmit. You do not lose your place in the lifecycle.",
  },
  {
    question: "What loan products does Vault offer?",
    answer:
      "Private money for acquisition and rehab, fix-and-flip, bridge, ground-up construction with draws, and DSCR / non-QM rental credit. Fit is evaluated against the property, exit, and borrower experience — not a one-size quote sheet.",
  },
  {
    question: "Who can apply?",
    answer:
      "Real estate investors and entities using investment property as collateral. Primary-residence consumer mortgages and MCA / small-business working-capital products are outside this set.",
  },
  {
    question: "What documents will I need?",
    answer:
      "Expect identity and entity paperwork, property details, purchase contract or payoff statement, rehab scope or rent roll when relevant, and liquidity evidence. Exact checklists appear in the borrower portal after you start a file.",
  },
  {
    question: "Do you publish rates and LTVs on the site?",
    answer:
      "No. Product pages describe structure and fit. Specific terms are evaluated deal by deal after application so invented rate figures never appear as product advertising.",
  },
  {
    question: "Where does Vault lend?",
    answer:
      "Vault uses a national operating model with priority markets listed under Locations. Formal licensing details live under Trust — request the compliance pack for license-level confirmation rather than assuming coverage from a marketing page.",
  },
  {
    question: "How does the borrower portal work?",
    answer:
      "Submitting Apply creates portal access tied to your organization and file. Upload documents, respond to info requests, and follow lifecycle status without restarting — the same account stays with you across deals.",
  },
  {
    question: "How do capital partners get started?",
    answer:
      "Review Why Partner With Vault and How Deployment Works, then submit a Partner Application. That opens a capital-partner organization record for diligence on a gated, auditable pipeline — a real intake, not a disposable lead form.",
  },
  {
    question: "Can I work with a broker or correspondent?",
    answer:
      "Yes. Files can be originated through approved referral channels. Role-based portal access keeps borrower, broker, and internal staff on the same file trail with audited status history.",
  },
  {
    question: "How do I contact Vault before applying?",
    answer:
      "Use Contact for general inquiries, or Check if your deal fits for a four-field preliminary read. When you have a live deal, Apply Now is the fastest path to a portal record.",
  },
];

/** Resources / FAQs page — homepage set plus deeper coverage */
export const expandedFaqs: FaqItem[] = [
  ...homepageFaqs,
  {
    question: "What is a draw schedule?",
    answer:
      "On rehab and ground-up loans, capital is often released in stages as work is verified. Draws are requested against the approved budget; inspection or documentation gates may apply before funds are released.",
  },
  {
    question: "How is DSCR different from personal income qualification?",
    answer:
      "Debt service coverage ratio (DSCR) weighs property cash flow against debt service. Non-QM / DSCR programs may qualify on rents and expenses rather than full personal W-2 underwriting — subject to product guidelines and deal review. Vault does not publish a minimum DSCR on marketing pages.",
  },
  {
    question: "Is Vault licensed in my state?",
    answer:
      "Coverage varies by market. State landings describe markets Vault prioritizes for investor files. Formal licensing confirmation belongs under Trust — request the compliance pack rather than assuming a license from a marketing page alone.",
  },
  {
    question: "Who logs into Client Login?",
    answer:
      "Borrowers use Client Login after Apply creates portal access. Brokers and capital partners use role-scoped access once their organizations are activated. Marketing pages explain the model; live credentials are issued after your organization is set up.",
  },
];
