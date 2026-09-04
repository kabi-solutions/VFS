"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  addMockDocument,
  assignEscrow,
  assignLender,
  assignProcessor,
  clearToClose,
  denyApplication,
  generateLoi,
  issueConditions,
  listOrgsByType,
  listProcessorUsers,
  markClosingPrep,
  markDocumentStatus,
  markFunded,
  markSigningFunding,
  requestInfo,
  resolveInfoRequest,
  startInitialReview,
  submitPackageToLender,
  transitionStatus,
} from "@/lib/mock/actions";
import {
  getApplicationById,
  getConditionsForApplication,
  getDocumentsForApplication,
  getStatusEventsForApplication,
  getUserById,
} from "@/lib/mock/applications";
import { organizations } from "@/lib/mock/data";
import {
  applicationStatusLabels,
  docTypeLabels,
  loanTypeLabels,
} from "@/lib/mock/status-labels";
import type {
  ApplicationStatus,
  Condition,
  Document,
  DocumentStatus,
  LoanApplication,
  Organization,
  StatusEvent,
  User,
  UserRole,
} from "@/lib/types/database";

function formatMoney(n: number | null): string {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

function orgName(id: string | null): string {
  if (!id) return "Unassigned";
  return organizations.find((o) => o.id === id)?.name ?? id;
}

const pipelineHref: Record<UserRole, string> = {
  borrower: "/portal/borrower/applications",
  vault: "/portal/vault/pipeline",
  processor: "/portal/processor/pipeline",
  lender: "/portal/lender/pipeline",
  escrow: "/portal/escrow/pipeline",
};

const SAMPLE_CONDITIONS = [
  "Updated title commitment with Vesting Schedule A",
  "Evidence of hazard insurance naming lender as mortgagee",
  "Final construction draw schedule signed by borrower",
];

type WorkspaceRole = UserRole;

export function ApplicationWorkspace({ role }: { role: WorkspaceRole }) {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [app, setApp] = useState<LoanApplication | null>(null);
  const [events, setEvents] = useState<StatusEvent[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [conds, setConds] = useState<Condition[]>([]);
  const [borrower, setBorrower] = useState<User | null>(null);
  const [processors, setProcessors] = useState<User[]>([]);
  const [lenderOrgs, setLenderOrgs] = useState<Organization[]>([]);
  const [escrowOrgs, setEscrowOrgs] = useState<Organization[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState("");
  const [selectedLender, setSelectedLender] = useState("");
  const [selectedEscrow, setSelectedEscrow] = useState("");
  const [infoNote, setInfoNote] = useState("Please provide the outstanding package items.");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const found = getApplicationById(id);
    setApp(found ?? null);
    if (!found) return;
    setEvents(getStatusEventsForApplication(found.id));
    setDocs(getDocumentsForApplication(found.id));
    setConds(getConditionsForApplication(found.id));
    setBorrower(getUserById(found.borrower_id) ?? null);
    const procs = listProcessorUsers();
    setProcessors(procs);
    setLenderOrgs(listOrgsByType("lender"));
    setEscrowOrgs(listOrgsByType("escrow"));
    setSelectedProcessor((prev) => prev || procs[0]?.id || "");
    setSelectedLender((prev) => prev || found.lender_org_id || listOrgsByType("lender")[0]?.id || "");
    setSelectedEscrow((prev) => prev || found.escrow_org_id || listOrgsByType("escrow")[0]?.id || "");
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function run(action: () => void, success?: string) {
    try {
      setError(null);
      action();
      refresh();
      setMessage(success ?? "Updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    }
  }

  if (!app) {
    return (
      <div className="rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-black/[0.04]">
        <p className="text-[1.0625rem] text-charcoal">Application not found.</p>
        <div className="mt-6">
          <Button href={pipelineHref[role]} variant="secondary">
            Back to pipeline
          </Button>
        </div>
      </div>
    );
  }

  const status = applicationStatusLabels[app.status];
  const backLabel = role === "borrower" ? "Applications" : "Pipeline";
  const canMarkDocs = role !== "borrower";

  return (
    <div>
      <Link
        href={pipelineHref[role]}
        className="text-[0.875rem] font-medium text-steel hover:text-ink"
      >
        ← {backLabel}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.8125rem] text-steel">{app.reference_code}</p>
          <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            {app.property_address}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-steel">
            {app.property_city}, {app.property_state} {app.property_postal}
            {borrower ? ` · ${borrower.full_name}` : ""}
          </p>
        </div>
        <span className="rounded-full bg-green-soft px-3 py-1.5 text-[0.8125rem] font-semibold text-green">
          {status.label}
        </span>
      </div>

      <p className="mt-4 max-w-[40rem] text-[1.0625rem] leading-relaxed text-charcoal">
        {status.plain}
      </p>

      {(message || error) && (
        <p
          className={`mt-4 text-[0.875rem] font-medium ${error ? "text-red-700" : "text-green"}`}
          role="status"
        >
          {error ?? message}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetaCard label="Loan type" value={loanTypeLabels[app.loan_type]} />
        <MetaCard label="Loan amount" value={formatMoney(app.loan_amount)} />
        <MetaCard
          label="Purchase / ARV"
          value={`${formatMoney(app.purchase_price)} / ${formatMoney(app.estimated_arv)}`}
        />
        <MetaCard
          label="Assignments"
          value={`${orgName(app.processor_org_id)} · ${orgName(app.lender_org_id)} · ${orgName(app.escrow_org_id)}`}
        />
      </div>

      <section className="mt-10 rounded-2xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
        <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {role === "vault" ? (
            <VaultActions
              status={app.status}
              processors={processors}
              selectedProcessor={selectedProcessor}
              onProcessorChange={setSelectedProcessor}
              run={run}
              appId={app.id}
            />
          ) : null}
          {role === "processor" ? (
            <ProcessorActions
              status={app.status}
              lenderOrgs={lenderOrgs}
              selectedLender={selectedLender}
              onLenderChange={setSelectedLender}
              infoNote={infoNote}
              onInfoNoteChange={setInfoNote}
              run={run}
              appId={app.id}
            />
          ) : null}
          {role === "lender" ? (
            <LenderActions
              status={app.status}
              escrowOrgs={escrowOrgs}
              selectedEscrow={selectedEscrow}
              onEscrowChange={setSelectedEscrow}
              run={run}
              appId={app.id}
            />
          ) : null}
          {role === "escrow" ? (
            <EscrowActions status={app.status} run={run} appId={app.id} />
          ) : null}
          {role === "borrower" ? (
            <>
              <Button href={`/apply?prior=${encodeURIComponent(app.id)}`} shine>
                Start new application
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  run(
                    () =>
                      addMockDocument(app.id, {
                        file_name: `upload-${Date.now()}.pdf`,
                        doc_type: "other",
                        file_size_bytes: 128000,
                        mime_type: "application/pdf",
                      }),
                    "Mock document uploaded (pending).",
                  )
                }
              >
                Upload document
              </Button>
            </>
          ) : null}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">Status timeline</h2>
        <ol className="mt-5 space-y-0 border-l border-line-strong pl-5">
          {events.map((event, index) => {
            const label = applicationStatusLabels[event.to_status].label;
            const isLatest = index === events.length - 1;
            return (
              <li key={event.id} className="relative pb-8 last:pb-0">
                <span
                  className={`absolute -left-[1.4rem] top-1 h-2.5 w-2.5 rounded-full ${
                    isLatest ? "bg-green" : "bg-steel/40"
                  }`}
                  aria-hidden
                />
                <p className="text-[0.9375rem] font-semibold text-ink">{label}</p>
                <p className="mt-1 text-[0.8125rem] text-steel">{formatDate(event.created_at)}</p>
                {event.note ? (
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">{event.note}</p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">Documents</h2>
        {docs.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] text-steel">No documents on this file yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-2xl bg-white ring-1 ring-black/[0.04]">
            {docs.map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div>
                  <p className="text-[0.9375rem] font-medium text-ink">{doc.file_name}</p>
                  <p className="mt-1 text-[0.8125rem] text-steel">
                    {docTypeLabels[doc.doc_type] ?? doc.doc_type} · {formatBytes(doc.file_size_bytes)}{" "}
                    · {doc.status}
                  </p>
                </div>
                {canMarkDocs ? (
                  <div className="flex flex-wrap gap-2">
                    {(["received", "approved", "rejected"] as DocumentStatus[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        disabled={doc.status === s}
                        onClick={() =>
                          run(() => markDocumentStatus(doc.id, s), `Document marked ${s}.`)
                        }
                        className="rounded-full px-2.5 py-1 text-[0.75rem] font-medium text-steel ring-1 ring-line hover:bg-paper disabled:opacity-40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-[0.75rem] font-medium uppercase tracking-[0.04em] text-steel">
                    Mock only
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">Conditions</h2>
        {conds.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] text-steel">No conditions on this file.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line rounded-2xl bg-white ring-1 ring-black/[0.04]">
            {conds.map((c) => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <p className="text-[0.9375rem] text-charcoal">{c.description}</p>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-steel">
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/[0.04]">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-steel">{label}</p>
      <p className="mt-2 text-[0.9375rem] font-medium text-ink">{value}</p>
    </div>
  );
}

type RunFn = (action: () => void, success?: string) => void;

function VaultActions({
  status,
  processors,
  selectedProcessor,
  onProcessorChange,
  run,
  appId,
}: {
  status: ApplicationStatus;
  processors: User[];
  selectedProcessor: string;
  onProcessorChange: (id: string) => void;
  run: RunFn;
  appId: string;
}) {
  return (
    <>
      {status === "application_submitted" ? (
        <>
          <Button
            type="button"
            shine
            onClick={() => run(() => startInitialReview(appId), "Initial review started.")}
          >
            Start review
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => run(() => denyApplication(appId), "Application denied.")}
          >
            Deny
          </Button>
        </>
      ) : null}
      {status === "initial_review" ? (
        <>
          <Button
            type="button"
            shine
            onClick={() => run(() => generateLoi(appId), "LOI generated.")}
          >
            Generate LOI
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => run(() => denyApplication(appId), "Application denied.")}
          >
            Deny
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedProcessor}
              onChange={(e) => onProcessorChange(e.target.value)}
              className="rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2 text-[0.875rem]"
            >
              {processors.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                run(
                  () => assignProcessor(appId, selectedProcessor),
                  "Processor assigned.",
                )
              }
            >
              Assign processor
            </Button>
          </div>
        </>
      ) : null}
      {status === "loi_issued" ? (
        <Button
          type="button"
          shine
          onClick={() =>
            run(() => transitionStatus(appId, "package_submission", "Moved to package submission."), "Moved to package.")
          }
        >
          Move to package
        </Button>
      ) : null}
      <div className="flex w-full flex-wrap items-center gap-2 border-t border-line pt-3">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.04em] text-steel">
          Demo override
        </span>
        {(
          [
            "application_submitted",
            "initial_review",
            "loi_issued",
            "package_submission",
            "underwriting",
            "clear_to_close",
            "closing_prep",
            "signing_funding",
            "funded",
          ] as ApplicationStatus[]
        ).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => run(() => transitionStatus(appId, s, `Demo override → ${s}`), `Status → ${s}`)}
            className="rounded-full px-2.5 py-1 text-[0.75rem] font-medium text-steel ring-1 ring-line hover:bg-paper"
          >
            {applicationStatusLabels[s].label}
          </button>
        ))}
      </div>
    </>
  );
}

function ProcessorActions({
  status,
  lenderOrgs,
  selectedLender,
  onLenderChange,
  infoNote,
  onInfoNoteChange,
  run,
  appId,
}: {
  status: ApplicationStatus;
  lenderOrgs: Organization[];
  selectedLender: string;
  onLenderChange: (id: string) => void;
  infoNote: string;
  onInfoNoteChange: (v: string) => void;
  run: RunFn;
  appId: string;
}) {
  return (
    <>
      {status === "package_submission" ? (
        <>
          <div className="flex w-full flex-wrap items-center gap-2">
            <input
              value={infoNote}
              onChange={(e) => onInfoNoteChange(e.target.value)}
              className="min-w-[16rem] flex-1 rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2 text-[0.875rem]"
              placeholder="Info request note"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => run(() => requestInfo(appId, infoNote), "Info requested.")}
            >
              Request info
            </Button>
          </div>
          <Button
            type="button"
            shine
            onClick={() => run(() => submitPackageToLender(appId), "Submitted to lender.")}
          >
            Submit to lender
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLender}
              onChange={(e) => onLenderChange(e.target.value)}
              className="rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2 text-[0.875rem]"
            >
              {lenderOrgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={() => run(() => assignLender(appId, selectedLender), "Lender assigned.")}
            >
              Assign lender org
            </Button>
          </div>
        </>
      ) : null}
      {status === "info_requested" ? (
        <Button
          type="button"
          shine
          onClick={() => run(() => resolveInfoRequest(appId), "Info request resolved.")}
        >
          Mark info resolved
        </Button>
      ) : null}
      {status !== "package_submission" && status !== "info_requested" ? (
        <p className="text-[0.875rem] text-steel">
          No primary processor actions for this status. Open a package or info-requested file.
        </p>
      ) : null}
    </>
  );
}

function LenderActions({
  status,
  escrowOrgs,
  selectedEscrow,
  onEscrowChange,
  run,
  appId,
}: {
  status: ApplicationStatus;
  escrowOrgs: Organization[];
  selectedEscrow: string;
  onEscrowChange: (id: string) => void;
  run: RunFn;
  appId: string;
}) {
  return (
    <>
      {status === "underwriting" ? (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              run(() => issueConditions(appId, SAMPLE_CONDITIONS), "Sample conditions issued.")
            }
          >
            Issue sample conditions
          </Button>
          <Button
            type="button"
            shine
            onClick={() => run(() => clearToClose(appId), "Cleared to close.")}
          >
            Clear to close
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => run(() => denyApplication(appId), "Application denied.")}
          >
            Deny
          </Button>
        </>
      ) : null}
      {status === "clear_to_close" ? (
        <>
          <Button
            type="button"
            shine
            onClick={() => run(() => markClosingPrep(appId), "Moved to closing prep.")}
          >
            Move to closing prep
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedEscrow}
              onChange={(e) => onEscrowChange(e.target.value)}
              className="rounded-[var(--radius-control)] border border-line bg-paper px-3 py-2 text-[0.875rem]"
            >
              {escrowOrgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              onClick={() => run(() => assignEscrow(appId, selectedEscrow), "Escrow assigned.")}
            >
              Assign escrow
            </Button>
          </div>
        </>
      ) : null}
      {status !== "underwriting" && status !== "clear_to_close" ? (
        <p className="text-[0.875rem] text-steel">
          No primary lender actions for this status. Use an underwriting or clear-to-close file.
        </p>
      ) : null}
    </>
  );
}

function EscrowActions({
  status,
  run,
  appId,
}: {
  status: ApplicationStatus;
  run: RunFn;
  appId: string;
}) {
  return (
    <>
      {status === "closing_prep" ? (
        <Button
          type="button"
          shine
          onClick={() => run(() => markSigningFunding(appId), "Signing & funding started.")}
        >
          Signing &amp; funding
        </Button>
      ) : null}
      {status === "signing_funding" ? (
        <Button type="button" shine onClick={() => run(() => markFunded(appId), "Marked funded.")}>
          Mark funded
        </Button>
      ) : null}
      {status !== "closing_prep" && status !== "signing_funding" ? (
        <p className="text-[0.875rem] text-steel">
          Waiting for closing prep. Assigned files and CTC+ files appear in your pipeline for demo.
        </p>
      ) : null}
    </>
  );
}
