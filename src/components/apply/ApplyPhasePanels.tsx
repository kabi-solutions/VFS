"use client";

import type { Dispatch, DragEvent, ReactNode, SetStateAction } from "react";
import { ContactFields } from "@/components/apply/ContactFields";
import { ConstructionBudgetEditor } from "@/components/apply/ConstructionBudgetEditor";
import { ContractorFields } from "@/components/apply/ContractorFields";
import { DeclarationsFields } from "@/components/apply/DeclarationsFields";
import { FieldRequirementChip } from "@/components/apply/FieldRequirementChip";
import {
  errorClass,
  fieldClass,
  hintClass,
  labelClass,
  sectionTitleClass,
} from "@/components/apply/fieldStyles";
import { PartyFields } from "@/components/apply/PartyFields";
import { SreoEditor } from "@/components/apply/SreoEditor";
import { TrackRecordEditor } from "@/components/apply/TrackRecordEditor";
import {
  BUSINESS_PURPOSE_ATTESTATION,
  CREDIT_AUTHORIZATION_ATTESTATION,
  ECOA_APPRAISAL_ATTESTATION,
  emptyBorrowerParty,
  emptyConstructionBudget,
  type ApplicationPackage,
  type LoanRequestInfo,
  type StrategyInfo,
  type SubjectPropertyInfo,
  type VestingInfo,
} from "@/lib/apply/package";
import { starterStates } from "@/lib/marketing/states";
import { docTypeLabels, loanTypeLabels } from "@/lib/mock/status-labels";
import type { LoanType } from "@/lib/types/database";

export type HardErrors = Partial<
  Record<
    | "first_name"
    | "last_name"
    | "email"
    | "cell_phone"
    | "address"
    | "loan_type"
    | "loan_amount"
    | "business_purpose"
    | "ground_up_force",
    string
  >
>;

type PendingDoc = {
  localId: string;
  file_name: string;
  doc_type: string;
  file_size_bytes: number;
  mime_type: string | null;
  error?: string;
};

function Label({
  htmlFor,
  children,
  chip,
}: {
  htmlFor?: string;
  children: ReactNode;
  chip?: "required" | "helps";
}) {
  const Tag = htmlFor ? "label" : "span";
  return (
    <Tag htmlFor={htmlFor} className={labelClass}>
      {children}
      {chip ? <FieldRequirementChip kind={chip} /> : null}
    </Tag>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const loanTypes = Object.keys(loanTypeLabels) as LoanType[];

const docCategories = [
  "purchase_contract",
  "payoff_statement",
  "entity_docs",
  "insurance",
  "bank_statements",
  "photo_id",
  "lease_agreement",
  "rehab_budget",
  "construction_budget",
  "contractor_license",
  "contractor_drivers_license",
  "contractor_w9",
  "workers_comp_insurance",
  "commercial_gl_insurance",
  "personal_liability_insurance",
  "sreo_schedule",
  "track_record_schedule",
  "other",
] as const;

type Shared = {
  pkg: ApplicationPackage;
  loanType: LoanType;
  loanTypeAutoNote: string | null;
  errors: HardErrors;
  patchPkg: (updater: (prev: ApplicationPackage) => ApplicationPackage) => void;
  patchSubject: (patch: Partial<SubjectPropertyInfo>) => void;
  patchLoan: (patch: Partial<LoanRequestInfo>) => void;
  patchVesting: (patch: Partial<VestingInfo>) => void;
  patchStrategy: (patch: Partial<StrategyInfo>) => void;
  setLoanType: (t: LoanType) => void;
  onBlurHard?: () => void;
};

export function DealPropertyPanel({
  pkg,
  errors,
  patchSubject,
  patchLoan,
  onBlurHard,
}: Pick<Shared, "pkg" | "errors" | "patchSubject" | "patchLoan" | "onBlurHard">) {
  return (
    <div className="space-y-6">
      <h2 className={sectionTitleClass}>Property</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="subject_address" chip="required">
            Subject property street address
          </Label>
          <input
            id="subject_address"
            className={fieldClass}
            value={pkg.subject_property.address}
            onChange={(e) => patchSubject({ address: e.target.value })}
            onBlur={onBlurHard}
            autoComplete="street-address"
          />
          {errors.address ? <p className={errorClass}>{errors.address}</p> : null}
        </div>
        <div>
          <Label htmlFor="property_type" chip="helps">
            Property type
          </Label>
          <select
            id="property_type"
            className={fieldClass}
            value={pkg.subject_property.property_type}
            onChange={(e) =>
              patchSubject({
                property_type: e.target.value as SubjectPropertyInfo["property_type"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="sfr">SFR</option>
            <option value="condo">Condo</option>
            <option value="pud">PUD</option>
            <option value="units_2_4">2–4 units</option>
            <option value="units_5_plus">5+ units</option>
          </select>
        </div>
        <div>
          <Label htmlFor="transaction_type" chip="helps">
            Purchase or refinance
          </Label>
          <select
            id="transaction_type"
            className={fieldClass}
            value={pkg.loan_request.transaction_type}
            onChange={(e) =>
              patchLoan({
                transaction_type: e.target.value as LoanRequestInfo["transaction_type"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="purchase">Purchase</option>
            <option value="rate_term_refinance">Rate/term refinance</option>
            <option value="cash_out_refinance">Cash-out refinance</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function DealLoanPanel({
  pkg,
  loanType,
  loanTypeAutoNote,
  errors,
  patchLoan,
  patchStrategy,
  setLoanType,
  onBlurHard,
}: Pick<
  Shared,
  | "pkg"
  | "loanType"
  | "loanTypeAutoNote"
  | "errors"
  | "patchLoan"
  | "patchStrategy"
  | "setLoanType"
  | "onBlurHard"
>) {
  return (
    <div className="space-y-6">
      <h2 className={sectionTitleClass}>Loan</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="loan_type" chip="required">
            Loan type
          </Label>
          <select
            id="loan_type"
            className={fieldClass}
            value={loanType}
            onChange={(e) => setLoanType(e.target.value as LoanType)}
            onBlur={onBlurHard}
          >
            {loanTypes.map((t) => (
              <option key={t} value={t}>
                {loanTypeLabels[t]}
              </option>
            ))}
          </select>
          {errors.loan_type ? <p className={errorClass}>{errors.loan_type}</p> : null}
          {errors.ground_up_force ? <p className={errorClass}>{errors.ground_up_force}</p> : null}
          {loanTypeAutoNote ? <p className={`${hintClass} text-green`}>{loanTypeAutoNote}</p> : null}
        </div>
        <div>
          <Label htmlFor="loan_amount" chip="required">
            Loan amount
          </Label>
          <input
            id="loan_amount"
            className={fieldClass}
            inputMode="decimal"
            value={pkg.loan_request.loan_amount}
            onChange={(e) => patchLoan({ loan_amount: e.target.value })}
            onBlur={onBlurHard}
          />
          {errors.loan_amount ? <p className={errorClass}>{errors.loan_amount}</p> : null}
        </div>
        <div>
          <Label htmlFor="loan_term" chip="helps">
            Timeline (loan term)
          </Label>
          <select
            id="loan_term"
            className={fieldClass}
            value={pkg.loan_request.loan_term_years}
            onChange={(e) =>
              patchLoan({
                loan_term_years: e.target.value as LoanRequestInfo["loan_term_years"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="1">1 year</option>
            <option value="2">2 years</option>
          </select>
        </div>
        <div>
          <Label htmlFor="exit_strategy" chip="helps">
            Exit strategy (high level)
          </Label>
          <select
            id="exit_strategy"
            className={fieldClass}
            value={pkg.strategy.exit_strategy}
            onChange={(e) =>
              patchStrategy({
                exit_strategy: e.target.value as StrategyInfo["exit_strategy"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="sell">Sell</option>
            <option value="refinance">Refinance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="hold_months" chip="helps">
            Anticipated hold (months)
          </Label>
          <input
            id="hold_months"
            className={fieldClass}
            value={pkg.strategy.anticipated_hold_months}
            onChange={(e) => patchStrategy({ anticipated_hold_months: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function DealContactPanel({
  pkg,
  errors,
  patchPkg,
  onBlurHard,
}: Pick<Shared, "pkg" | "errors" | "patchPkg" | "onBlurHard">) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={sectionTitleClass}>Contact</h2>
        <div className="mt-4">
          <PartyFields
            idPrefix="borrower"
            party={pkg.borrower}
            contactOnly
            hardRequired
            errors={errors}
            onBlurValidate={onBlurHard}
            onChange={(borrower) => patchPkg((prev) => ({ ...prev, borrower }))}
          />
        </div>
      </div>
      <label className="flex items-start gap-3 rounded-[1.25rem] bg-green-mist px-4 py-4 text-[0.9375rem] text-charcoal">
        <input
          type="checkbox"
          className="mt-1 min-h-[1.25rem] min-w-[1.25rem]"
          checked={pkg.business_purpose_attested}
          onChange={(e) =>
            patchPkg((prev) => ({
              ...prev,
              business_purpose_attested: e.target.checked,
            }))
          }
          onBlur={onBlurHard}
        />
        <span>
          <span className="mb-1 block">
            <FieldRequirementChip kind="required" />
          </span>
          {/* TODO(counsel): counsel-approved business-purpose language */}
          {BUSINESS_PURPOSE_ATTESTATION}
        </span>
      </label>
      {errors.business_purpose ? <p className={errorClass}>{errors.business_purpose}</p> : null}
      <p className="rounded-[1.25rem] bg-paper px-4 py-3 text-[0.9375rem] leading-relaxed text-steel">
        You can submit now. The rest can be completed in your portal, and we will tell you what is
        still missing.
      </p>
    </div>
  );
}

export function ProfileBorrowerPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={sectionTitleClass}>Borrower profile</h2>
        <div className="mt-4">
          <PartyFields
            idPrefix="borrower-full"
            party={pkg.borrower}
            onChange={(borrower) => patchPkg((prev) => ({ ...prev, borrower }))}
          />
        </div>
      </div>
      <label className="flex items-start gap-3 text-[0.9375rem] text-charcoal">
        <input
          type="checkbox"
          className="mt-1 min-h-[1.25rem] min-w-[1.25rem]"
          checked={pkg.has_co_borrower}
          onChange={(e) =>
            patchPkg((prev) => ({
              ...prev,
              has_co_borrower: e.target.checked,
              co_borrower: e.target.checked ? prev.co_borrower ?? emptyBorrowerParty() : null,
            }))
          }
        />
        <span>
          Add a co-borrower <FieldRequirementChip kind="helps" />
        </span>
      </label>
      {pkg.has_co_borrower && pkg.co_borrower ? (
        <div>
          <h2 className={sectionTitleClass}>Co-borrower</h2>
          <div className="mt-4">
            <PartyFields
              idPrefix="co"
              party={pkg.co_borrower}
              onChange={(co_borrower) => patchPkg((prev) => ({ ...prev, co_borrower }))}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileDeclarationsPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={sectionTitleClass}>Declarations</h2>
        <div className="mt-4">
          <DeclarationsFields
            declarations={pkg.declarations}
            onChange={(declarations) => patchPkg((prev) => ({ ...prev, declarations }))}
          />
        </div>
      </div>
      <label className="flex items-start gap-3 rounded-[1.25rem] border border-line px-4 py-4 text-[0.9375rem] text-charcoal">
        <input
          type="checkbox"
          className="mt-1 min-h-[1.25rem] min-w-[1.25rem]"
          checked={pkg.ecoa_appraisal_acknowledged}
          onChange={(e) =>
            patchPkg((prev) => ({
              ...prev,
              ecoa_appraisal_acknowledged: e.target.checked,
            }))
          }
        />
        <span>
          <span className="mb-1 block">
            <FieldRequirementChip kind="helps" />
          </span>
          {/* TODO(counsel): counsel-approved ECOA appraisal notice language */}
          {ECOA_APPRAISAL_ATTESTATION}
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-[1.25rem] border border-line px-4 py-4 text-[0.9375rem] text-charcoal">
        <input
          type="checkbox"
          className="mt-1 min-h-[1.25rem] min-w-[1.25rem]"
          checked={pkg.credit_authorization_acknowledged}
          onChange={(e) =>
            patchPkg((prev) => ({
              ...prev,
              credit_authorization_acknowledged: e.target.checked,
            }))
          }
        />
        <span>
          <span className="mb-1 block">
            <FieldRequirementChip kind="helps" />
          </span>
          {/* TODO(counsel): counsel-approved credit/background authorization language */}
          {CREDIT_AUTHORIZATION_ATTESTATION}
        </span>
      </label>
    </div>
  );
}

export function ProfilePropertyDetailPanel({
  pkg,
  patchSubject,
  patchLoan,
  patchVesting,
}: Pick<Shared, "pkg" | "patchSubject" | "patchLoan" | "patchVesting">) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className={sectionTitleClass}>Property details</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {(
            [
              ["city", "City", "city"],
              ["state", "State", "state"],
              ["postal", "Postal code", "postal"],
              ["number_of_units", "Number of units", "units"],
            ] as const
          ).map(([key, label, id]) => (
            <div key={key}>
              <Label htmlFor={id} chip="helps">
                {label}
              </Label>
              <input
                id={id}
                list={key === "state" ? "vfs-starter-states" : undefined}
                className={fieldClass}
                value={pkg.subject_property[key]}
                onChange={(e) => patchSubject({ [key]: e.target.value })}
              />
            </div>
          ))}
          <datalist id="vfs-starter-states">
            {starterStates.map((s) => (
              <option key={s.abbr} value={s.abbr}>
                {s.name}
              </option>
            ))}
          </datalist>
          <div>
            <Label htmlFor="occupancy" chip="helps">
              Occupancy
            </Label>
            <select
              id="occupancy"
              className={fieldClass}
              value={pkg.subject_property.occupancy}
              onChange={(e) =>
                patchSubject({ occupancy: e.target.value as SubjectPropertyInfo["occupancy"] })
              }
            >
              <option value="">Select…</option>
              <option value="leased">Leased</option>
              <option value="vacant">Vacant</option>
            </select>
          </div>
          <div>
            <Label htmlFor="estate" chip="helps">
              Estate held in
            </Label>
            <select
              id="estate"
              className={fieldClass}
              value={pkg.subject_property.estate_held}
              onChange={(e) =>
                patchSubject({ estate_held: e.target.value as SubjectPropertyInfo["estate_held"] })
              }
            >
              <option value="">Select…</option>
              <option value="fee_simple">Fee simple</option>
              <option value="leasehold">Leasehold</option>
            </select>
          </div>
          <div>
            <Label htmlFor="construction_method" chip="helps">
              Construction method
            </Label>
            <select
              id="construction_method"
              className={fieldClass}
              value={pkg.subject_property.construction_method}
              onChange={(e) =>
                patchSubject({
                  construction_method: e.target
                    .value as SubjectPropertyInfo["construction_method"],
                })
              }
            >
              <option value="">Select…</option>
              <option value="site_built">Site built</option>
              <option value="manufactured">Manufactured</option>
            </select>
          </div>
          <div>
            <Label htmlFor="cross_col" chip="helps">
              Cross collateralization?
            </Label>
            <select
              id="cross_col"
              className={fieldClass}
              value={
                pkg.subject_property.cross_collateralization === null
                  ? ""
                  : pkg.subject_property.cross_collateralization
                    ? "yes"
                    : "no"
              }
              onChange={(e) =>
                patchSubject({
                  cross_collateralization:
                    e.target.value === "" ? null : e.target.value === "yes",
                })
              }
            >
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {pkg.subject_property.cross_collateralization ? (
            <div>
              <Label htmlFor="cross_count" chip="helps">
                Cross-collateral property count
              </Label>
              <input
                id="cross_count"
                className={fieldClass}
                value={pkg.subject_property.cross_collateral_property_count}
                onChange={(e) =>
                  patchSubject({ cross_collateral_property_count: e.target.value })
                }
              />
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <h2 className={sectionTitleClass}>Loan details</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          {(
            [
              ["purchase_price", "Purchase price"],
              ["estimated_property_value", "Estimated property value"],
              ["budget_amount", "Budget amount"],
              ["estimated_arv", "Estimated ARV"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={key} chip="helps">
                {label}
              </Label>
              <input
                id={key}
                className={fieldClass}
                value={pkg.loan_request[key]}
                onChange={(e) => patchLoan({ [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="rehab_fin" chip="helps">
              Requesting rehab financing?
            </Label>
            <select
              id="rehab_fin"
              className={fieldClass}
              value={
                pkg.loan_request.requesting_rehab_financing === null
                  ? ""
                  : pkg.loan_request.requesting_rehab_financing
                    ? "yes"
                    : "no"
              }
              onChange={(e) =>
                patchLoan({
                  requesting_rehab_financing:
                    e.target.value === "" ? null : e.target.value === "yes",
                })
              }
            >
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <Label htmlFor="ground_up" chip="helps">
              Ground up?
            </Label>
            <select
              id="ground_up"
              className={fieldClass}
              value={
                pkg.loan_request.requesting_ground_up === null
                  ? ""
                  : pkg.loan_request.requesting_ground_up
                    ? "yes"
                    : "no"
              }
              onChange={(e) =>
                patchLoan({
                  requesting_ground_up: e.target.value === "" ? null : e.target.value === "yes",
                })
              }
            >
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        {pkg.loan_request.transaction_type === "rate_term_refinance" ||
        pkg.loan_request.transaction_type === "cash_out_refinance" ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {(
              [
                ["refinance_current_debt", "Current debt on property"],
                ["refinance_original_cost", "Original cost"],
                ["refinance_year_acquired", "Year acquired"],
                ["refinance_as_is_value", "As-is value"],
                ["refinance_rehab_completed", "Rehab already completed"],
                ["refinance_rehab_to_complete", "Rehab still to complete"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label chip="helps">{label}</Label>
                <input
                  className={fieldClass}
                  value={pkg.loan_request[key]}
                  onChange={(e) => patchLoan({ [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <h2 className={sectionTitleClass}>Vesting</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <Label htmlFor="vesting_in" chip="helps">
              Vesting in
            </Label>
            <select
              id="vesting_in"
              className={fieldClass}
              value={pkg.vesting.vesting_in}
              onChange={(e) =>
                patchVesting({ vesting_in: e.target.value as VestingInfo["vesting_in"] })
              }
            >
              <option value="">Select…</option>
              <option value="entity">Entity</option>
              <option value="individual">Individual</option>
            </select>
          </div>
          {pkg.vesting.vesting_in === "entity" ? (
            <>
              <div>
                <Label htmlFor="entity_name" chip="helps">
                  Entity name
                </Label>
                <input
                  id="entity_name"
                  className={fieldClass}
                  value={pkg.vesting.entity_name}
                  onChange={(e) => patchVesting({ entity_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="entity_type" chip="helps">
                  Entity type
                </Label>
                <select
                  id="entity_type"
                  className={fieldClass}
                  value={pkg.vesting.entity_type}
                  onChange={(e) =>
                    patchVesting({ entity_type: e.target.value as VestingInfo["entity_type"] })
                  }
                >
                  <option value="">Select…</option>
                  <option value="llc">LLC</option>
                  <option value="corp">Corp</option>
                  <option value="trust">Trust</option>
                  <option value="llp">LLP</option>
                  <option value="individual">Individual</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="entity_state" chip="helps">
                  Entity state
                </Label>
                <input
                  id="entity_state"
                  className={fieldClass}
                  value={pkg.vesting.entity_state}
                  onChange={(e) => patchVesting({ entity_state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ein" chip="helps">
                  EIN
                </Label>
                <input
                  id="ein"
                  className={fieldClass}
                  value={pkg.vesting.ein}
                  onChange={(e) => patchVesting({ ein: e.target.value })}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProfileContactsPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <div className="space-y-8">
      <ContactFields
        idPrefix="interior"
        title="Interior access"
        contact={pkg.interior_access}
        withRelationship
        onChange={(interior_access) => patchPkg((prev) => ({ ...prev, interior_access }))}
      />
      <ContactFields
        idPrefix="escrow"
        title="Escrow / title"
        contact={pkg.escrow_title}
        onChange={(escrow_title) => patchPkg((prev) => ({ ...prev, escrow_title }))}
      />
      <ContactFields
        idPrefix="insurance"
        title="Insurance"
        contact={pkg.insurance}
        onChange={(insurance) => patchPkg((prev) => ({ ...prev, insurance }))}
      />
    </div>
  );
}

export function ProfileStrategyPanel({
  pkg,
  patchStrategy,
}: Pick<Shared, "pkg" | "patchStrategy">) {
  return (
    <div className="space-y-6">
      <h2 className={sectionTitleClass}>Strategy &amp; exit</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="plan" chip="helps">
            Plan for property
          </Label>
          <select
            id="plan"
            className={fieldClass}
            value={pkg.strategy.plan_for_property}
            onChange={(e) =>
              patchStrategy({
                plan_for_property: e.target.value as StrategyInfo["plan_for_property"],
              })
            }
          >
            <option value="">Select…</option>
            <option value="flip">Flip</option>
            <option value="rental">Rental</option>
            <option value="bridge">Bridge</option>
          </select>
        </div>
        <div>
          <Label htmlFor="rent" chip="helps">
            Projected monthly rent
          </Label>
          <input
            id="rent"
            className={fieldClass}
            value={pkg.strategy.projected_monthly_rent}
            onChange={(e) => patchStrategy({ projected_monthly_rent: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="rehab" chip="helps">
            Rehab or upgrade?
          </Label>
          <select
            id="rehab"
            className={fieldClass}
            value={
              pkg.strategy.rehab_or_upgrade === null
                ? ""
                : pkg.strategy.rehab_or_upgrade
                  ? "yes"
                  : "no"
            }
            onChange={(e) =>
              patchStrategy({
                rehab_or_upgrade: e.target.value === "" ? null : e.target.value === "yes",
              })
            }
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {pkg.strategy.rehab_or_upgrade ? (
          <>
            <div>
              <Label htmlFor="rehab_cost" chip="helps">
                Estimated rehab / construction cost
              </Label>
              <input
                id="rehab_cost"
                className={fieldClass}
                value={pkg.strategy.estimated_rehab_cost}
                onChange={(e) => patchStrategy({ estimated_rehab_cost: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="strategy_arv" chip="helps">
                Estimated ARV
              </Label>
              <input
                id="strategy_arv"
                className={fieldClass}
                value={pkg.strategy.estimated_arv}
                onChange={(e) => patchStrategy({ estimated_arv: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="scope" chip="helps">
                Scope of work
              </Label>
              <textarea
                id="scope"
                className={`${fieldClass} resize-y`}
                rows={3}
                value={pkg.strategy.scope_of_work}
                onChange={(e) => patchStrategy({ scope_of_work: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="expand_50" chip="helps">
                Expanding existing structure by 50%+?
              </Label>
              <select
                id="expand_50"
                className={fieldClass}
                value={
                  pkg.strategy.expands_structure_50_percent === null
                    ? ""
                    : pkg.strategy.expands_structure_50_percent
                      ? "yes"
                      : "no"
                }
                onChange={(e) =>
                  patchStrategy({
                    expands_structure_50_percent:
                      e.target.value === "" ? null : e.target.value === "yes",
                  })
                }
              >
                <option value="">Select…</option>
                <option value="yes">Yes — treat as ground up</option>
                <option value="no">No</option>
              </select>
            </div>
          </>
        ) : null}
        <div className="sm:col-span-2">
          <Label htmlFor="investment_strategy" chip="helps">
            Investment strategy
          </Label>
          <textarea
            id="investment_strategy"
            className={`${fieldClass} resize-y`}
            rows={3}
            value={pkg.strategy.investment_strategy}
            onChange={(e) => patchStrategy({ investment_strategy: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="exit_detail" chip="helps">
            Plan to repay this loan
          </Label>
          <input
            id="exit_detail"
            className={fieldClass}
            value={pkg.strategy.exit_strategy_detail}
            onChange={(e) => patchStrategy({ exit_strategy_detail: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function PackageTrackPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <TrackRecordEditor
      rows={pkg.track_record}
      onChange={(track_record) => patchPkg((prev) => ({ ...prev, track_record }))}
    />
  );
}

export function PackageSreoPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <SreoEditor rows={pkg.sreo} onChange={(sreo) => patchPkg((prev) => ({ ...prev, sreo }))} />
  );
}

export function PackageBudgetPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  return (
    <ConstructionBudgetEditor
      budget={pkg.construction_budget ?? emptyConstructionBudget()}
      onChange={(construction_budget) =>
        patchPkg((prev) => ({ ...prev, construction_budget }))
      }
    />
  );
}

export function PackageContractorPanel({ pkg, patchPkg }: Pick<Shared, "pkg" | "patchPkg">) {
  if (!pkg.contractor) return null;
  return (
    <ContractorFields
      contractor={pkg.contractor}
      onChange={(contractor) => patchPkg((prev) => ({ ...prev, contractor }))}
    />
  );
}

export function PackageDocumentsPanel({
  pkg,
  patchPkg,
  pendingDocs,
  setPendingDocs,
  defaultDocType,
  setDefaultDocType,
  dragOver,
  setDragOver,
}: {
  pkg: ApplicationPackage;
  patchPkg: Shared["patchPkg"];
  pendingDocs: PendingDoc[];
  setPendingDocs: Dispatch<SetStateAction<PendingDoc[]>>;
  defaultDocType: string;
  setDefaultDocType: (v: string) => void;
  dragOver: boolean;
  setDragOver: (v: boolean) => void;
}) {
  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const next: PendingDoc[] = files.map((file) => {
      const tooLarge = file.size > MAX_FILE_BYTES;
      return {
        localId: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file_name: file.name,
        doc_type: defaultDocType,
        file_size_bytes: file.size,
        mime_type: file.type || null,
        error: tooLarge ? `Exceeds ${formatBytes(MAX_FILE_BYTES)} limit` : undefined,
      };
    });
    setPendingDocs((prev) => [...prev, ...next]);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        Attach what you have now. Skip is allowed — you can finish documents in your portal.
      </p>
      <div>
        <Label htmlFor="notes" chip="helps">
          Notes
        </Label>
        <textarea
          id="notes"
          rows={3}
          className={`${fieldClass} resize-y`}
          value={pkg.notes}
          onChange={(e) => patchPkg((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Deal context, timing, or structure notes"
        />
      </div>
      <div>
        <Label htmlFor="default_doc_type" chip="helps">
          Document category for next upload
        </Label>
        <select
          id="default_doc_type"
          className={fieldClass}
          value={defaultDocType}
          onChange={(e) => setDefaultDocType(e.target.value)}
        >
          {docCategories.map((c) => (
            <option key={c} value={c}>
              {docTypeLabels[c] ?? c}
            </option>
          ))}
        </select>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`rounded-[1.75rem] border border-dashed px-6 py-10 text-center transition ${
          dragOver ? "border-green bg-green-mist" : "border-line-strong bg-paper/80"
        }`}
      >
        <p className="text-[1.0625rem] font-medium text-ink">Drag and drop files here</p>
        <p className="mt-2 text-[0.875rem] text-steel">
          Max {formatBytes(MAX_FILE_BYTES)} per file.
        </p>
        <label className="mt-6 inline-flex cursor-pointer">
          <span className="rounded-[var(--radius-control)] bg-white px-5 py-2.5 text-[0.9375rem] font-medium text-charcoal shadow-[inset_0_0_0_1px_var(--line-strong)]">
            Browse files
          </span>
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {pendingDocs.length > 0 ? (
        <ul className="divide-y divide-line rounded-[1.5rem] border border-line">
          {pendingDocs.map((doc) => (
            <li
              key={doc.localId}
              className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-[0.9375rem]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{doc.file_name}</p>
                <p className="mt-1 text-[0.8125rem] text-steel">
                  {docTypeLabels[doc.doc_type] ?? doc.doc_type} · {formatBytes(doc.file_size_bytes)}
                </p>
                {doc.error ? (
                  <p className="mt-1 text-[0.8125rem] text-red-600">{doc.error}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="rounded-xl border border-line bg-white px-2 py-1.5 text-[0.8125rem]"
                  value={doc.doc_type}
                  onChange={(e) =>
                    setPendingDocs((prev) =>
                      prev.map((d) =>
                        d.localId === doc.localId ? { ...d, doc_type: e.target.value } : d,
                      ),
                    )
                  }
                >
                  {docCategories.map((c) => (
                    <option key={c} value={c}>
                      {docTypeLabels[c] ?? c}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-[0.8125rem] font-medium text-steel hover:text-ink"
                  onClick={() =>
                    setPendingDocs((prev) => prev.filter((d) => d.localId !== doc.localId))
                  }
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[0.875rem] text-steel">No documents attached — skip is allowed.</p>
      )}
    </div>
  );
}
