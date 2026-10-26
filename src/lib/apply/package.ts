import type { LoanType } from "@/lib/types/database";

export type MaritalStatus = "married" | "unmarried" | "separated";
export type PropertyTypeCode = "sfr" | "condo" | "pud" | "units_2_4" | "units_5_plus";
export type OccupancyStatus = "leased" | "vacant";
export type EstateHeld = "fee_simple" | "leasehold";
export type ConstructionMethod = "site_built" | "manufactured";
export type TransactionType = "purchase" | "rate_term_refinance" | "cash_out_refinance";
export type LoanTermYears = "1" | "2";
export type VestingType = "llc" | "corp" | "trust" | "llp" | "individual" | "other";
export type PropertyPlan = "flip" | "rental" | "bridge";
export type ExitStrategy = "sell" | "refinance" | "other";
export type TrackProjectStatus = "current" | "complete" | "active";
export type TrackProjectType = "fix_flip" | "fix_hold" | "ground_up";
export type ContractorBusinessType =
  | "sole_proprietor"
  | "partnership"
  | "corporation"
  | "limited_liability";
/** Owner-builder and GC are mutually exclusive roles on the Vault F-008 form. */
export type ContractorRole = "owner_builder" | "general_contractor";
export type ConstructionLevel = "1" | "2" | "3" | "4" | "5";
export type FinishLevel = "basic" | "mid_range" | "high_end";

export type ContactBlock = {
  name: string;
  company: string;
  phone: string;
  email: string;
  relationship?: string;
};

export type EmploymentInfo = {
  self_employed: boolean | null;
  employer_name: string;
  position_title: string;
  employer_phone: string;
  employer_address: string;
};

export type BorrowerParty = {
  first_name: string;
  middle_name: string;
  last_name: string;
  marital_status: MaritalStatus | "";
  primary_residence_address: string;
  owns_primary_residence: boolean | null;
  years_at_primary_residence: string;
  mailing_address: string;
  mailing_same_as_primary: boolean;
  estimated_credit_score: string;
  estimated_annual_income: string;
  estimated_liquid_assets: string;
  cell_phone: string;
  secondary_phone: string;
  email: string;
  employment: EmploymentInfo;
  // TODO(apply-later): collect borrower/co-borrower SSN + DOB in Apply when
  // compliance-ready; not collected in the public Apply UI yet.
};

/** Loan Submission Package declarations / questionnaire. */
export type DeclarationAnswers = {
  outstanding_judgments: boolean | null;
  bankrupt_last_7_years: boolean | null;
  foreclosure_history: boolean | null;
  party_to_lawsuit: boolean | null;
  delinquent_federal_debt: boolean | null;
  felony_conviction: boolean | null;
  civil_union_or_non_borrowing_spouse: boolean | null;
  us_citizen: boolean | null;
  permanent_resident_alien: boolean | null;
  intend_occupy_primary: boolean | null;
};

export type SubjectPropertyInfo = {
  address: string;
  city: string;
  state: string;
  postal: string;
  property_type: PropertyTypeCode | "";
  number_of_units: string;
  occupancy: OccupancyStatus | "";
  estate_held: EstateHeld | "";
  construction_method: ConstructionMethod | "";
  cross_collateralization: boolean | null;
  cross_collateral_property_count: string;
};

export type LoanRequestInfo = {
  transaction_type: TransactionType | "";
  loan_amount: string;
  loan_term_years: LoanTermYears | "";
  purchase_price: string;
  estimated_property_value: string;
  requesting_rehab_financing: boolean | null;
  requesting_ground_up: boolean | null;
  budget_amount: string;
  estimated_arv: string;
  refinance_current_debt: string;
  refinance_original_cost: string;
  refinance_year_acquired: string;
  refinance_as_is_value: string;
  refinance_rehab_completed: string;
  refinance_rehab_to_complete: string;
};

export type VestingInfo = {
  vesting_in: "entity" | "individual" | "";
  entity_name: string;
  entity_type: VestingType | "";
  entity_state: string;
  ein: string;
};

export type StrategyInfo = {
  plan_for_property: PropertyPlan | "";
  anticipated_hold_months: string;
  projected_monthly_rent: string;
  plan_increase_rents: boolean | null;
  future_monthly_rent: string;
  rehab_or_upgrade: boolean | null;
  estimated_rehab_cost: string;
  estimated_arv: string;
  adding_square_footage: boolean | null;
  added_square_footage: string;
  expands_structure_50_percent: boolean | null;
  rehab_budget_attached: boolean | null;
  work_already_begun: boolean | null;
  scope_of_work: string;
  investment_strategy: string;
  exit_strategy: ExitStrategy | "";
  exit_strategy_detail: string;
  cash_out_proceeds_use: string;
};

export type TrackRecordRow = {
  status: TrackProjectStatus | "";
  project_type: TrackProjectType | "";
  titled_owner: string;
  property_address: string;
  city: string;
  state: string;
  zip: string;
  purchase_date: string;
  purchase_price: string;
  renovation_costs: string;
  disposition_date: string;
  disposition_price: string;
};

export type SreoPropertyRow = {
  street_number: string;
  street_name: string;
  unit_count: string;
  unit_apt: string;
  city: string;
  state: string;
  zip: string;
  entity_name_on_title: string;
  ownership_percent: string;
  investment_type: string;
  property_type: string;
  units_occupied: string;
  lease_start: string;
  lease_end: string;
  purchase_date: string;
  purchase_price: string;
  capital_improvements: string;
  estimated_as_is_value: string;
  total_debt_payoff: string;
  monthly_gross_rent: string;
  other_monthly_income: string;
  annual_property_mgmt_fee: string;
  annual_taxes: string;
  annual_insurance: string;
  annual_hoa: string;
  annual_capex: string;
  annual_vacancy_cost: string;
  other_annual_owner_expenses: string;
  annual_utilities: string;
  annual_repair_maintenance: string;
};

export type ContractorOwnership = {
  name: string;
  ownership_percent: string;
};

export type ContractorReference = {
  company: string;
  contact_person: string;
  phone: string;
  type: string;
};

export type ContractorClientReference = {
  name: string;
  phone: string;
  street_address: string;
  new_or_reno: string;
  contract_amount: string;
};

export type ContractorSalesHistory = {
  year: string;
  yearly_gross_sales: string;
  yearly_projects_completed: string;
  type_of_projects: string;
};

export type ContractorCompletedProject = {
  year: string;
  status: string;
  project_address: string;
  project_cost: string;
  project_scope: string;
};

export type ConstructionBudgetLine = {
  line_item: string;
  budget_amount: string;
  description: string;
};

export type ConstructionBudgetPackage = {
  construction_level: ConstructionLevel | "";
  finish_level: FinishLevel | "";
  renovation_description: string;
  project_duration_months: string;
  permits_required: boolean | null;
  permits_issued: boolean | null;
  permits_obtain_months: string;
  adding_square_footage: boolean | null;
  expansion_type: string;
  line_items: ConstructionBudgetLine[];
};

export type ContractorPackage = {
  role: ContractorRole | "";
  owner_builder_name: string;
  owner_builder_street: string;
  owner_builder_city_state_zip: string;
  planned_project_levels: ConstructionLevel[];
  business_entity_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  business_type: ContractorBusinessType | "";
  owners: ContractorOwnership[];
  phone: string;
  fax: string;
  email: string;
  tin_ssn: string;
  years_in_business: string;
  sales_history: ContractorSalesHistory[];
  completed_projects: ContractorCompletedProject[];
  no_contractor_license: boolean;
  has_employees: boolean | null;
  license_state: string;
  license_number: string;
  license_issue_date: string;
  license_expiration_date: string;
  license_type: string;
  license_status: string;
  supplier_references: ContractorReference[];
  client_references: ContractorClientReference[];
  release_authorized: boolean;
  release_print_name: string;
  release_title: string;
  release_date: string;
  project_name: string;
  project_secondary_contact_name: string;
  project_secondary_contact_email: string;
  project_secondary_contact_phone: string;
  final_budget: string;
};

export type ApplicationPackage = {
  version: 1;
  borrower: BorrowerParty;
  has_co_borrower: boolean;
  co_borrower: BorrowerParty | null;
  business_purpose_attested: boolean;
  ecoa_appraisal_acknowledged: boolean;
  credit_authorization_acknowledged: boolean;
  declarations: DeclarationAnswers;
  subject_property: SubjectPropertyInfo;
  loan_request: LoanRequestInfo;
  vesting: VestingInfo;
  interior_access: ContactBlock;
  escrow_title: ContactBlock;
  insurance: ContactBlock;
  strategy: StrategyInfo;
  track_record: TrackRecordRow[];
  sreo: SreoPropertyRow[];
  construction_budget: ConstructionBudgetPackage | null;
  contractor: ContractorPackage | null;
  notes: string;
};

export type CompletenessItem = {
  id: string;
  section: string;
  label: string;
  severity: "required_for_package" | "recommended";
};

function filled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "boolean") return true;
  if (typeof value === "number") return !Number.isNaN(value);
  return String(value).trim().length > 0;
}

function partyMissing(prefix: string, section: string, party: BorrowerParty | null | undefined): CompletenessItem[] {
  if (!party) {
    return [{ id: `${prefix}.missing`, section, label: `${section} details`, severity: "required_for_package" }];
  }
  const items: CompletenessItem[] = [];
  const need: Array<[keyof BorrowerParty | string, string]> = [
    ["first_name", "First name"],
    ["last_name", "Last name"],
    ["marital_status", "Marital status"],
    ["primary_residence_address", "Primary residence address"],
    ["owns_primary_residence", "Owns primary residence"],
    ["years_at_primary_residence", "Years at primary residence"],
    ["estimated_credit_score", "Estimated credit score"],
    ["estimated_annual_income", "Estimated annual income"],
    ["estimated_liquid_assets", "Estimated liquid assets"],
    ["cell_phone", "Cell phone"],
    ["email", "Email"],
  ];
  for (const [key, label] of need) {
    const value = (party as Record<string, unknown>)[key as string];
    if (!filled(value)) {
      items.push({ id: `${prefix}.${key}`, section, label, severity: "required_for_package" });
    }
  }
  if (!party.mailing_same_as_primary && !filled(party.mailing_address)) {
    items.push({
      id: `${prefix}.mailing_address`,
      section,
      label: "Mailing address",
      severity: "required_for_package",
    });
  }
  const emp = party.employment;
  if (emp.self_employed === null) {
    items.push({
      id: `${prefix}.self_employed`,
      section,
      label: "Self-employed?",
      severity: "required_for_package",
    });
  }
  if (!filled(emp.employer_name)) {
    items.push({
      id: `${prefix}.employer_name`,
      section,
      label: "Employer name",
      severity: "required_for_package",
    });
  }
  if (!filled(emp.position_title)) {
    items.push({
      id: `${prefix}.position_title`,
      section,
      label: "Position / title",
      severity: "required_for_package",
    });
  }
  if (!filled(emp.employer_phone)) {
    items.push({
      id: `${prefix}.employer_phone`,
      section,
      label: "Employer phone",
      severity: "required_for_package",
    });
  }
  if (!filled(emp.employer_address)) {
    items.push({
      id: `${prefix}.employer_address`,
      section,
      label: "Employer address",
      severity: "required_for_package",
    });
  }
  return items;
}

function contactMissing(id: string, section: string, contact: ContactBlock, withRelationship = false): CompletenessItem[] {
  const items: CompletenessItem[] = [];
  if (!filled(contact.name)) items.push({ id: `${id}.name`, section, label: `${section}: name`, severity: "required_for_package" });
  if (!filled(contact.phone)) items.push({ id: `${id}.phone`, section, label: `${section}: phone`, severity: "required_for_package" });
  if (!filled(contact.email)) items.push({ id: `${id}.email`, section, label: `${section}: email`, severity: "required_for_package" });
  if (!withRelationship && !filled(contact.company)) {
    items.push({ id: `${id}.company`, section, label: `${section}: company`, severity: "required_for_package" });
  }
  if (withRelationship && !filled(contact.relationship)) {
    items.push({
      id: `${id}.relationship`,
      section,
      label: `${section}: relationship`,
      severity: "required_for_package",
    });
  }
  return items;
}

function trackRowComplete(row: TrackRecordRow): boolean {
  return (
    filled(row.status) &&
    filled(row.project_type) &&
    filled(row.titled_owner) &&
    filled(row.property_address) &&
    filled(row.city) &&
    filled(row.state) &&
    filled(row.zip) &&
    filled(row.purchase_date) &&
    filled(row.purchase_price) &&
    filled(row.renovation_costs)
  );
}

function sreoRowComplete(row: SreoPropertyRow): boolean {
  return (
    filled(row.street_number) &&
    filled(row.street_name) &&
    filled(row.city) &&
    filled(row.state) &&
    filled(row.zip) &&
    filled(row.property_type) &&
    filled(row.purchase_price) &&
    filled(row.estimated_as_is_value) &&
    filled(row.monthly_gross_rent)
  );
}

/** Soft package requirements — submit is still allowed with gaps. */
export function getPackageCompleteness(
  pkg: ApplicationPackage | null | undefined,
  loanType: LoanType,
  docTypes: string[] = [],
): { missing: CompletenessItem[]; completeCount: number; totalCount: number; percent: number } {
  const missing: CompletenessItem[] = [];
  if (!pkg) {
    return {
      missing: [
        {
          id: "package",
          section: "Package",
          label: "Full borrower package",
          severity: "required_for_package",
        },
      ],
      completeCount: 0,
      totalCount: 1,
      percent: 0,
    };
  }

  missing.push(...partyMissing("borrower", "Borrower", pkg.borrower));
  if (pkg.has_co_borrower) {
    missing.push(...partyMissing("co_borrower", "Co-borrower", pkg.co_borrower));
  }
  if (!pkg.business_purpose_attested) {
    missing.push({
      id: "business_purpose",
      section: "Attestation",
      label: "Non-owner-occupied / business-purpose confirmation",
      severity: "required_for_package",
    });
  }
  if (!pkg.ecoa_appraisal_acknowledged) {
    missing.push({
      id: "ecoa_appraisal",
      section: "Attestation",
      label: "ECOA notice of right to copy of appraisal",
      severity: "required_for_package",
    });
  }
  if (!pkg.credit_authorization_acknowledged) {
    missing.push({
      id: "credit_authorization",
      section: "Attestation",
      label: "Credit & background check authorization",
      severity: "required_for_package",
    });
  }

  const declarations = pkg.declarations ?? emptyDeclarations();
  const declarationLabels: Array<[keyof DeclarationAnswers, string]> = [
    ["outstanding_judgments", "Outstanding judgments?"],
    ["bankrupt_last_7_years", "Bankruptcy in last 7 years?"],
    ["foreclosure_history", "Foreclosure history?"],
    ["party_to_lawsuit", "Party to a lawsuit?"],
    ["delinquent_federal_debt", "Delinquent on federal debt / obligations?"],
    ["felony_conviction", "Felony conviction?"],
    ["civil_union_or_non_borrowing_spouse", "Civil union / non-borrowing spouse / DBA?"],
    ["us_citizen", "US citizen?"],
    ["permanent_resident_alien", "Permanent resident alien?"],
    ["intend_occupy_primary", "Intend to occupy as primary residence?"],
  ];
  for (const [key, label] of declarationLabels) {
    if (declarations[key] === null) {
      missing.push({
        id: `declarations.${key}`,
        section: "Declarations",
        label,
        severity: "required_for_package",
      });
    }
  }
  if (declarations.intend_occupy_primary === true) {
    missing.push({
      id: "declarations.occupy_conflict",
      section: "Declarations",
      label: "Investor loans require non-owner occupancy (answered Yes to occupy)",
      severity: "required_for_package",
    });
  }

  const sp = pkg.subject_property;
  for (const [key, label] of [
    ["address", "Subject property address"],
    ["city", "Subject city"],
    ["state", "Subject state"],
    ["postal", "Subject postal code"],
    ["property_type", "Property type"],
    ["number_of_units", "Number of units"],
    ["occupancy", "Occupancy"],
    ["estate_held", "Estate held in"],
    ["construction_method", "Construction method"],
  ] as const) {
    if (!filled(sp[key])) {
      missing.push({ id: `subject.${key}`, section: "Subject property", label, severity: "required_for_package" });
    }
  }
  if (sp.cross_collateralization === null) {
    missing.push({
      id: "subject.cross_collateralization",
      section: "Subject property",
      label: "Cross collateralization",
      severity: "required_for_package",
    });
  } else if (sp.cross_collateralization && !filled(sp.cross_collateral_property_count)) {
    missing.push({
      id: "subject.cross_count",
      section: "Subject property",
      label: "Cross-collateral property count",
      severity: "required_for_package",
    });
  }

  const lr = pkg.loan_request;
  for (const [key, label] of [
    ["transaction_type", "Transaction type"],
    ["loan_amount", "Loan amount"],
    ["loan_term_years", "Loan term"],
    ["purchase_price", "Purchase price"],
    ["estimated_property_value", "Estimated property value"],
  ] as const) {
    if (!filled(lr[key])) {
      missing.push({ id: `loan.${key}`, section: "Loan request", label, severity: "required_for_package" });
    }
  }
  if (lr.requesting_rehab_financing === null) {
    missing.push({
      id: "loan.rehab",
      section: "Loan request",
      label: "Requesting rehab financing?",
      severity: "required_for_package",
    });
  }
  if (lr.requesting_ground_up === null) {
    missing.push({
      id: "loan.ground_up",
      section: "Loan request",
      label: "Ground up?",
      severity: "required_for_package",
    });
  }
  if (lr.requesting_rehab_financing || lr.requesting_ground_up) {
    if (!filled(lr.budget_amount)) {
      missing.push({
        id: "loan.budget",
        section: "Loan request",
        label: "Budget amount",
        severity: "required_for_package",
      });
    }
    if (!filled(lr.estimated_arv)) {
      missing.push({
        id: "loan.arv",
        section: "Loan request",
        label: "Estimated ARV",
        severity: "required_for_package",
      });
    }
  }
  if (lr.transaction_type === "rate_term_refinance" || lr.transaction_type === "cash_out_refinance") {
    for (const [key, label] of [
      ["refinance_current_debt", "Current debt on property"],
      ["refinance_original_cost", "Original cost"],
      ["refinance_year_acquired", "Year acquired"],
      ["refinance_as_is_value", "As-is value"],
      ["refinance_rehab_completed", "Rehab already completed"],
      ["refinance_rehab_to_complete", "Rehab to complete"],
    ] as const) {
      if (!filled(lr[key])) {
        missing.push({ id: `loan.${key}`, section: "Loan request", label, severity: "required_for_package" });
      }
    }
  }

  if (!filled(pkg.vesting.vesting_in)) {
    missing.push({
      id: "vesting.in",
      section: "Vesting",
      label: "Vesting in entity or individual",
      severity: "required_for_package",
    });
  } else if (pkg.vesting.vesting_in === "entity") {
    for (const [key, label] of [
      ["entity_name", "Entity name"],
      ["entity_type", "Entity type"],
      ["entity_state", "Entity state"],
      ["ein", "EIN"],
    ] as const) {
      if (!filled(pkg.vesting[key])) {
        missing.push({ id: `vesting.${key}`, section: "Vesting", label, severity: "required_for_package" });
      }
    }
  }

  missing.push(...contactMissing("interior", "Interior access", pkg.interior_access, true));
  missing.push(...contactMissing("escrow", "Escrow / title", pkg.escrow_title));
  missing.push(...contactMissing("insurance", "Insurance", pkg.insurance));

  const st = pkg.strategy;
  for (const [key, label] of [
    ["plan_for_property", "Plan for property"],
    ["anticipated_hold_months", "Anticipated hold time"],
    ["investment_strategy", "Investment strategy"],
    ["exit_strategy", "Exit strategy"],
    ["exit_strategy_detail", "Plan to repay this loan"],
  ] as const) {
    if (!filled(st[key])) {
      missing.push({ id: `strategy.${key}`, section: "Strategy", label, severity: "required_for_package" });
    }
  }
  if (st.rehab_or_upgrade === null) {
    missing.push({
      id: "strategy.rehab_or_upgrade",
      section: "Strategy",
      label: "Rehab or upgrade?",
      severity: "required_for_package",
    });
  }
  if (st.rehab_or_upgrade) {
    if (!filled(st.estimated_rehab_cost)) {
      missing.push({
        id: "strategy.rehab_cost",
        section: "Strategy",
        label: "Estimated rehab / construction cost",
        severity: "required_for_package",
      });
    }
    if (!filled(st.estimated_arv)) {
      missing.push({
        id: "strategy.arv",
        section: "Strategy",
        label: "Strategy estimated ARV",
        severity: "required_for_package",
      });
    }
    if (!filled(st.scope_of_work)) {
      missing.push({
        id: "strategy.scope_of_work",
        section: "Strategy",
        label: "Scope of work",
        severity: "required_for_package",
      });
    }
    if (st.adding_square_footage === null) {
      missing.push({
        id: "strategy.adding_sqft",
        section: "Strategy",
        label: "Adding square footage?",
        severity: "required_for_package",
      });
    }
    if (st.adding_square_footage && !filled(st.added_square_footage)) {
      missing.push({
        id: "strategy.added_sqft",
        section: "Strategy",
        label: "Added square footage amount",
        severity: "required_for_package",
      });
    }
    if (st.expands_structure_50_percent === null) {
      missing.push({
        id: "strategy.expand_50",
        section: "Strategy",
        label: "Expanding existing structure by 50%+?",
        severity: "required_for_package",
      });
    }
    if (st.work_already_begun === null) {
      missing.push({
        id: "strategy.work_begun",
        section: "Strategy",
        label: "Has work already begun?",
        severity: "required_for_package",
      });
    }
  }
  if (st.plan_for_property === "rental") {
    if (!filled(st.projected_monthly_rent)) {
      missing.push({
        id: "strategy.rent",
        section: "Strategy",
        label: "Projected monthly rental income",
        severity: "required_for_package",
      });
    }
    if (st.plan_increase_rents === null) {
      missing.push({
        id: "strategy.increase_rents",
        section: "Strategy",
        label: "Plan to increase rents?",
        severity: "required_for_package",
      });
    }
    if (st.plan_increase_rents && !filled(st.future_monthly_rent)) {
      missing.push({
        id: "strategy.future_rent",
        section: "Strategy",
        label: "Future monthly rent",
        severity: "required_for_package",
      });
    }
  }
  if (lr.transaction_type === "cash_out_refinance" && !filled(st.cash_out_proceeds_use)) {
    missing.push({
      id: "strategy.cash_out",
      section: "Strategy",
      label: "Cash-out proceeds use",
      severity: "required_for_package",
    });
  }

  const needsTrack =
    loanType === "private_money" ||
    loanType === "bridge" ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction" ||
    loanType === "dscr_non_qm";
  const needsSreo =
    loanType === "private_money" ||
    loanType === "bridge" ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction" ||
    loanType === "dscr_non_qm" ||
    sp.cross_collateralization === true;

  if (needsTrack) {
    const completeRows = pkg.track_record.filter(trackRowComplete);
    if (completeRows.length < 1) {
      missing.push({
        id: "track_record",
        section: "Track record",
        label: "At least one complete track-record project (last 24 months)",
        severity: "required_for_package",
      });
    }
  }
  if (needsSreo) {
    const completeRows = pkg.sreo.filter(sreoRowComplete);
    const minRows =
      sp.cross_collateralization && filled(sp.cross_collateral_property_count)
        ? Math.max(1, Number(sp.cross_collateral_property_count) || 1)
        : 1;
    if (completeRows.length < minRows) {
      missing.push({
        id: "sreo",
        section: "SREO",
        label:
          minRows > 1
            ? `SREO schedule with at least ${minRows} complete properties`
            : "At least one complete SREO property row",
        severity: "required_for_package",
      });
    }
  }

  const needsConstructionBudget = needsConstructionBudgetPackage(
    loanType,
    lr.requesting_rehab_financing,
    lr.requesting_ground_up,
    st.rehab_or_upgrade,
  );
  if (needsConstructionBudget) {
    const budget = pkg.construction_budget;
    if (!budget || !filled(budget.construction_level)) {
      missing.push({
        id: "construction.level",
        section: "Construction budget",
        label: "Construction level (1–5)",
        severity: "required_for_package",
      });
    }
    if (!budget || !filled(budget.finish_level)) {
      missing.push({
        id: "construction.finish",
        section: "Construction budget",
        label: "Finish level",
        severity: "required_for_package",
      });
    }
    if (!budget || !filled(budget.renovation_description)) {
      missing.push({
        id: "construction.description",
        section: "Construction budget",
        label: "Renovation / scope description",
        severity: "required_for_package",
      });
    }
    const hasBudgetLines =
      budget?.line_items.some((line) => {
        const amount = Number(String(line.budget_amount).replace(/,/g, ""));
        return filled(line.line_item) && !Number.isNaN(amount) && amount > 0;
      }) ?? false;
    const hasBudgetDoc =
      docTypes.includes("construction_budget") ||
      docTypes.includes("rehab_budget") ||
      st.rehab_budget_attached === true;
    if (!hasBudgetLines && !hasBudgetDoc) {
      missing.push({
        id: "construction.budget_items",
        section: "Construction budget",
        label: "Itemized construction budget (in-form lines or Excel / PDF upload)",
        severity: "required_for_package",
      });
    }
  }

  const needsContractor = needsContractorPackage(loanType, lr.requesting_rehab_financing);
  if (needsContractor) {
    const c = pkg.contractor;
    if (!c || !filled(c.role)) {
      missing.push({
        id: "contractor.role",
        section: "Owner-builder / GC",
        label: "Owner-builder or general contractor role",
        severity: "required_for_package",
      });
    } else if (c.role === "owner_builder") {
      if (!filled(c.owner_builder_name) || !filled(c.owner_builder_street)) {
        missing.push({
          id: "contractor.owner_builder",
          section: "Owner-builder / GC",
          label: "Owner-builder name and address",
          severity: "required_for_package",
        });
      }
      if (!c.planned_project_levels.length) {
        missing.push({
          id: "contractor.project_levels",
          section: "Owner-builder / GC",
          label: "Planned project levels (next 24 months)",
          severity: "required_for_package",
        });
      }
    } else if (c.role === "general_contractor") {
      if (!filled(c.business_entity_name) || !filled(c.phone) || !filled(c.email)) {
        missing.push({
          id: "contractor.gc_profile",
          section: "Owner-builder / GC",
          label: "General contractor business profile (name, phone, email)",
          severity: "required_for_package",
        });
      }
    }
    if (!c?.release_authorized) {
      missing.push({
        id: "contractor.release",
        section: "Owner-builder / GC",
        label: "Release authorization",
        severity: "required_for_package",
      });
    }
    if (c && !c.no_contractor_license) {
      if (!filled(c.license_state) || !filled(c.license_number)) {
        missing.push({
          id: "contractor.license",
          section: "Owner-builder / GC",
          label: "Contractor license state and number (or mark unlicensed)",
          severity: "required_for_package",
        });
      }
    }
    for (const doc of contractorDocRequirements(c)) {
      if (!docTypes.includes(doc)) {
        missing.push({
          id: `doc.${doc}`,
          section: "Documents",
          label: doc.replaceAll("_", " "),
          severity: "required_for_package",
        });
      }
    }
    if (c?.role === "owner_builder") {
      const hasGl =
        docTypes.includes("commercial_gl_insurance") ||
        docTypes.includes("personal_liability_insurance");
      if (!hasGl) {
        missing.push({
          id: "doc.owner_builder_liability",
          section: "Documents",
          label: "Commercial GL or personal liability insurance (owner-builder)",
          severity: "required_for_package",
        });
      }
    }
  }

  const coreDocs: Array<{ id: string; label: string; needed: boolean }> = [
    { id: "bank_statements", label: "Bank statements (2 months)", needed: true },
    { id: "photo_id", label: "Photo ID", needed: true },
    {
      id: "entity_docs",
      label: "Entity docs (articles / operating agreement)",
      needed: pkg.vesting.vesting_in === "entity",
    },
    {
      id: "purchase_contract",
      label: "Fully executed purchase contract",
      needed: lr.transaction_type === "purchase",
    },
    {
      id: "payoff_statement",
      label: "Payoff demand or mortgage statement",
      needed:
        lr.transaction_type === "rate_term_refinance" ||
        lr.transaction_type === "cash_out_refinance",
    },
    {
      id: "lease_agreement",
      label: "Lease agreement(s)",
      needed: sp.occupancy === "leased",
    },
  ];
  for (const doc of coreDocs) {
    if (doc.needed && !docTypes.includes(doc.id)) {
      missing.push({
        id: `doc.${doc.id}`,
        section: "Documents",
        label: doc.label,
        severity: "required_for_package",
      });
    }
  }

  const totalCount = missing.length + 40;
  const completeCount = Math.max(0, totalCount - missing.length);
  const percent = Math.round((completeCount / totalCount) * 100);

  return { missing, completeCount, totalCount, percent };
}

/**
 * Ground-up-class loan type forcing.
 *
 * Triggers (any):
 * - Owner-Builder Level 5 on F-008 (`planned_project_levels` includes "5")
 * - Construction Budget Level 5 (`construction_level === "5"`)
 * - 50%+ structure expansion (`expands_structure_50_percent`)
 * - Explicit ground-up request (`requesting_ground_up`)
 *
 * Product mapping: if already on `new_construction` (true new-build product
 * language), keep it; otherwise force `ground_up`. Returns null when no
 * trigger applies.
 */
export function resolveForcedGroundUpLoanType(
  current: LoanType,
  pkg: Pick<
    ApplicationPackage,
    "strategy" | "loan_request" | "construction_budget" | "contractor"
  >,
): LoanType | null {
  const level5 =
    pkg.construction_budget?.construction_level === "5" ||
    (pkg.contractor?.planned_project_levels.includes("5") ?? false);
  const expandOrGu =
    pkg.strategy.expands_structure_50_percent === true ||
    pkg.loan_request.requesting_ground_up === true;
  if (!level5 && !expandOrGu) return null;
  if (current === "new_construction" || current === "ground_up") return current;
  return "ground_up";
}

/** Sync `requesting_ground_up` when Level 5 or 50%+ expansion implies ground-up. */
export function applyGroundUpLoanRequestFlags(pkg: ApplicationPackage): ApplicationPackage {
  const level5 =
    pkg.construction_budget?.construction_level === "5" ||
    (pkg.contractor?.planned_project_levels.includes("5") ?? false);
  const expand = pkg.strategy.expands_structure_50_percent === true;
  if (!level5 && !expand) return pkg;
  if (pkg.loan_request.requesting_ground_up === true) return pkg;
  return {
    ...pkg,
    loan_request: { ...pkg.loan_request, requesting_ground_up: true },
  };
}

export function groundUpForceReason(
  pkg: Pick<
    ApplicationPackage,
    "strategy" | "loan_request" | "construction_budget" | "contractor"
  >,
): string | null {
  if (pkg.contractor?.planned_project_levels.includes("5")) {
    return "Owner-Builder Level 5 (ground-up) requires Ground-Up Construction or New Construction.";
  }
  if (pkg.construction_budget?.construction_level === "5") {
    return "Construction Budget Level 5 (ground-up) requires Ground-Up Construction or New Construction.";
  }
  if (pkg.strategy.expands_structure_50_percent === true) {
    return "50%+ structure expansion is treated as ground up — loan type set to Ground-Up Construction (or keep New Construction).";
  }
  if (pkg.loan_request.requesting_ground_up === true) {
    return "Ground-up financing selected — loan type set to Ground-Up Construction (or keep New Construction).";
  }
  return null;
}

export function needsContractorPackage(
  loanType: LoanType | string,
  requestingRehab: boolean | null,
): boolean {
  return (
    requestingRehab === true ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction"
  );
}

export function needsConstructionBudgetPackage(
  loanType: LoanType | string,
  requestingRehab: boolean | null,
  requestingGroundUp: boolean | null,
  rehabOrUpgrade: boolean | null,
): boolean {
  return (
    requestingRehab === true ||
    requestingGroundUp === true ||
    rehabOrUpgrade === true ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction"
  );
}

export function contractorDocRequirements(
  contractor: ContractorPackage | null | undefined,
): string[] {
  if (!contractor?.role) return [];
  const docs: string[] = [];
  if (!contractor.no_contractor_license) docs.push("contractor_license");
  if (contractor.role === "general_contractor") {
    docs.push("commercial_gl_insurance", "contractor_drivers_license", "contractor_w9");
    if (contractor.has_employees === true) docs.push("workers_comp_insurance");
  } else if (contractor.has_employees === true) {
    docs.push("workers_comp_insurance");
  }
  return docs;
}

export function emptyEmployment(): EmploymentInfo {
  return {
    self_employed: null,
    employer_name: "",
    position_title: "",
    employer_phone: "",
    employer_address: "",
  };
}

export function emptyBorrowerParty(): BorrowerParty {
  return {
    first_name: "",
    middle_name: "",
    last_name: "",
    marital_status: "",
    primary_residence_address: "",
    owns_primary_residence: null,
    years_at_primary_residence: "",
    mailing_address: "",
    mailing_same_as_primary: true,
    estimated_credit_score: "",
    estimated_annual_income: "",
    estimated_liquid_assets: "",
    cell_phone: "",
    secondary_phone: "",
    email: "",
    employment: emptyEmployment(),
  };
}

export function emptyDeclarations(): DeclarationAnswers {
  return {
    outstanding_judgments: null,
    bankrupt_last_7_years: null,
    foreclosure_history: null,
    party_to_lawsuit: null,
    delinquent_federal_debt: null,
    felony_conviction: null,
    civil_union_or_non_borrowing_spouse: null,
    us_citizen: null,
    permanent_resident_alien: null,
    intend_occupy_primary: null,
  };
}

export function emptyContact(): ContactBlock {
  return { name: "", company: "", phone: "", email: "", relationship: "" };
}

export function emptyTrackRow(): TrackRecordRow {
  return {
    status: "",
    project_type: "",
    titled_owner: "",
    property_address: "",
    city: "",
    state: "",
    zip: "",
    purchase_date: "",
    purchase_price: "",
    renovation_costs: "",
    disposition_date: "",
    disposition_price: "",
  };
}

export function emptySreoRow(): SreoPropertyRow {
  return {
    street_number: "",
    street_name: "",
    unit_count: "",
    unit_apt: "",
    city: "",
    state: "",
    zip: "",
    entity_name_on_title: "",
    ownership_percent: "",
    investment_type: "",
    property_type: "",
    units_occupied: "",
    lease_start: "",
    lease_end: "",
    purchase_date: "",
    purchase_price: "",
    capital_improvements: "",
    estimated_as_is_value: "",
    total_debt_payoff: "",
    monthly_gross_rent: "",
    other_monthly_income: "",
    annual_property_mgmt_fee: "",
    annual_taxes: "",
    annual_insurance: "",
    annual_hoa: "",
    annual_capex: "",
    annual_vacancy_cost: "",
    other_annual_owner_expenses: "",
    annual_utilities: "",
    annual_repair_maintenance: "",
  };
}

export const DEFAULT_CONSTRUCTION_LINE_ITEMS: string[] = [
  "Plans (Architectural, Structural, Civil, etc.)",
  "Permits",
  "Additional Soft Costs (Soil Reports, Deputy Inspections, etc.)",
  "Project Management (If not our client or part of the entity)",
  "GC Fee (If not our client or part of the entity)",
  "Temporary Facilities (Fencing, toilets, power etc.)",
  "Sewer Connection",
  "Trash Out",
  "Demolition",
  "Excavation/Grading/Shoring/Site Work",
  "Trenching",
  "Foundation",
  "Retaining Wall(s)",
  "Site Water Proofing",
  "Structural Steel",
  "Rough Framing Labor",
  "Rough Framing Material",
  "Rough Plumbing Labor",
  "Rough Plumbing Material",
  "Rough Electrical Labor",
  "Rough Electrical Material",
  "HVAC Rough Labor",
  "HVAC Rough Material",
  "Fire Sprinklers",
  "Phone/Data/Smarthome Rough Wiring (M&L)",
  "Ext Door Labor",
  "Ext Door Material",
  "Window Labor",
  "Window Material",
  "Siding/Brick/Stucco",
  "Exterior Paint",
  "Fireplace (Unit, Mantel, Surround)",
  "Roofing",
  "Insulation",
  "Drywall",
  "Interior Waterproofing",
  "Balcony/Deck Waterproofing",
  "Tile Labor",
  "Tile Material",
  "Interior Doors/Hardware (M&L)",
  "Finish Carpentry (Base/Casing/Crown/Wainscot etc.)(M&L)",
  "Kitchen Cabinets",
  "Bathroom Vanities",
  "Custom Cabinets",
  "Interior Painting",
  "Flooring Labor",
  "Flooring Material",
  "Countertop Labor",
  "Countertop Material",
  "Plumbing Final Install Labor",
  "Plumbing Final Install Material",
  "Electrical Final Install Labor",
  "Electrical Final Install Material",
  "Low Voltage Finish (Equipment, etc.)",
  "HVAC Finish Labor",
  "HVAC Finish Material",
  "Shower Glass",
  "Custom Glass Work",
  "Appliances",
  "Accessories (Door Stops, Towel Bars, etc.)",
  "Garage Door",
  "Fence/Gate/Trellis",
  "Gutters/Downspouts",
  "Swimming Pool/Jacuzzi",
  "Hardscape",
  "Landscaping Labor",
  "Landscaping Material",
  "Irrigation",
  "Dumpsters",
  "Final Cleaning",
  "Open",
  "Open",
  "Open",
  "Open",
  "Open",
  "Contingency",
];

export function emptyConstructionBudgetLine(lineItem = ""): ConstructionBudgetLine {
  return { line_item: lineItem, budget_amount: "", description: "" };
}

export function emptyConstructionBudget(): ConstructionBudgetPackage {
  return {
    construction_level: "",
    finish_level: "",
    renovation_description: "",
    project_duration_months: "",
    permits_required: null,
    permits_issued: null,
    permits_obtain_months: "",
    adding_square_footage: null,
    expansion_type: "",
    line_items: DEFAULT_CONSTRUCTION_LINE_ITEMS.map((item) => emptyConstructionBudgetLine(item)),
  };
}

export function emptyContractor(): ContractorPackage {
  return {
    role: "",
    owner_builder_name: "",
    owner_builder_street: "",
    owner_builder_city_state_zip: "",
    planned_project_levels: [],
    business_entity_name: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
    business_type: "",
    owners: [
      { name: "", ownership_percent: "" },
      { name: "", ownership_percent: "" },
    ],
    phone: "",
    fax: "",
    email: "",
    tin_ssn: "",
    years_in_business: "",
    sales_history: [{ year: "", yearly_gross_sales: "", yearly_projects_completed: "", type_of_projects: "" }],
    completed_projects: [
      { year: "", status: "", project_address: "", project_cost: "", project_scope: "" },
      { year: "", status: "", project_address: "", project_cost: "", project_scope: "" },
      { year: "", status: "", project_address: "", project_cost: "", project_scope: "" },
    ],
    no_contractor_license: false,
    has_employees: null,
    license_state: "",
    license_number: "",
    license_issue_date: "",
    license_expiration_date: "",
    license_type: "",
    license_status: "",
    supplier_references: [
      { company: "", contact_person: "", phone: "", type: "supplier" },
      { company: "", contact_person: "", phone: "", type: "supplier" },
      { company: "", contact_person: "", phone: "", type: "subcontractor" },
      { company: "", contact_person: "", phone: "", type: "subcontractor" },
    ],
    client_references: [
      { name: "", phone: "", street_address: "", new_or_reno: "", contract_amount: "" },
      { name: "", phone: "", street_address: "", new_or_reno: "", contract_amount: "" },
    ],
    release_authorized: false,
    release_print_name: "",
    release_title: "",
    release_date: "",
    project_name: "",
    project_secondary_contact_name: "",
    project_secondary_contact_email: "",
    project_secondary_contact_phone: "",
    final_budget: "",
  };
}

export function emptyApplicationPackage(): ApplicationPackage {
  return {
    version: 1,
    borrower: emptyBorrowerParty(),
    has_co_borrower: false,
    co_borrower: null,
    business_purpose_attested: false,
    ecoa_appraisal_acknowledged: false,
    credit_authorization_acknowledged: false,
    declarations: emptyDeclarations(),
    subject_property: {
      address: "",
      city: "",
      state: "NV",
      postal: "",
      property_type: "",
      number_of_units: "",
      occupancy: "",
      estate_held: "",
      construction_method: "",
      cross_collateralization: null,
      cross_collateral_property_count: "",
    },
    loan_request: {
      transaction_type: "",
      loan_amount: "",
      loan_term_years: "",
      purchase_price: "",
      estimated_property_value: "",
      requesting_rehab_financing: null,
      requesting_ground_up: null,
      budget_amount: "",
      estimated_arv: "",
      refinance_current_debt: "",
      refinance_original_cost: "",
      refinance_year_acquired: "",
      refinance_as_is_value: "",
      refinance_rehab_completed: "",
      refinance_rehab_to_complete: "",
    },
    vesting: {
      vesting_in: "",
      entity_name: "",
      entity_type: "",
      entity_state: "",
      ein: "",
    },
    interior_access: emptyContact(),
    escrow_title: emptyContact(),
    insurance: emptyContact(),
    strategy: {
      plan_for_property: "",
      anticipated_hold_months: "",
      projected_monthly_rent: "",
      plan_increase_rents: null,
      future_monthly_rent: "",
      rehab_or_upgrade: null,
      estimated_rehab_cost: "",
      estimated_arv: "",
      adding_square_footage: null,
      added_square_footage: "",
      expands_structure_50_percent: null,
      rehab_budget_attached: null,
      work_already_begun: null,
      scope_of_work: "",
      investment_strategy: "",
      exit_strategy: "",
      exit_strategy_detail: "",
      cash_out_proceeds_use: "",
    },
    track_record: [emptyTrackRow()],
    sreo: [emptySreoRow()],
    construction_budget: emptyConstructionBudget(),
    contractor: emptyContractor(),
    notes: "",
  };
}

export function displayName(party: Pick<BorrowerParty, "first_name" | "middle_name" | "last_name">): string {
  return [party.first_name, party.middle_name, party.last_name].filter((p) => p.trim()).join(" ").trim();
}

// TODO(counsel): replace with Vault counsel-approved business-purpose attestation language.
export const BUSINESS_PURPOSE_ATTESTATION =
  "I confirm this is a non-owner-occupied, business-purpose transaction only. I do not intend to occupy the subject property as my primary residence.";

// TODO(counsel): replace with Vault counsel-approved ECOA appraisal notice language.
export const ECOA_APPRAISAL_ATTESTATION =
  "I acknowledge the ECOA notice of right to a copy of appraisal / valuation reports, and that I may waive the 3-business-day review period prior to closing.";

// TODO(counsel): replace with Vault counsel-approved credit/background authorization language.
export const CREDIT_AUTHORIZATION_ATTESTATION =
  "I authorize the lender to conduct a background and/or credit check and to disclose credit experience to necessary third parties for due diligence on this application.";

export const CONSTRUCTION_LEVEL_LABELS: Record<ConstructionLevel, string> = {
  "1": "Level 1 — Light scope (cosmetic)",
  "2": "Level 2 — Medium scope",
  "3": "Level 3 — Heavy renovation",
  "4": "Level 4 — Footprint expansion",
  "5": "Level 5 — Ground up construction",
};
