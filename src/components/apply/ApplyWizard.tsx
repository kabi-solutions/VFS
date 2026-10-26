"use client";

import { useEffect, useMemo, useState, type DragEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ContactFields } from "@/components/apply/ContactFields";
import { ConstructionBudgetEditor } from "@/components/apply/ConstructionBudgetEditor";
import { ContractorFields, needsContractorPackage } from "@/components/apply/ContractorFields";
import { DeclarationsFields } from "@/components/apply/DeclarationsFields";
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
  applyGroundUpLoanRequestFlags,
  displayName,
  emptyApplicationPackage,
  emptyBorrowerParty,
  emptyConstructionBudget,
  emptyContractor,
  getPackageCompleteness,
  groundUpForceReason,
  needsConstructionBudgetPackage,
  resolveForcedGroundUpLoanType,
  type ApplicationPackage,
  type LoanRequestInfo,
  type StrategyInfo,
  type SubjectPropertyInfo,
  type VestingInfo,
} from "@/lib/apply/package";
import { starterStates } from "@/lib/marketing/states";
import { createApplication, type MockDocumentInput } from "@/lib/mock/applications";
import { docTypeLabels, loanTypeLabels } from "@/lib/mock/status-labels";
import type { LoanType } from "@/lib/types/database";
import {
  isLoanType,
  timelineToHoldMonths,
  type ApplyPrefill,
} from "@/lib/config/apply-prefill";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const loanTypes = Object.keys(loanTypeLabels) as LoanType[];

const steps = [
  { id: 1, label: "Borrower" },
  { id: 2, label: "Property" },
  { id: 3, label: "Loan" },
  { id: 4, label: "Contacts" },
  { id: 5, label: "Strategy" },
  { id: 6, label: "Track record" },
  { id: 7, label: "SREO" },
  { id: 8, label: "Budget" },
  { id: 9, label: "Contractor" },
  { id: 10, label: "Documents" },
] as const;

type StepId = (typeof steps)[number]["id"];

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

type PendingDoc = MockDocumentInput & { localId: string; error?: string };

type HardErrors = Partial<
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

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? null : n;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}


function buildPrefillPackage(prefill?: ApplyPrefill): ApplicationPackage {
  const base = emptyApplicationPackage();
  if (!prefill) return base;
  return {
    ...base,
    subject_property: {
      ...base.subject_property,
      address: prefill.address || base.subject_property.address,
    },
    loan_request: {
      ...base.loan_request,
      loan_amount: prefill.amount || base.loan_request.loan_amount,
      purchase_price: prefill.purchasePrice || base.loan_request.purchase_price,
      budget_amount: prefill.rehabBudget || base.loan_request.budget_amount,
      estimated_arv: prefill.arv || base.loan_request.estimated_arv,
    },
    strategy: {
      ...base.strategy,
      anticipated_hold_months:
        timelineToHoldMonths(prefill.timeline) || base.strategy.anticipated_hold_months,
      exit_strategy_detail: prefill.timeline
        ? `Screener timeline: ${prefill.timeline}`
        : base.strategy.exit_strategy_detail,
    },
  };
}

export function ApplyWizard({
  priorApplicationId,
  prefill,
}: {
  priorApplicationId?: string;
  prefill?: ApplyPrefill;
}) {
  const [step, setStep] = useState<StepId>(1);
  const [pkg, setPkg] = useState<ApplicationPackage>(() => buildPrefillPackage(prefill));
  const [loanType, setLoanType] = useState<LoanType>(() =>
    isLoanType(prefill?.loanType) ? prefill.loanType : "rehab_fix_flip",
  );
  const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [defaultDocType, setDefaultDocType] = useState<string>("other");
  const [errors, setErrors] = useState<HardErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    referenceCode: string;
    applicationId: string;
    email: string;
    missingLabels: string[];
    packageComplete: boolean;
  } | null>(null);


  const showContractor = needsContractorPackage(
    loanType,
    pkg.loan_request.requesting_rehab_financing,
  );
  const showBudget = needsConstructionBudgetPackage(
    loanType,
    pkg.loan_request.requesting_rehab_financing,
    pkg.loan_request.requesting_ground_up,
    pkg.strategy.rehab_or_upgrade,
  );

  const visibleSteps = useMemo(
    () =>
      steps.filter((s) => {
        if (s.id === 8) return showBudget;
        if (s.id === 9) return showContractor;
        return true;
      }),
    [showBudget, showContractor],
  );

  const forcedLoanType = resolveForcedGroundUpLoanType(loanType, pkg);
  const loanTypeAutoNote = forcedLoanType ? groundUpForceReason(pkg) : null;

  useEffect(() => {
    if (!forcedLoanType || forcedLoanType === loanType) return;
    // Keep select in sync when package scope requires ground-up / new construction.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived force from package scope
    setLoanType(forcedLoanType);
  }, [forcedLoanType, loanType]);

  function patchPkg(updater: (prev: ApplicationPackage) => ApplicationPackage) {
    setPkg((prev) => applyGroundUpLoanRequestFlags(updater(prev)));
  }

  function patchSubject(patch: Partial<SubjectPropertyInfo>) {
    patchPkg((prev) => ({
      ...prev,
      subject_property: { ...prev.subject_property, ...patch },
    }));
  }

  function patchLoan(patch: Partial<LoanRequestInfo>) {
    patchPkg((prev) => ({
      ...prev,
      loan_request: { ...prev.loan_request, ...patch },
    }));
  }

  function patchVesting(patch: Partial<VestingInfo>) {
    patchPkg((prev) => ({
      ...prev,
      vesting: { ...prev.vesting, ...patch },
    }));
  }

  function patchStrategy(patch: Partial<StrategyInfo>) {
    patchPkg((prev) => ({
      ...prev,
      strategy: { ...prev.strategy, ...patch },
      contractor: prev.contractor ?? emptyContractor(),
    }));
  }

  function validateHard(forStep: StepId): HardErrors {
    const next: HardErrors = {};
    if (forStep === 1) {
      if (!pkg.borrower.first_name.trim()) next.first_name = "Enter first name.";
      if (!pkg.borrower.last_name.trim()) next.last_name = "Enter last name.";
      if (!pkg.borrower.email.trim() || !isEmail(pkg.borrower.email)) {
        next.email = "Enter a valid email.";
      }
      if (!pkg.borrower.cell_phone.trim() || pkg.borrower.cell_phone.trim().length < 7) {
        next.cell_phone = "Enter a phone number.";
      }
      if (!pkg.business_purpose_attested) {
        next.business_purpose = "Confirm business-purpose attestation to continue.";
      }
    }
    if (forStep === 2) {
      if (!pkg.subject_property.address.trim() || pkg.subject_property.address.trim().length < 3) {
        next.address = "Enter the subject property street address.";
      }
    }
    if (forStep === 3) {
      if (!loanType) next.loan_type = "Select a loan type.";
      const amount = parseMoney(pkg.loan_request.loan_amount);
      if (amount == null || amount <= 0) next.loan_amount = "Enter a valid loan amount.";
      const forced = resolveForcedGroundUpLoanType(loanType, pkg);
      if (forced && loanType !== "ground_up" && loanType !== "new_construction") {
        next.ground_up_force =
          groundUpForceReason(pkg) ??
          "Select Ground-Up Construction or New Construction for this scope.";
      }
    }
    return next;
  }

  function goNext() {
    const hard = validateHard(step);
    setErrors(hard);
    if (Object.keys(hard).length) return;

    const idx = visibleSteps.findIndex((s) => s.id === step);
    const next = visibleSteps[idx + 1];
    if (next) setStep(next.id);
  }

  function goBack() {
    const idx = visibleSteps.findIndex((s) => s.id === step);
    const prev = visibleSteps[idx - 1];
    if (prev) setStep(prev.id);
  }

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

  function submit() {
    const hard = {
      ...validateHard(1),
      ...validateHard(2),
      ...validateHard(3),
    };
    setErrors(hard);
    if (Object.keys(hard).length) {
      if (hard.first_name || hard.last_name || hard.email || hard.cell_phone || hard.business_purpose) {
        setStep(1);
      } else if (hard.address) {
        setStep(2);
      } else {
        setStep(3);
      }
      return;
    }

    setSubmitting(true);
    try {
      const validDocs = pendingDocs.filter((d) => !d.error);
      const finalPkg: ApplicationPackage = applyGroundUpLoanRequestFlags({
        ...pkg,
        construction_budget: showBudget
          ? pkg.construction_budget ?? emptyConstructionBudget()
          : pkg.construction_budget,
        contractor: showContractor ? pkg.contractor ?? emptyContractor() : null,
        co_borrower: pkg.has_co_borrower ? pkg.co_borrower ?? emptyBorrowerParty() : null,
      });
      const finalLoanType =
        resolveForcedGroundUpLoanType(loanType, finalPkg) ?? loanType;
      const fullName = displayName(finalPkg.borrower);
      const purchase = parseMoney(finalPkg.loan_request.purchase_price);
      const arv =
        parseMoney(finalPkg.loan_request.estimated_arv) ??
        parseMoney(finalPkg.strategy.estimated_arv);

      const { application, user } = createApplication({
        property_address: finalPkg.subject_property.address,
        property_city: finalPkg.subject_property.city || "—",
        property_state: finalPkg.subject_property.state || "NV",
        property_postal: finalPkg.subject_property.postal || "00000",
        property_type: finalPkg.subject_property.property_type || undefined,
        full_name: fullName,
        email: finalPkg.borrower.email,
        phone: finalPkg.borrower.cell_phone,
        entity_name:
          finalPkg.vesting.vesting_in === "entity"
            ? finalPkg.vesting.entity_name || undefined
            : undefined,
        loan_type: finalLoanType,
        loan_amount: parseMoney(finalPkg.loan_request.loan_amount) ?? 0,
        purchase_price: purchase,
        estimated_arv: arv,
        notes: finalPkg.notes || undefined,
        attribution_source_id: "direct_apply",
        prior_application_id: priorApplicationId || null,
        documents: validDocs.map(({ file_name, doc_type, file_size_bytes, mime_type }) => ({
          file_name,
          doc_type,
          file_size_bytes,
          mime_type,
        })),
        package: finalPkg,
      });

      const completeness = getPackageCompleteness(
        finalPkg,
        loanType,
        validDocs.map((d) => d.doc_type),
      );

      setResult({
        referenceCode: application.reference_code,
        applicationId: application.id,
        email: user.email,
        missingLabels: completeness.missing.map((m) => m.label),
        packageComplete: application.package_complete,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
        <p className="text-[0.875rem] font-semibold text-green">Application submitted</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Your file is on the record.
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
          Portal access was created for{" "}
          <span className="font-medium text-charcoal">{result.email}</span>. Status, documents, and
          package follow-up live in the borrower workspace.
        </p>
        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Reference</dt>
            <dd className="font-mono text-charcoal">{result.referenceCode}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Package</dt>
            <dd className="text-charcoal">
              {result.packageComplete ? "Complete" : `${result.missingLabels.length} items to follow up`}
            </dd>
          </div>
        </dl>
        {!result.packageComplete && result.missingLabels.length > 0 ? (
          <div className="mt-6 rounded-[1.5rem] bg-paper/80 px-5 py-4">
            <p className="text-[0.9375rem] font-semibold text-ink">Missing for package completeness</p>
            <ul className="mt-3 max-h-48 space-y-1.5 overflow-y-auto text-[0.875rem] text-charcoal">
              {result.missingLabels.slice(0, 12).map((label) => (
                <li key={label}>· {label}</li>
              ))}
              {result.missingLabels.length > 12 ? (
                <li className="text-steel">
                  · +{result.missingLabels.length - 12} more in the portal
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/portal/borrower" shine>
            Open borrower portal
          </Button>
          <Button href="/login" variant="secondary">
            Client login
          </Button>
        </div>
        <p className="mt-6 text-[0.875rem] text-steel">
          Mock layer only — submissions persist in this browser via localStorage.
        </p>
      </div>
    );
  }

  const stepMeta = visibleSteps.find((s) => s.id === step) ?? visibleSteps[0];
  const stepIndex = visibleSteps.findIndex((s) => s.id === step) + 1;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
      <div className="mb-8">
        <ol className="flex flex-wrap items-center gap-2" aria-label="Application progress">
          {visibleSteps.map((s, i) => {
            const active = step === s.id;
            const done = stepIndex > i + 1;
            return (
              <li key={s.id} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.8125rem] font-semibold ${
                    active
                      ? "bg-green text-white"
                      : done
                        ? "bg-green-soft text-green"
                        : "bg-paper text-steel"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {i + 1}
                </span>
                <span
                  className={`hidden text-[0.8125rem] font-medium lg:inline ${
                    active ? "text-ink" : "text-steel"
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[0.875rem] text-steel">
          Step {stepIndex} of {visibleSteps.length} — {stepMeta.label}
        </p>
        <p className={hintClass}>
          Only borrower name, email, phone, subject address, loan type, loan amount, and business
          purpose attestation are required to submit. Everything else is soft-collected for package
          completeness.
        </p>
      </div>

      {priorApplicationId ? (
        <p className="mb-6 rounded-2xl bg-green-mist px-4 py-3 text-[0.9375rem] text-charcoal">
          Starting a new application linked to prior file{" "}
          <span className="font-mono text-[0.875rem]">{priorApplicationId}</span>.
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const idx = visibleSteps.findIndex((s) => s.id === step);
          if (idx < visibleSteps.length - 1) {
            goNext();
            return;
          }
          submit();
        }}
        noValidate
      >
        {step === 1 ? (
          <div className="space-y-8">
            <div>
              <h2 className={sectionTitleClass}>Borrower</h2>
              <div className="mt-4">
                <PartyFields
                  idPrefix="borrower"
                  party={pkg.borrower}
                  hardRequired
                  errors={errors}
                  onChange={(borrower) => patchPkg((prev) => ({ ...prev, borrower }))}
                />
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-[1.5rem] bg-green-mist px-4 py-4 text-[0.9375rem] text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                checked={pkg.business_purpose_attested}
                onChange={(e) =>
                  patchPkg((prev) => ({
                    ...prev,
                    business_purpose_attested: e.target.checked,
                  }))
                }
              />
              <span>{BUSINESS_PURPOSE_ATTESTATION}</span>
            </label>
            {errors.business_purpose ? (
              <p className={errorClass}>{errors.business_purpose}</p>
            ) : null}
            <label className="flex items-start gap-3 rounded-[1.5rem] border border-line px-4 py-4 text-[0.9375rem] text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                checked={pkg.ecoa_appraisal_acknowledged}
                onChange={(e) =>
                  patchPkg((prev) => ({
                    ...prev,
                    ecoa_appraisal_acknowledged: e.target.checked,
                  }))
                }
              />
              <span>{ECOA_APPRAISAL_ATTESTATION}</span>
            </label>
            <label className="flex items-start gap-3 rounded-[1.5rem] border border-line px-4 py-4 text-[0.9375rem] text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                checked={pkg.credit_authorization_acknowledged}
                onChange={(e) =>
                  patchPkg((prev) => ({
                    ...prev,
                    credit_authorization_acknowledged: e.target.checked,
                  }))
                }
              />
              <span>{CREDIT_AUTHORIZATION_ATTESTATION}</span>
            </label>
            <div>
              <h2 className={sectionTitleClass}>Declarations</h2>
              <div className="mt-4">
                <DeclarationsFields
                  declarations={pkg.declarations}
                  onChange={(declarations) => patchPkg((prev) => ({ ...prev, declarations }))}
                />
              </div>
            </div>
            <label className="flex items-start gap-3 text-[0.9375rem] text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                checked={pkg.has_co_borrower}
                onChange={(e) =>
                  patchPkg((prev) => ({
                    ...prev,
                    has_co_borrower: e.target.checked,
                    co_borrower: e.target.checked
                      ? prev.co_borrower ?? emptyBorrowerParty()
                      : null,
                  }))
                }
              />
              <span>Add a co-borrower (optional)</span>
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
        ) : null}

        {step === 2 ? (
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>Subject property</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="subject_address" className={labelClass}>
                  Street address
                </label>
                <input
                  id="subject_address"
                  className={fieldClass}
                  value={pkg.subject_property.address}
                  onChange={(e) => patchSubject({ address: e.target.value })}
                  autoComplete="street-address"
                />
                {errors.address ? <p className={errorClass}>{errors.address}</p> : null}
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={fieldClass}
                  value={pkg.subject_property.city}
                  onChange={(e) => patchSubject({ city: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  list="vfs-starter-states"
                  className={fieldClass}
                  value={pkg.subject_property.state}
                  onChange={(e) => patchSubject({ state: e.target.value })}
                />
                <datalist id="vfs-starter-states">
                  {starterStates.map((s) => (
                    <option key={s.abbr} value={s.abbr}>
                      {s.name}
                    </option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className={labelClass}>Postal code</label>
                <input
                  className={fieldClass}
                  value={pkg.subject_property.postal}
                  onChange={(e) => patchSubject({ postal: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Property type</label>
                <select
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
                <label className={labelClass}>Number of units</label>
                <input
                  className={fieldClass}
                  value={pkg.subject_property.number_of_units}
                  onChange={(e) => patchSubject({ number_of_units: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Occupancy</label>
                <select
                  className={fieldClass}
                  value={pkg.subject_property.occupancy}
                  onChange={(e) =>
                    patchSubject({
                      occupancy: e.target.value as SubjectPropertyInfo["occupancy"],
                    })
                  }
                >
                  <option value="">Select…</option>
                  <option value="leased">Leased</option>
                  <option value="vacant">Vacant</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Estate held in</label>
                <select
                  className={fieldClass}
                  value={pkg.subject_property.estate_held}
                  onChange={(e) =>
                    patchSubject({
                      estate_held: e.target.value as SubjectPropertyInfo["estate_held"],
                    })
                  }
                >
                  <option value="">Select…</option>
                  <option value="fee_simple">Fee simple</option>
                  <option value="leasehold">Leasehold</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Construction method</label>
                <select
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
                <label className={labelClass}>Cross collateralization?</label>
                <select
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
                  <label className={labelClass}>Cross-collateral property count</label>
                  <input
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
        ) : null}

        {step === 3 ? (
          <div className="space-y-8">
            <div>
              <h2 className={sectionTitleClass}>Loan request</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Loan type</label>
                  <select
                    className={fieldClass}
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value as LoanType)}
                  >
                    {loanTypes.map((t) => (
                      <option key={t} value={t}>
                        {loanTypeLabels[t]}
                      </option>
                    ))}
                  </select>
                  {errors.loan_type ? <p className={errorClass}>{errors.loan_type}</p> : null}
                  {errors.ground_up_force ? (
                    <p className={errorClass}>{errors.ground_up_force}</p>
                  ) : null}
                  {loanTypeAutoNote ? (
                    <p className={`${hintClass} text-green`}>{loanTypeAutoNote}</p>
                  ) : (
                    <p className={hintClass}>
                      New Construction is separate from Ground-Up Construction. Level 5 /
                      ground-up scope auto-switches loan type when needed.
                    </p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>Transaction type</label>
                  <select
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
                <div>
                  <label className={labelClass}>Loan amount</label>
                  <input
                    className={fieldClass}
                    inputMode="decimal"
                    value={pkg.loan_request.loan_amount}
                    onChange={(e) => patchLoan({ loan_amount: e.target.value })}
                  />
                  {errors.loan_amount ? <p className={errorClass}>{errors.loan_amount}</p> : null}
                </div>
                <div>
                  <label className={labelClass}>Loan term (years)</label>
                  <select
                    className={fieldClass}
                    value={pkg.loan_request.loan_term_years}
                    onChange={(e) =>
                      patchLoan({
                        loan_term_years: e.target.value as LoanRequestInfo["loan_term_years"],
                      })
                    }
                  >
                    <option value="">Select…</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Purchase price</label>
                  <input
                    className={fieldClass}
                    value={pkg.loan_request.purchase_price}
                    onChange={(e) => patchLoan({ purchase_price: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estimated property value</label>
                  <input
                    className={fieldClass}
                    value={pkg.loan_request.estimated_property_value}
                    onChange={(e) => patchLoan({ estimated_property_value: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Requesting rehab financing?</label>
                  <select
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
                  <label className={labelClass}>Ground up?</label>
                  <select
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
                        requesting_ground_up:
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
                  <label className={labelClass}>Budget amount</label>
                  <input
                    className={fieldClass}
                    value={pkg.loan_request.budget_amount}
                    onChange={(e) => patchLoan({ budget_amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Estimated ARV</label>
                  <input
                    className={fieldClass}
                    value={pkg.loan_request.estimated_arv}
                    onChange={(e) => patchLoan({ estimated_arv: e.target.value })}
                  />
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
                      <label className={labelClass}>{label}</label>
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
                  <label className={labelClass}>Vesting in</label>
                  <select
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
                      <label className={labelClass}>Entity name</label>
                      <input
                        className={fieldClass}
                        value={pkg.vesting.entity_name}
                        onChange={(e) => patchVesting({ entity_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Entity type</label>
                      <select
                        className={fieldClass}
                        value={pkg.vesting.entity_type}
                        onChange={(e) =>
                          patchVesting({
                            entity_type: e.target.value as VestingInfo["entity_type"],
                          })
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
                      <label className={labelClass}>Entity state</label>
                      <input
                        className={fieldClass}
                        value={pkg.vesting.entity_state}
                        onChange={(e) => patchVesting({ entity_state: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>EIN</label>
                      <input
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
        ) : null}

        {step === 4 ? (
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
        ) : null}

        {step === 5 ? (
          <div className="space-y-6">
            <h2 className={sectionTitleClass}>Strategy &amp; exit</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Plan for property</label>
                <select
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
                <label className={labelClass}>Anticipated hold (months)</label>
                <input
                  className={fieldClass}
                  value={pkg.strategy.anticipated_hold_months}
                  onChange={(e) => patchStrategy({ anticipated_hold_months: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Projected monthly rent</label>
                <input
                  className={fieldClass}
                  value={pkg.strategy.projected_monthly_rent}
                  onChange={(e) => patchStrategy({ projected_monthly_rent: e.target.value })}
                />
              </div>
              {pkg.strategy.plan_for_property === "rental" ? (
                <>
                  <div>
                    <label className={labelClass}>Plan to increase rents?</label>
                    <select
                      className={fieldClass}
                      value={
                        pkg.strategy.plan_increase_rents === null
                          ? ""
                          : pkg.strategy.plan_increase_rents
                            ? "yes"
                            : "no"
                      }
                      onChange={(e) =>
                        patchStrategy({
                          plan_increase_rents:
                            e.target.value === "" ? null : e.target.value === "yes",
                        })
                      }
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {pkg.strategy.plan_increase_rents ? (
                    <div>
                      <label className={labelClass}>Future monthly rent</label>
                      <input
                        className={fieldClass}
                        value={pkg.strategy.future_monthly_rent}
                        onChange={(e) => patchStrategy({ future_monthly_rent: e.target.value })}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
              <div>
                <label className={labelClass}>Rehab or upgrade?</label>
                <select
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
                    <label className={labelClass}>Estimated rehab / construction cost</label>
                    <input
                      className={fieldClass}
                      value={pkg.strategy.estimated_rehab_cost}
                      onChange={(e) => patchStrategy({ estimated_rehab_cost: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Estimated ARV</label>
                    <input
                      className={fieldClass}
                      value={pkg.strategy.estimated_arv}
                      onChange={(e) => patchStrategy({ estimated_arv: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Adding square footage?</label>
                    <select
                      className={fieldClass}
                      value={
                        pkg.strategy.adding_square_footage === null
                          ? ""
                          : pkg.strategy.adding_square_footage
                            ? "yes"
                            : "no"
                      }
                      onChange={(e) =>
                        patchStrategy({
                          adding_square_footage:
                            e.target.value === "" ? null : e.target.value === "yes",
                        })
                      }
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {pkg.strategy.adding_square_footage ? (
                    <div>
                      <label className={labelClass}>Added square footage</label>
                      <input
                        className={fieldClass}
                        value={pkg.strategy.added_square_footage}
                        onChange={(e) => patchStrategy({ added_square_footage: e.target.value })}
                      />
                    </div>
                  ) : null}
                  <div className="sm:col-span-2">
                    <label className={labelClass}>
                      Expanding existing structure by 50%+?
                    </label>
                    <select
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
                    {pkg.strategy.expands_structure_50_percent ? (
                      <p className={`${hintClass} text-green`}>
                        50%+ expansion is treated as ground up. Loan type auto-switches to
                        Ground-Up Construction (New Construction kept if already selected).
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label className={labelClass}>Has work already begun?</label>
                    <select
                      className={fieldClass}
                      value={
                        pkg.strategy.work_already_begun === null
                          ? ""
                          : pkg.strategy.work_already_begun
                            ? "yes"
                            : "no"
                      }
                      onChange={(e) =>
                        patchStrategy({
                          work_already_begun:
                            e.target.value === "" ? null : e.target.value === "yes",
                        })
                      }
                    >
                      <option value="">Select…</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Scope of work</label>
                    <textarea
                      className={`${fieldClass} resize-y`}
                      rows={3}
                      value={pkg.strategy.scope_of_work}
                      onChange={(e) => patchStrategy({ scope_of_work: e.target.value })}
                      placeholder="Itemized scope summary; attach budget if costs exceed $10,000"
                    />
                  </div>
                </>
              ) : null}
              <div className="sm:col-span-2">
                <label className={labelClass}>Investment strategy</label>
                <textarea
                  className={`${fieldClass} resize-y`}
                  rows={3}
                  value={pkg.strategy.investment_strategy}
                  onChange={(e) => patchStrategy({ investment_strategy: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Exit strategy</label>
                <select
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
                <label className={labelClass}>Plan to repay this loan</label>
                <input
                  className={fieldClass}
                  value={pkg.strategy.exit_strategy_detail}
                  onChange={(e) => patchStrategy({ exit_strategy_detail: e.target.value })}
                />
              </div>
              {pkg.loan_request.transaction_type === "cash_out_refinance" ? (
                <div className="sm:col-span-2">
                  <label className={labelClass}>Cash-out proceeds use</label>
                  <input
                    className={fieldClass}
                    value={pkg.strategy.cash_out_proceeds_use}
                    onChange={(e) => patchStrategy({ cash_out_proceeds_use: e.target.value })}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 6 ? (
          <TrackRecordEditor
            rows={pkg.track_record}
            onChange={(track_record) => patchPkg((prev) => ({ ...prev, track_record }))}
          />
        ) : null}

        {step === 7 ? (
          <SreoEditor
            rows={pkg.sreo}
            onChange={(sreo) => patchPkg((prev) => ({ ...prev, sreo }))}
          />
        ) : null}

        {step === 8 && showBudget ? (
          <ConstructionBudgetEditor
            budget={pkg.construction_budget ?? emptyConstructionBudget()}
            onChange={(construction_budget) =>
              patchPkg((prev) => ({ ...prev, construction_budget }))
            }
          />
        ) : null}

        {step === 9 && showContractor && pkg.contractor ? (
          <ContractorFields
            contractor={pkg.contractor}
            onChange={(contractor) => patchPkg((prev) => ({ ...prev, contractor }))}
          />
        ) : null}

        {step === 10 ? (
          <div className="space-y-6">
            <p className="text-[0.9375rem] leading-relaxed text-steel">
              Upload is mocked. Files stay in this browser session as metadata — skip and add later
              in the portal if needed.
            </p>
            <div>
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
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
              <label htmlFor="default_doc_type" className={labelClass}>
                Document category for next upload
              </label>
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
                        {docTypeLabels[doc.doc_type] ?? doc.doc_type} ·{" "}
                        {formatBytes(doc.file_size_bytes)}
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
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            {stepIndex > 1 ? (
              <Button type="button" variant="secondary" onClick={goBack}>
                Back
              </Button>
            ) : (
              <Link href="/" className="text-[0.9375rem] font-medium text-steel hover:text-ink">
                Cancel
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {stepIndex < visibleSteps.length ? (
              <Button type="submit">Continue</Button>
            ) : (
              <Button type="submit" shine disabled={submitting}>
                {submitting ? "Submitting…" : "Submit application"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
