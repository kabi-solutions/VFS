import type { FaqItem } from "@/components/marketing/FaqAccordion";
import { fundingSpeedClaimDetailed } from "@/lib/config/claims";

/**
 * FAQ pattern: lead with the direct answer, then the qualifier.
 * Shared by homepage and Resources / FAQs.
 */
export const homepageFaqs: FaqItem[] = [
  {
    question: "How fast can I get my project funded?",
    answer: fundingSpeedClaimDetailed(),
  },
  {
    question: "How fast can I apply for a loan?",
    answer:
      "Vector by Vault is designed to allow you to apply for project funding in one sitting. Of course, if you need to gather more information your application is automatically saved for you to resume later.",
  },
  {
    question: "How do I know the status of my application?",
    answer:
      "Once your application is submitted, you can track it in real-time from start to finish.",
  },
  {
    question: "What happens if you need more information?",
    answer:
      "No more missed emails, endless back-and-forths, and confusion. Requests for more information are clearly displayed in our app (don’t worry, we also send an email to alert you).",
  },
  {
    question: "What loan products does Vault offer?",
    answer:
      "Private money for acquisition and rehab, fix-and-flip, bridge, ground-up construction with draws, and DSCR / non-QM rental credit. Fit is evaluated against the property, exit, and borrower experience — not a one-size quote sheet.",
  },
  {
    question: "Is Vault the right lender for me?",
    answer:
      "Vault provides loans to real estate investors, entities using investment property as collateral, and consumers purchasing a second home. Vault is not a lender for primary-residence consumer mortgages or MCA/business loans.",
  },
  {
    question: "What documents will I need?",
    answer:
      "Expect identity and entity paperwork, property details, purchase contract or payoff statement, rehab scope or rent roll when relevant, and liquidity evidence. Exact checklists appear in Vector by Vault after you start a file.",
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
    question: "How does Vector by Vault work?",
    answer:
      "Submitting Apply creates portal access tied to your organization and file. Upload documents, respond to info requests, and follow lifecycle status without restarting — the same account stays with you across deals.",
  },
  {
    question: "Can I work with a broker or correspondent?",
    answer:
      "Yes. Files can be originated through approved referral channels. Role-based portal access keeps borrower, broker, and internal staff on the same file trail with audited status history.",
  },
  {
    question: "How do I contact Vault before applying?",
    answer:
      "Use Contact for general inquiries, or give us 2 minutes on the deal screener for a preliminary pre-approval read. When you have a live deal, Apply Now is the fastest path into Vector by Vault.",
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
      "Borrowers use Client Login after Apply creates Vector by Vault access. Use the email and portal password from your Apply confirmation. Brokers use role-scoped access once their organizations are activated.",
  },
];
