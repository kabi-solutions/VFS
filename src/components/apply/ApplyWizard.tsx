"use client";

/* eslint-disable react-hooks/set-state-in-effect -- draft hydrate + ground-up loan sync */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ApplyProgress, type ApplyPhase } from "@/components/apply/ApplyProgress";
import {
  DealContactPanel,
  DealLoanPanel,
  DealPropertyPanel,
  PackageBudgetPanel,
  PackageContractorPanel,
  PackageDocumentsPanel,
  PackageSreoPanel,
  PackageTrackPanel,
  ProfileBorrowerPanel,
  ProfileContactsPanel,
  ProfileDeclarationsPanel,
  ProfilePropertyDetailPanel,
  ProfileStrategyPanel,
  type HardErrors,
} from "@/components/apply/ApplyPhasePanels";
import { PackageMeter } from "@/components/apply/PackageMeter";
import { needsContractorPackage } from "@/components/apply/ContractorFields";
import { formCardClass, formCardWideClass, stickyFooterClass } from "@/components/apply/fieldStyles";
import { Button } from "@/components/ui/Button";
import {
  applyDraftStore,
  draftSubjectLabel,
  type ApplyDraft,
} from "@/lib/apply/draft-store";
import {
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
  type CompletenessItem,
  type LoanRequestInfo,
  type StrategyInfo,
  type SubjectPropertyInfo,
  type VestingInfo,
} from "@/lib/apply/package";
import { createApplication } from "@/lib/data/applications";
import type { LoanType } from "@/lib/types/database";
import {
  isLoanType,
  timelineToHoldMonths,
  type ApplyPrefill,
} from "@/lib/config/apply-prefill";

type PendingDoc = {
  localId: string;
  file_name: string;
  doc_type: string;
  file_size_bytes: number;
  mime_type: string | null;
  error?: string;
};
type PhaseId = "deal" | "profile" | "package";
type Location = { phaseId: PhaseId; subStepId: string };

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? null : n;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatSavedAt(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
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

function buildPhases(showBudget: boolean, showContractor: boolean): ApplyPhase[] {
  const packageSteps = [
    { id: "track", label: "Track record" },
    { id: "sreo", label: "SREO" },
    ...(showBudget ? [{ id: "budget", label: "Budget" }] : []),
    ...(showContractor ? [{ id: "contractor", label: "Contractor" }] : []),
    { id: "documents", label: "Documents" },
  ];
  return [
    {
      id: "deal",
      label: "Your deal",
      estimate: "~2 minutes",
      subSteps: [
        { id: "property", label: "Property" },
        { id: "loan", label: "Loan" },
        { id: "contact", label: "Contact" },
      ],
    },
    {
      id: "profile",
      label: "Your profile",
      estimate: "Complete in portal anytime",
      subSteps: [
        { id: "borrower", label: "Borrower" },
        { id: "declarations", label: "Declarations" },
        { id: "details", label: "Property & loan detail" },
        { id: "contacts", label: "Contacts" },
        { id: "strategy", label: "Strategy" },
      ],
    },
    {
      id: "package",
      label: "Your package",
      estimate: "Complete in portal anytime",
      subSteps: packageSteps,
    },
  ];
}

function flatPath(phases: ApplyPhase[]): Location[] {
  return phases.flatMap((p) => p.subSteps.map((s) => ({ phaseId: p.id, subStepId: s.id })));
}

function jumpTargetForItem(item: CompletenessItem): Location {
  const id = item.id;
  if (id.startsWith("borrower") || id.startsWith("co_borrower")) {
    return { phaseId: "profile", subStepId: "borrower" };
  }
  if (id.startsWith("decl") || id.includes("ecoa") || id.includes("credit")) {
    return { phaseId: "profile", subStepId: "declarations" };
  }
  if (id.startsWith("subject.") || id.startsWith("loan.") || id.startsWith("vesting")) {
    return { phaseId: "profile", subStepId: "details" };
  }
  if (id.startsWith("interior") || id.startsWith("escrow") || id.startsWith("insurance")) {
    return { phaseId: "profile", subStepId: "contacts" };
  }
  if (id.startsWith("strategy")) return { phaseId: "profile", subStepId: "strategy" };
  if (id.startsWith("track")) return { phaseId: "package", subStepId: "track" };
  if (id.startsWith("sreo")) return { phaseId: "package", subStepId: "sreo" };
  if (id.startsWith("budget") || id.startsWith("construction")) {
    return { phaseId: "package", subStepId: "budget" };
  }
  if (id.startsWith("contractor")) return { phaseId: "package", subStepId: "contractor" };
  if (id.startsWith("doc.")) return { phaseId: "package", subStepId: "documents" };
  return { phaseId: "profile", subStepId: "borrower" };
}

export function ApplyWizard({
  priorApplicationId,
  prefill,
}: {
  priorApplicationId?: string;
  prefill?: ApplyPrefill;
}) {
  const formTopRef = useRef<HTMLDivElement>(null);
  const [bootstrapped, setBootstrapped] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<ApplyDraft | null>(null);
  const [draftId, setDraftId] = useState<string>("");
  const [location, setLocation] = useState<Location>({
    phaseId: "deal",
    subStepId: "property",
  });
  const [pkg, setPkg] = useState<ApplicationPackage>(() => buildPrefillPackage(prefill));
  const [loanType, setLoanType] = useState<LoanType>(() =>
    isLoanType(prefill?.loanType) ? prefill.loanType : "rehab_fix_flip",
  );
  const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [defaultDocType, setDefaultDocType] = useState("other");
  const [errors, setErrors] = useState<HardErrors>({});
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [portalPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
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

  const phases = useMemo(
    () => buildPhases(showBudget, showContractor),
    [showBudget, showContractor],
  );
  const path = useMemo(() => flatPath(phases), [phases]);
  const pathIndex = Math.max(
    0,
    path.findIndex((p) => p.phaseId === location.phaseId && p.subStepId === location.subStepId),
  );
  const isWide =
    location.phaseId === "package" &&
    (location.subStepId === "sreo" ||
      location.subStepId === "budget" ||
      location.subStepId === "track");

  useEffect(() => {
    const activeId = applyDraftStore.getActiveId();
    const existing = activeId ? applyDraftStore.get(activeId) : null;
    if (existing) {
      setResumePrompt(existing);
      setDraftId(existing.id);
    } else {
      setDraftId(applyDraftStore.createId());
    }
    setBootstrapped(true);
  }, []);

  const forcedLoanType = resolveForcedGroundUpLoanType(loanType, pkg);
  const loanTypeAutoNote = forcedLoanType ? groundUpForceReason(pkg) : null;

  useEffect(() => {
    if (!forcedLoanType || forcedLoanType === loanType) return;
    // Keep select in sync when package scope requires ground-up / new construction.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived force from package scope
    setLoanType(forcedLoanType);
  }, [forcedLoanType, loanType]);

  function persistDraft(
    nextPkg = pkg,
    nextLoan = loanType,
    nextLoc = location,
    nextDocs = pendingDocs,
    id = draftId,
  ) {
    if (!id) return;
    const draft: ApplyDraft = {
      id,
      updatedAt: new Date().toISOString(),
      location: nextLoc,
      loanType: nextLoan,
      package: nextPkg,
      pendingDocs: nextDocs.map(({ localId, file_name, doc_type, file_size_bytes, mime_type }) => ({
        localId,
        file_name,
        doc_type,
        file_size_bytes,
        mime_type: mime_type ?? null,
      })),
    };
    applyDraftStore.save(draft);
    setSavedAt(draft.updatedAt);
  }

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

  function validateHard(): HardErrors {
    const next: HardErrors = {};
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
    if (!pkg.subject_property.address.trim() || pkg.subject_property.address.trim().length < 3) {
      next.address = "Enter the subject property street address.";
    }
    if (!loanType) next.loan_type = "Select a loan type.";
    const amount = parseMoney(pkg.loan_request.loan_amount);
    if (amount == null || amount <= 0) next.loan_amount = "Enter a valid loan amount.";
    const forced = resolveForcedGroundUpLoanType(loanType, pkg);
    if (forced && loanType !== "ground_up" && loanType !== "new_construction") {
      next.ground_up_force =
        groundUpForceReason(pkg) ??
        "Select Ground-Up Construction or New Construction for this scope.";
    }
    return next;
  }

  function validateCurrentSoft(): HardErrors {
    const next: HardErrors = {};
    if (location.phaseId === "deal" && location.subStepId === "property") {
      if (!pkg.subject_property.address.trim() || pkg.subject_property.address.trim().length < 3) {
        next.address = "Enter the subject property street address.";
      }
    }
    if (location.phaseId === "deal" && location.subStepId === "loan") {
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
    if (location.phaseId === "deal" && location.subStepId === "contact") {
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
    return next;
  }

  function focusFirstInvalid(hard: HardErrors) {
    const order = [
      "address",
      "loan_type",
      "loan_amount",
      "ground_up_force",
      "first_name",
      "last_name",
      "email",
      "cell_phone",
      "business_purpose",
    ] as const;
    const first = order.find((k) => hard[k]);
    if (!first) return;
    const idMap: Record<string, string> = {
      address: "subject_address",
      loan_type: "loan_type",
      loan_amount: "loan_amount",
      first_name: "borrower-first",
      last_name: "borrower-last",
      email: "borrower-email",
      cell_phone: "borrower-phone",
    };
    const elId = idMap[first];
    if (elId) {
      const el = document.getElementById(elId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      if (el && "focus" in el) (el as HTMLElement).focus();
    } else {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function goTo(next: Location) {
    persistDraft(pkg, loanType, next, pendingDocs);
    setLocation(next);
    setErrorSummary(null);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goNext() {
    const hard = validateCurrentSoft();
    setErrors(hard);
    if (Object.keys(hard).length) {
      setErrorSummary(
        `${Object.keys(hard).length} item${Object.keys(hard).length === 1 ? "" : "s"} need attention before continuing.`,
      );
      focusFirstInvalid(hard);
      return;
    }
    setErrorSummary(null);
    const next = path[pathIndex + 1];
    if (next) goTo(next);
  }

  function goBack() {
    const prev = path[pathIndex - 1];
    if (prev) goTo(prev);
  }

  async function submit() {
    const hard = validateHard();
    setErrors(hard);
    if (Object.keys(hard).length) {
      setErrorSummary(
        `${Object.keys(hard).length} required item${Object.keys(hard).length === 1 ? "" : "s"} missing.`,
      );
      if (hard.address) goTo({ phaseId: "deal", subStepId: "property" });
      else if (hard.loan_type || hard.loan_amount || hard.ground_up_force) {
        goTo({ phaseId: "deal", subStepId: "loan" });
      } else {
        goTo({ phaseId: "deal", subStepId: "contact" });
      }
      focusFirstInvalid(hard);
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
      const finalLoanType = resolveForcedGroundUpLoanType(loanType, finalPkg) ?? loanType;
      const fullName = displayName(finalPkg.borrower);
      const purchase = parseMoney(finalPkg.loan_request.purchase_price);
      const arv =
        parseMoney(finalPkg.loan_request.estimated_arv) ??
        parseMoney(finalPkg.strategy.estimated_arv);

      setSubmitError(null);
      const { application, user } = await createApplication({
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
          mime_type: mime_type ?? null,
        })),
        package: finalPkg,
        password: portalPassword.trim() || undefined,
        // Always establish a portal session after submit (server generates a password if needed).
        establishSession: true,
      });

      const completeness = getPackageCompleteness(
        finalPkg,
        loanType,
        validDocs.map((d) => d.doc_type),
      );

      applyDraftStore.remove(draftId);
      setResult({
        referenceCode: application.reference_code,
        applicationId: application.id,
        email: user.email,
        missingLabels: completeness.missing.map((m) => m.label),
        packageComplete: application.package_complete,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  function resumeDraft(draft: ApplyDraft) {
    setDraftId(draft.id);
    setPkg(draft.package);
    setLoanType(draft.loanType);
    setLocation(draft.location);
    setPendingDocs(draft.pendingDocs.map((d) => ({ ...d })));
    setSavedAt(draft.updatedAt);
    applyDraftStore.setActiveId(draft.id);
    setResumePrompt(null);
  }

  function startFresh() {
    if (resumePrompt) applyDraftStore.remove(resumePrompt.id);
    const id = applyDraftStore.createId();
    setDraftId(id);
    setPkg(buildPrefillPackage(prefill));
    setLoanType(isLoanType(prefill?.loanType) ? prefill.loanType : "rehab_fix_flip");
    setLocation({ phaseId: "deal", subStepId: "property" });
    setPendingDocs([]);
    setSavedAt(null);
    applyDraftStore.setActiveId(id);
    setResumePrompt(null);
  }

  function onBlurSave() {
    if (!bootstrapped || resumePrompt || result) return;
    persistDraft();
    const soft = validateCurrentSoft();
    if (Object.keys(soft).length) setErrors((prev) => ({ ...prev, ...soft }));
  }

  if (!bootstrapped) {
    return (
      <div className={`${formCardClass} min-h-[12rem] animate-pulse bg-white/80`} aria-hidden />
    );
  }

  if (resumePrompt) {
    return (
      <div className={formCardClass}>
        <p className="text-[0.875rem] font-semibold text-green">Welcome back</p>
        <h2 className="headline-md mt-3 text-ink">Resume your application</h2>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-steel">
          We found a saved draft for{" "}
          <span className="font-medium text-charcoal">{draftSubjectLabel(resumePrompt)}</span>
          {resumePrompt.updatedAt ? (
            <>
              {" "}
              (saved{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(resumePrompt.updatedAt))}
              )
            </>
          ) : null}
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" shine onClick={() => resumeDraft(resumePrompt)}>
            Resume your application
          </Button>
          <Button type="button" variant="secondary" onClick={startFresh}>
            Start a new one
          </Button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className={formCardClass}>
        <p className="text-[0.875rem] font-semibold text-green">Application submitted</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Your file is on the record.
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
          Portal access was created for{" "}
          <span className="font-medium text-charcoal">{result.email}</span>. Finish your package in
          the borrower workspace — we will show what is still missing.
        </p>
        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Reference</dt>
            <dd className="font-mono text-charcoal">{result.referenceCode}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Package</dt>
            <dd className="text-charcoal">
              {result.packageComplete
                ? "Complete"
                : `${result.missingLabels.length} items to follow up`}
            </dd>
          </div>
        </dl>
        {!result.packageComplete && result.missingLabels.length > 0 ? (
          <div className="mt-6 rounded-[1.5rem] bg-paper/80 px-5 py-4">
            <p className="text-[0.9375rem] font-semibold text-ink">
              Missing for package completeness
            </p>
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
          <Button href={`/portal/borrower/applications/${result.applicationId}`} shine>
            Open my portal
          </Button>
          <Button href="/login" variant="secondary">
            Client login
          </Button>
        </div>
      </div>
    );
  }

  const atDealContact = location.phaseId === "deal" && location.subStepId === "contact";
  const showMeter = location.phaseId === "profile" || location.phaseId === "package";
  const shared = {
    pkg,
    loanType,
    loanTypeAutoNote,
    errors,
    patchPkg,
    patchSubject,
    patchLoan,
    patchVesting,
    patchStrategy,
    setLoanType,
    onBlurHard: onBlurSave,
  };

  return (
    <div className={isWide ? formCardWideClass : formCardClass} ref={formTopRef}>
      <ApplyProgress
        phases={phases}
        activePhaseId={location.phaseId}
        activeSubStepId={location.subStepId}
        onSelectPhase={(phaseId) => {
          const phase = phases.find((p) => p.id === phaseId);
          if (phase?.subSteps[0]) goTo({ phaseId, subStepId: phase.subSteps[0].id });
        }}
        onSelectSubStep={(phaseId, subStepId) => goTo({ phaseId, subStepId })}
      />

      {priorApplicationId ? (
        <p className="mt-6 rounded-2xl bg-green-mist px-4 py-3 text-[0.9375rem] text-charcoal">
          Starting a new application linked to prior file{" "}
          <span className="font-mono text-[0.875rem]">{priorApplicationId}</span>.
        </p>
      ) : null}

      {showMeter ? (
        <PackageMeter
          className="mt-6"
          pkg={pkg}
          loanType={loanType}
          docTypes={pendingDocs.filter((d) => !d.error).map((d) => d.doc_type)}
          onJump={(item) => goTo(jumpTargetForItem(item))}
        />
      ) : null}

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {errorSummary}
      </div>
      {errorSummary ? (
        <p
          className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.9375rem] text-red-700"
          role="alert"
        >
          {errorSummary}
        </p>
      ) : null}

      <form
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (atDealContact) {
            submit();
            return;
          }
          if (pathIndex < path.length - 1) {
            goNext();
            return;
          }
          submit();
        }}
        noValidate
      >
        {location.phaseId === "deal" && location.subStepId === "property" ? (
          <DealPropertyPanel {...shared} />
        ) : null}
        {location.phaseId === "deal" && location.subStepId === "loan" ? (
          <DealLoanPanel {...shared} />
        ) : null}
        {location.phaseId === "deal" && location.subStepId === "contact" ? (
          <DealContactPanel {...shared} />
        ) : null}
        {location.phaseId === "profile" && location.subStepId === "borrower" ? (
          <ProfileBorrowerPanel {...shared} />
        ) : null}
        {location.phaseId === "profile" && location.subStepId === "declarations" ? (
          <ProfileDeclarationsPanel {...shared} />
        ) : null}
        {location.phaseId === "profile" && location.subStepId === "details" ? (
          <ProfilePropertyDetailPanel {...shared} />
        ) : null}
        {location.phaseId === "profile" && location.subStepId === "contacts" ? (
          <ProfileContactsPanel {...shared} />
        ) : null}
        {location.phaseId === "profile" && location.subStepId === "strategy" ? (
          <ProfileStrategyPanel {...shared} />
        ) : null}
        {location.phaseId === "package" && location.subStepId === "track" ? (
          <PackageTrackPanel {...shared} />
        ) : null}
        {location.phaseId === "package" && location.subStepId === "sreo" ? (
          <PackageSreoPanel {...shared} />
        ) : null}
        {location.phaseId === "package" && location.subStepId === "budget" && showBudget ? (
          <PackageBudgetPanel {...shared} />
        ) : null}
        {location.phaseId === "package" &&
        location.subStepId === "contractor" &&
        showContractor ? (
          <PackageContractorPanel {...shared} />
        ) : null}
        {location.phaseId === "package" && location.subStepId === "documents" ? (
          <PackageDocumentsPanel
            pkg={pkg}
            patchPkg={patchPkg}
            pendingDocs={pendingDocs}
            setPendingDocs={setPendingDocs}
            defaultDocType={defaultDocType}
            setDefaultDocType={setDefaultDocType}
            dragOver={dragOver}
            setDragOver={setDragOver}
          />
        ) : null}

        <div className={stickyFooterClass}>
          {submitError ? (
            <p className="mb-3 text-[0.9375rem] font-medium text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {pathIndex > 0 ? (
                <Button type="button" variant="secondary" onClick={goBack}>
                  Back
                </Button>
              ) : (
                <Link href="/" className="text-[0.9375rem] font-medium text-steel hover:text-ink">
                  Cancel
                </Link>
              )}
              {savedAt ? (
                <p className="text-[0.8125rem] text-steel" aria-live="polite">
                  Saved · {formatSavedAt(savedAt)}
                </p>
              ) : (
                <p className="text-[0.8125rem] text-steel">Draft saves automatically</p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {!atDealContact && location.phaseId !== "deal" ? (
                <Button type="button" variant="secondary" onClick={submit} disabled={submitting}>
                  Submit and open my portal
                </Button>
              ) : null}
              {atDealContact ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const hard = validateCurrentSoft();
                      setErrors(hard);
                      if (Object.keys(hard).length) {
                        setErrorSummary(
                          `${Object.keys(hard).length} item${Object.keys(hard).length === 1 ? "" : "s"} need attention.`,
                        );
                        focusFirstInvalid(hard);
                        return;
                      }
                      goTo({ phaseId: "profile", subStepId: "borrower" });
                    }}
                  >
                    Continue filling package
                  </Button>
                  <Button type="submit" shine disabled={submitting}>
                    {submitting ? "Submitting…" : "Submit and open my portal"}
                  </Button>
                </>
              ) : pathIndex < path.length - 1 ? (
                <Button type="submit">Continue</Button>
              ) : (
                <Button type="submit" shine disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit and open my portal"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
