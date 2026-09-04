export type GlossaryTerm = {
  term: string;
  definition: string;
};

/** Institutional plain-language lending terms — no invented rates */
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "ARV (After-Repair Value)",
    definition:
      "An estimate of a property’s market value once planned renovations are complete. Used to size rehab and flip financing against the finished asset, not the as-is purchase price alone.",
  },
  {
    term: "As-is value",
    definition:
      "The estimated market value of a property in its current condition, before planned renovations. Often used alongside ARV when sizing acquisition advances.",
  },
  {
    term: "Bridge loan",
    definition:
      "Short-term financing used when ownership is transitional — for example, acquiring before a sale, refinance, or longer-term takeout. Terms emphasize exit timing over permanent amortization.",
  },
  {
    term: "Clear to close",
    definition:
      "The lifecycle gate indicating underwriting conditions are satisfied and the file is ready to proceed toward signing and funding, subject to final closing coordination.",
  },
  {
    term: "DSCR (Debt Service Coverage Ratio)",
    definition:
      "A measure of property cash flow relative to debt service, typically calculated as net operating income divided by annual debt payments. Higher ratios indicate more coverage of loan obligations from rents.",
  },
  {
    term: "Draw",
    definition:
      "A partial release of loan proceeds, usually tied to verified construction or rehab progress against an approved budget. Remaining funds stay held until subsequent draw conditions are met.",
  },
  {
    term: "Exit strategy",
    definition:
      "The planned path to repay transitional debt — commonly sale of the property, refinance into permanent or DSCR credit, or another takeout facility within the hold period.",
  },
  {
    term: "Ground-up construction",
    definition:
      "Financing for new construction from vacant land or a full rebuild. Capital is commonly advanced in draws as milestones are inspected and documented.",
  },
  {
    term: "Hard money",
    definition:
      "Asset-based private lending that emphasizes collateral value, exit strategy, and borrower experience more than traditional consumer credit underwriting. Often shorter term than bank mortgages.",
  },
  {
    term: "Info-requested",
    definition:
      "A file state where the processor or underwriter has asked for missing materials. Vault tags the request to the originating stage so the file can return there after resubmission.",
  },
  {
    term: "LOI (Letter of Intent)",
    definition:
      "A non-binding or lightly binding outline of proposed deal terms exchanged before a full loan commitment. Useful for aligning structure; it is not a guarantee of funding.",
  },
  {
    term: "LTV (Loan-to-Value)",
    definition:
      "The loan amount expressed as a percentage of property value (purchase price, as-is appraisal, or ARV depending on product). Lower LTVs leave more equity cushion for the lender.",
  },
  {
    term: "Non-QM",
    definition:
      "Non-qualified mortgage credit that does not follow the Consumer Financial Protection Bureau’s Qualified Mortgage safe-harbor framework. In investor contexts, often paired with DSCR or alternative documentation.",
  },
  {
    term: "Private money",
    definition:
      "Capital sourced from private lenders or investment vehicles rather than insured depository banks. Structures and diligence can be tailored to investment real estate strategies.",
  },
  {
    term: "PTF (Proof to Fund) / Proof of Funds",
    definition:
      "Documentation showing a buyer or borrower has liquid capital available for down payment, reserves, or closing. Commonly requested before sellers or counterparties proceed.",
  },
  {
    term: "Rehab / Fix & flip",
    definition:
      "A strategy of acquiring a property, renovating it, and selling (or refinancing) for profit. Financing often covers purchase plus construction budget with a defined hold period.",
  },
  {
    term: "Rent roll",
    definition:
      "A schedule of units, tenants, lease terms, and rents for an income property. Used in DSCR and rental underwriting to evidence cash flow.",
  },
  {
    term: "Reserves",
    definition:
      "Liquid capital a borrower is expected to hold after closing to cover debt service, unexpected rehab costs, or vacancy during the hold period. Requirements vary by product and file.",
  },
  {
    term: "Takeout",
    definition:
      "Permanent or longer-term financing that repays a short-term bridge or construction loan at exit. The takeout is the planned refinance or sale that retires transitional debt.",
  },
  {
    term: "Underwriting",
    definition:
      "The review of borrower, property, collateral, and exit to decide whether a loan fits program guidelines and risk appetite. Status gates and conditions are typically recorded in the file trail.",
  },
];
