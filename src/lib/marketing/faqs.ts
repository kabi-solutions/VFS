import type { FaqItem } from "@/components/marketing/FaqAccordion";

/** Homepage FAQs — shared with Resources / FAQs expansion */
export const homepageFaqs: FaqItem[] = [
  {
    question: "How fast can I start an application?",
    answer:
      "The digital Apply flow is built to capture property, borrower, and loan details in one sitting. When you submit, borrower portal access is created so you can come back with documents later.",
  },
  {
    question: "Will I know where my file stands?",
    answer:
      "Yes. Every file moves through a published lifecycle — application, review, package, underwriting, clear to close, and funding — with status history retained at each gate.",
  },
  {
    question: "What if information is missing?",
    answer:
      "The Processor can request missing information. The file enters an info-requested state tagged to the stage it came from, then returns there once you resubmit.",
  },
  {
    question: "What loan products does Vault offer?",
    answer:
      "Private money and hard-money structures for acquisition and rehab, fix-and-flip, bridge, ground-up construction with draws, and DSCR / non-QM rental credit. Fit is evaluated against the property, exit, and borrower experience — not a one-size quote sheet.",
  },
  {
    question: "Who can apply?",
    answer:
      "Real estate investors and entities using investment property as collateral. Primary-residence consumer mortgages are outside this product set. Entity borrowers, experienced flippers, and rental operators are typical applicants.",
  },
  {
    question: "What documents will I need?",
    answer:
      "Expect identity and entity paperwork, property details, purchase contract or payoff statement, rehab scope or rent roll when relevant, and liquidity evidence. Exact checklists appear in the borrower portal after you start an application.",
  },
  {
    question: "Do you publish rates and LTVs on the site?",
    answer:
      "No. Product pages describe structure and fit. Specific terms are evaluated deal by deal after application so invented rate figures never slip into production copy.",
  },
  {
    question: "Where does Vault lend?",
    answer:
      "Vault uses a national operating model with state-specific coverage. Starter markets and the state landing template are listed under Locations; licensing disclosures live under Trust. A state page alone does not prove every license is in place.",
  },
  {
    question: "How does the borrower portal work?",
    answer:
      "Submitting Apply creates portal access tied to your organization and file. You can upload documents, respond to info requests, and follow lifecycle status without restarting the application from scratch.",
  },
  {
    question: "How do capital partners get started?",
    answer:
      "Review Why Partner With Vault and How Deployment Works, then submit a Partner Application. That creates a pending capital-partner organization record for diligence — not a disposable lead form.",
  },
  {
    question: "Can I work with a broker or correspondent?",
    answer:
      "Yes. Files can be originated through approved referral channels. Role-based portal access keeps borrower, broker, and internal staff on the same file trail with audited status history.",
  },
  {
    question: "How do I contact Vault before applying?",
    answer:
      "Use the Contact page for general inquiries. For a live file, Apply is the fastest path — it creates the portal record your team will use for follow-up.",
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
      "Debt service coverage ratio (DSCR) weighs property cash flow against debt service. Non-QM / DSCR programs may qualify on rents and expenses rather than full personal W-2 underwriting — subject to product guidelines and deal review.",
  },
  {
    question: "Is Vault licensed in my state?",
    answer:
      "Coverage varies by market. Starter state landings describe markets we prioritize; formal licensing and disclosure language belongs under Trust and will be updated when counsel supplies final copy. Do not assume a license exists solely because a state page is listed.",
  },
  {
    question: "Who logs into Client Login?",
    answer:
      "Borrowers use login after Apply creates portal access. Brokers and capital partners use role-scoped access once their organizations are set up. Marketing pages explain the model; authentication is mocked until full auth ships.",
  },
];
