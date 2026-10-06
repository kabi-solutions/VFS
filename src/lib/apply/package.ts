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
export type TrackProjectStatus = "current" | "complete";
export type TrackProjectType = "fix_flip" | "fix_hold" | "ground_up";
export type ContractorBusinessType =
  | "sole_proprietor"
  | "partnership"
  | "corporation"
  | "limited_liability";

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
  email: string;
  employment: EmploymentInfo;
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
  rehab_or_upgrade: boolean | null;
  estimated_rehab_cost: string;
  estimated_arv: string;
  adding_square_footage: boolean | null;
  added_square_footage: string;
  expands_structure_50_percent: boolean | null;
  rehab_budget_attached: boolean | null;
  work_already_begun: boolean | null;
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
};

export type SreoPropertyRow = {
  street_number: string;
  street_name: string;
  unit_count: string;
  unit_apt: string;
  city: string;
  state: string;
  zip: string;
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

export type ContractorPackage = {
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
  subject_property: SubjectPropertyInfo;
  loan_request: LoanRequestInfo;
  vesting: VestingInfo;
  interior_access: ContactBlock;
  escrow_title: ContactBlock;
  insurance: ContactBlock;
  strategy: StrategyInfo;
  track_record: TrackRecordRow[];
  sreo: SreoPropertyRow[];
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
    if (st.rehab_budget_attached !== true && !docTypes.includes("rehab_budget")) {
      missing.push({
        id: "strategy.rehab_budget_doc",
        section: "Documents",
        label: "Rehab budget attached",
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
  if (st.plan_for_property === "rental" && !filled(st.projected_monthly_rent)) {
    missing.push({
      id: "strategy.rent",
      section: "Strategy",
      label: "Projected monthly rental income",
      severity: "required_for_package",
    });
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

  const needsContractor =
    lr.requesting_rehab_financing === true ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction";
  if (needsContractor) {
    const c = pkg.contractor;
    if (!c || !filled(c.business_entity_name) || !filled(c.phone) || !filled(c.email) || !c.release_authorized) {
      missing.push({
        id: "contractor",
        section: "Rehab / contractor",
        label: "Contractor business profile + release authorization",
        severity: "required_for_package",
      });
    }
    const contractorDocs = [
      "contractor_license",
      "contractor_drivers_license",
      "contractor_w9",
      "workers_comp_insurance",
      "commercial_gl_insurance",
      "rehab_budget",
    ];
    for (const doc of contractorDocs) {
      if (!docTypes.includes(doc)) {
        missing.push({
          id: `doc.${doc}`,
          section: "Documents",
          label: doc.replaceAll("_", " "),
          severity: "required_for_package",
        });
      }
    }
  }

  const totalCount = missing.length + 40;
  const completeCount = Math.max(0, totalCount - missing.length);
  const percent = Math.round((completeCount / totalCount) * 100);

  return { missing, completeCount, totalCount, percent };
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
    email: "",
    employment: emptyEmployment(),
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

export function emptyContractor(): ContractorPackage {
  return {
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
      rehab_or_upgrade: null,
      estimated_rehab_cost: "",
      estimated_arv: "",
      adding_square_footage: null,
      added_square_footage: "",
      expands_structure_50_percent: null,
      rehab_budget_attached: null,
      work_already_begun: null,
      investment_strategy: "",
      exit_strategy: "",
      exit_strategy_detail: "",
      cash_out_proceeds_use: "",
    },
    track_record: [emptyTrackRow()],
    sreo: [emptySreoRow()],
    contractor: emptyContractor(),
    notes: "",
  };
}

export function displayName(party: Pick<BorrowerParty, "first_name" | "middle_name" | "last_name">): string {
  return [party.first_name, party.middle_name, party.last_name].filter((p) => p.trim()).join(" ").trim();
}

export const BUSINESS_PURPOSE_ATTESTATION =
  "I confirm this is a non-owner-occupied, business-purpose transaction only. I do not intend to occupy the subject property as my primary residence. (Placeholder attestation — replace with Vault counsel-approved language.)";
