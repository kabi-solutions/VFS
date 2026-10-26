"use client";

import { useMemo, useState } from "react";
import {
  DealContactPanel,
  DealLoanPanel,
  DealPropertyPanel,
  PackageBudgetPanel,
  PackageContractorPanel,
  PackageSreoPanel,
  PackageTrackPanel,
  ProfileBorrowerPanel,
  ProfileContactsPanel,
  ProfileDeclarationsPanel,
  ProfilePropertyDetailPanel,
  ProfileStrategyPanel,
} from "@/components/apply/ApplyPhasePanels";
import { PackageMeter } from "@/components/apply/PackageMeter";
import { needsContractorPackage } from "@/components/apply/ContractorFields";
import { Button } from "@/components/ui/Button";
import {
  applyGroundUpLoanRequestFlags,
  emptyApplicationPackage,
  emptyContractor,
  needsConstructionBudgetPackage,
  type ApplicationPackage,
  type CompletenessItem,
  type LoanRequestInfo,
  type StrategyInfo,
  type SubjectPropertyInfo,
  type VestingInfo,
} from "@/lib/apply/package";
import { updateApplicationPackage } from "@/lib/mock/applications";
import type { LoanApplication, LoanType } from "@/lib/types/database";

type SectionId =
  | "property"
  | "loan"
  | "contact"
  | "borrower"
  | "declarations"
  | "details"
  | "contacts"
  | "strategy"
  | "track"
  | "sreo"
  | "budget"
  | "contractor";

const SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: "property", label: "Property" },
  { id: "loan", label: "Loan" },
  { id: "contact", label: "Contact" },
  { id: "borrower", label: "Borrower" },
  { id: "declarations", label: "Declarations" },
  { id: "details", label: "Property & loan detail" },
  { id: "contacts", label: "Contacts" },
  { id: "strategy", label: "Strategy" },
  { id: "track", label: "Track record" },
  { id: "sreo", label: "SREO" },
  { id: "budget", label: "Budget" },
  { id: "contractor", label: "Contractor" },
];

function sectionForItem(item: CompletenessItem): SectionId {
  const id = item.id;
  if (id.startsWith("borrower") || id.startsWith("co_borrower")) return "borrower";
  if (id.startsWith("decl")) return "declarations";
  if (id.startsWith("subject.") || id.startsWith("loan.") || id.startsWith("vesting")) return "details";
  if (id.startsWith("interior") || id.startsWith("escrow") || id.startsWith("insurance")) return "contacts";
  if (id.startsWith("strategy")) return "strategy";
  if (id.startsWith("track")) return "track";
  if (id.startsWith("sreo")) return "sreo";
  if (id.startsWith("budget") || id.startsWith("construction")) return "budget";
  if (id.startsWith("contractor")) return "contractor";
  return "borrower";
}

type Props = {
  app: LoanApplication;
  docTypes?: string[];
  onSaved?: (app: LoanApplication) => void;
};

export function PackageContinuationForm({ app, docTypes = [], onSaved }: Props) {
  const [pkg, setPkg] = useState<ApplicationPackage>(() => app.package ?? emptyApplicationPackage());
  const [loanType] = useState<LoanType>(app.loan_type);
  const [section, setSection] = useState<SectionId>("borrower");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showContractor = needsContractorPackage(loanType, pkg.loan_request.requesting_rehab_financing);
  const showBudget = needsConstructionBudgetPackage(
    loanType,
    pkg.loan_request.requesting_rehab_financing,
    pkg.loan_request.requesting_ground_up,
    pkg.strategy.rehab_or_upgrade,
  );

  const visibleSections = useMemo(
    () =>
      SECTIONS.filter((s) => {
        if (s.id === "budget") return showBudget;
        if (s.id === "contractor") return showContractor;
        return true;
      }),
    [showBudget, showContractor],
  );

  function patchPkg(updater: (prev: ApplicationPackage) => ApplicationPackage) {
    setPkg((prev) => applyGroundUpLoanRequestFlags(updater(prev)));
    setMessage(null);
  }
  function patchSubject(patch: Partial<SubjectPropertyInfo>) {
    patchPkg((prev) => ({ ...prev, subject_property: { ...prev.subject_property, ...patch } }));
  }
  function patchLoan(patch: Partial<LoanRequestInfo>) {
    patchPkg((prev) => ({ ...prev, loan_request: { ...prev.loan_request, ...patch } }));
  }
  function patchVesting(patch: Partial<VestingInfo>) {
    patchPkg((prev) => ({ ...prev, vesting: { ...prev.vesting, ...patch } }));
  }
  function patchStrategy(patch: Partial<StrategyInfo>) {
    patchPkg((prev) => ({
      ...prev,
      strategy: { ...prev.strategy, ...patch },
      contractor: prev.contractor ?? emptyContractor(),
    }));
  }
  function save() {
    setSaving(true);
    try {
      const next = updateApplicationPackage(app.id, pkg);
      setMessage("Package saved.");
      onSaved?.(next);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save package.");
    } finally {
      setSaving(false);
    }
  }

  const shared = {
    pkg,
    loanType,
    loanTypeAutoNote: null as string | null,
    errors: {},
    patchPkg,
    patchSubject,
    patchLoan,
    patchVesting,
    patchStrategy,
    setLoanType: () => undefined,
  };

  return (
    <section className="mt-10 rounded-[var(--radius-panel)] bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-[var(--card-ring)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">
            Continue your package
          </h2>
          <p className="mt-2 max-w-[40rem] text-[0.9375rem] leading-relaxed text-steel">
            You already submitted. Fill what is still missing here — we keep a live completeness
            meter as you go.
          </p>
        </div>
        <Button type="button" shine onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save package"}
        </Button>
      </div>
      <PackageMeter
        className="mt-6"
        pkg={pkg}
        loanType={loanType}
        docTypes={docTypes}
        onJump={(item) => setSection(sectionForItem(item))}
      />
      {message ? (
        <p className="mt-4 text-[0.875rem] font-medium text-green" role="status">
          {message}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Package sections">
        {visibleSections.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={section === s.id}
            onClick={() => setSection(s.id)}
            className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-medium transition ${
              section === s.id ? "bg-green text-white" : "bg-paper text-charcoal hover:bg-green-soft"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-8" role="tabpanel">
        {section === "property" ? <DealPropertyPanel {...shared} /> : null}
        {section === "loan" ? <DealLoanPanel {...shared} /> : null}
        {section === "contact" ? <DealContactPanel {...shared} /> : null}
        {section === "borrower" ? <ProfileBorrowerPanel {...shared} /> : null}
        {section === "declarations" ? <ProfileDeclarationsPanel {...shared} /> : null}
        {section === "details" ? <ProfilePropertyDetailPanel {...shared} /> : null}
        {section === "contacts" ? <ProfileContactsPanel {...shared} /> : null}
        {section === "strategy" ? <ProfileStrategyPanel {...shared} /> : null}
        {section === "track" ? <PackageTrackPanel {...shared} /> : null}
        {section === "sreo" ? <PackageSreoPanel {...shared} /> : null}
        {section === "budget" && showBudget ? <PackageBudgetPanel {...shared} /> : null}
        {section === "contractor" && showContractor ? <PackageContractorPanel {...shared} /> : null}
      </div>
      <div className="mt-8 flex justify-end border-t border-line pt-5">
        <Button type="button" shine onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save package"}
        </Button>
      </div>
    </section>
  );
}
