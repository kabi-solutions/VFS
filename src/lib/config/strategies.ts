import type { SolutionSlug } from "@/lib/marketing/solutions";

/**
 * Strategy / experience segmentation — secondary nav cuts that land on the right product.
 */

export type StrategySlug = "fix-flip" | "brrrr" | "buy-hold" | "ground-up";
export type ExperienceSlug = "first-project" | "scaling" | "high-volume";

export type StrategySegment = {
  slug: StrategySlug;
  name: string;
  headline: string;
  description: string;
  productHref: string;
  productSlug: SolutionSlug;
  whoNotFor: string;
};

export type ExperienceSegment = {
  slug: ExperienceSlug;
  name: string;
  headline: string;
  description: string;
  framing: string[];
  defaultStrategy: StrategySlug;
};

export const strategies: Record<StrategySlug, StrategySegment> = {
  "fix-flip": {
    slug: "fix-flip",
    name: "Fix & Flip",
    headline: "Buy, renovate, and exit on a defined hold.",
    description:
      "For operators with a clear scope, budget, and resale or refinance exit — purchase plus rehab capital framed around the work plan.",
    productHref: "/solutions/rehab-fix-flip",
    productSlug: "rehab-fix-flip",
    whoNotFor:
      "Not for owner-occupied rehabs, consumer home-improvement loans, or deals without a defined exit.",
  },
  brrrr: {
    slug: "brrrr",
    name: "BRRRR",
    headline: "Acquire, renovate, rent, refinance, repeat.",
    description:
      "Transitional capital into stabilized rental takeout — often bridge or rehab into DSCR when cash flow supports the file.",
    productHref: "/solutions/bridge-loans",
    productSlug: "bridge-loans",
    whoNotFor:
      "Not for long-term consumer mortgages, primary residences, or speculative holds without a refinance or sale path.",
  },
  "buy-hold": {
    slug: "buy-hold",
    name: "Buy & Hold",
    headline: "Qualify on rents when the asset carries the debt.",
    description:
      "Rental investors evaluating DSCR / non-QM structures where property cash flow — not W-2 paperwork alone — frames qualification.",
    productHref: "/solutions/dscr-non-qm",
    productSlug: "dscr-non-qm",
    whoNotFor:
      "Not for owner-occupied purchases, consumer QM mortgages, or assets without realistic rent support.",
  },
  "ground-up": {
    slug: "ground-up",
    name: "Ground-Up Development",
    headline: "Draws that follow verified construction progress.",
    description:
      "Builders and investor-sponsors who need milestone-based capital with plans, budget, and schedule clarity early.",
    productHref: "/solutions/ground-up",
    productSlug: "ground-up",
    whoNotFor:
      "Not for speculative land banking without a build plan, or projects that need a single lump advance without milestones.",
  },
};

export const experiences: Record<ExperienceSlug, ExperienceSegment> = {
  "first-project": {
    slug: "first-project",
    name: "First project",
    headline: "Starting with clarity, not pressure.",
    description:
      "First-time investor sponsors get the same audited lifecycle — with framing that emphasizes package completeness and realistic exits.",
    framing: [
      "Expect more document clarity up front so review can move cleanly",
      "Strategy and exit matter as much as collateral quality",
      "Portal access keeps status and requests in one place",
    ],
    defaultStrategy: "fix-flip",
  },
  scaling: {
    slug: "scaling",
    name: "Scaling",
    headline: "Repeatable process for the next few files.",
    description:
      "Operators adding volume want status without the chase and a portal that survives from deal to deal.",
    framing: [
      "Same gates and plain-language status across files",
      "Document center retains packages for follow-on deals",
      "Structure flexes across rehab, bridge, and rental paths",
    ],
    defaultStrategy: "brrrr",
  },
  "high-volume": {
    slug: "high-volume",
    name: "High volume",
    headline: "Pipeline discipline for active sponsors.",
    description:
      "High-volume operators need gated underwriting, assignment clarity, and an audit trail capital partners can diligence.",
    framing: [
      "Controlled pipeline with processor and escrow assignment",
      "Attribution and status history retained on funded loans",
      "Talk to Vault when volume or partnership structure needs a dedicated path",
    ],
    defaultStrategy: "buy-hold",
  },
};

export const strategyList = Object.values(strategies);
export const experienceList = Object.values(experiences);
