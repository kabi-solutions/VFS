import type {
  ApplicationStatus,
  Condition,
  Document,
  DocumentStatus,
  LoanApplication,
  UserRole,
} from "@/lib/types/database";
import {
  getApplicationById,
  hydrateMockApplicationsFromStorage,
  listAllApplications,
  persistMockState,
  type MockDocumentInput,
} from "@/lib/mock/applications";
import {
  conditions,
  documents,
  getSession,
  loanApplications,
  organizations,
  statusEvents,
  users,
} from "@/lib/mock/data";

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function requireApp(appId: string): LoanApplication {
  hydrateMockApplicationsFromStorage();
  const app = loanApplications.find((a) => a.id === appId);
  if (!app) throw new Error(`Application not found: ${appId}`);
  return app;
}

function pushStatusEvent(
  app: LoanApplication,
  toStatus: ApplicationStatus,
  note?: string | null,
) {
  const session = getSession();
  const event = {
    id: uid("evt"),
    application_id: app.id,
    actor_id: session.user.id,
    from_status: app.status,
    to_status: toStatus,
    note: note?.trim() || null,
    created_at: nowIso(),
  };
  statusEvents.push(event);
  app.status = toStatus;
  app.updated_at = event.created_at;
  return event;
}

export function transitionStatus(appId: string, toStatus: ApplicationStatus, note?: string) {
  const app = requireApp(appId);
  if (toStatus === "denied") {
    app.denied_at = nowIso();
  }
  if (toStatus === "funded") {
    app.funded_at = nowIso();
  }
  if (toStatus !== "info_requested") {
    app.info_requested_from = null;
  }
  pushStatusEvent(app, toStatus, note);
  persistMockState();
  return app;
}

export function denyApplication(appId: string, note?: string) {
  const app = requireApp(appId);
  app.denied_at = nowIso();
  app.info_requested_from = null;
  pushStatusEvent(app, "denied", note ?? "Application denied.");
  persistMockState();
  return app;
}

export function startInitialReview(appId: string) {
  return transitionStatus(appId, "initial_review", "Vault opened initial review.");
}

export function generateLoi(appId: string) {
  const app = requireApp(appId);
  const session = getSession();
  const stamp = nowIso();
  pushStatusEvent(app, "loi_issued", "LOI generated and attached to file.");
  const doc: Document = {
    id: uid("doc"),
    application_id: app.id,
    doc_type: "loi",
    file_name: `LOI-${app.reference_code}.pdf`,
    storage_path: `mock/${app.id}/LOI-${app.reference_code}.pdf`,
    mime_type: "application/pdf",
    file_size_bytes: 175000,
    status: "received",
    uploaded_by: session.user.id,
    created_at: stamp,
    updated_at: stamp,
  };
  documents.push(doc);
  persistMockState();
  return { app, document: doc };
}

export function assignProcessor(appId: string, processorUserId: string) {
  const app = requireApp(appId);
  const processor = users.find((u) => u.id === processorUserId && u.role === "processor");
  if (!processor) throw new Error(`Processor user not found: ${processorUserId}`);
  app.assigned_processor_id = processor.id;
  app.processor_org_id = processor.organization_id;
  app.updated_at = nowIso();
  persistMockState();
  return app;
}

export function assignLender(appId: string, lenderOrgId: string) {
  const app = requireApp(appId);
  const org = organizations.find((o) => o.id === lenderOrgId && o.org_type === "lender");
  if (!org) throw new Error(`Lender org not found: ${lenderOrgId}`);
  app.lender_org_id = org.id;
  app.updated_at = nowIso();
  persistMockState();
  return app;
}

export function assignEscrow(appId: string, escrowOrgId: string) {
  const app = requireApp(appId);
  const org = organizations.find((o) => o.id === escrowOrgId && o.org_type === "escrow");
  if (!org) throw new Error(`Escrow org not found: ${escrowOrgId}`);
  app.escrow_org_id = org.id;
  app.updated_at = nowIso();
  persistMockState();
  return app;
}

export function requestInfo(appId: string, note: string) {
  const app = requireApp(appId);
  app.info_requested_from = app.status;
  pushStatusEvent(app, "info_requested", note);
  persistMockState();
  return app;
}

export function resolveInfoRequest(appId: string) {
  const app = requireApp(appId);
  const resume = app.info_requested_from ?? "package_submission";
  app.info_requested_from = null;
  pushStatusEvent(app, resume, "Information request resolved; file resumed.");
  persistMockState();
  return app;
}

export function submitPackageToLender(appId: string) {
  return transitionStatus(appId, "underwriting", "Package submitted to lender for underwriting.");
}

export function issueConditions(appId: string, descriptions: string[]) {
  const app = requireApp(appId);
  const session = getSession();
  const stamp = nowIso();
  const created: Condition[] = descriptions
    .map((d) => d.trim())
    .filter(Boolean)
    .map((description) => ({
      id: uid("cond"),
      application_id: app.id,
      description,
      status: "open" as const,
      created_by: session.user.id,
      created_at: stamp,
      satisfied_at: null,
    }));
  for (const c of created) conditions.push(c);
  app.updated_at = stamp;
  if (app.status !== "underwriting" && app.status !== "clear_to_close") {
    pushStatusEvent(app, "underwriting", "Conditions issued; file remains in underwriting.");
  }
  persistMockState();
  return { app, conditions: created };
}

export function clearToClose(appId: string) {
  return transitionStatus(appId, "clear_to_close", "Lender cleared file to close.");
}

export function markClosingPrep(appId: string) {
  return transitionStatus(appId, "closing_prep", "Moved to closing preparation.");
}

export function markSigningFunding(appId: string) {
  return transitionStatus(appId, "signing_funding", "Signing and funding in progress.");
}

export function markFunded(appId: string) {
  const app = requireApp(appId);
  app.funded_at = nowIso();
  app.info_requested_from = null;
  pushStatusEvent(app, "funded", "File funded.");
  persistMockState();
  return app;
}

export function markDocumentStatus(docId: string, status: DocumentStatus) {
  hydrateMockApplicationsFromStorage();
  const doc = documents.find((d) => d.id === docId);
  if (!doc) throw new Error(`Document not found: ${docId}`);
  doc.status = status;
  doc.updated_at = nowIso();
  const app = getApplicationById(doc.application_id);
  if (app) app.updated_at = doc.updated_at;
  persistMockState();
  return doc;
}

export function addMockDocument(appId: string, input: MockDocumentInput) {
  const app = requireApp(appId);
  const session = getSession();
  const stamp = nowIso();
  const doc: Document = {
    id: uid("doc"),
    application_id: app.id,
    doc_type: input.doc_type,
    file_name: input.file_name,
    storage_path: `mock/${app.id}/${input.file_name}`,
    mime_type: input.mime_type ?? "application/pdf",
    file_size_bytes: input.file_size_bytes,
    status: "pending",
    uploaded_by: session.user.id,
    created_at: stamp,
    updated_at: stamp,
  };
  documents.push(doc);
  app.updated_at = stamp;
  persistMockState();
  return doc;
}

const UW_PLUS: ApplicationStatus[] = [
  "underwriting",
  "clear_to_close",
  "closing_prep",
  "signing_funding",
  "funded",
];

const PACKAGE_STAGES: ApplicationStatus[] = ["package_submission", "info_requested", "loi_issued"];

function sortForRole(apps: LoanApplication[], role: UserRole): LoanApplication[] {
  const priority = (status: ApplicationStatus): number => {
    if (role === "vault") {
      const order: ApplicationStatus[] = [
        "application_submitted",
        "initial_review",
        "loi_issued",
        "package_submission",
        "info_requested",
        "underwriting",
        "clear_to_close",
        "closing_prep",
        "signing_funding",
        "funded",
        "denied",
      ];
      return order.indexOf(status);
    }
    if (role === "processor") {
      if (status === "info_requested") return 0;
      if (status === "package_submission") return 1;
      if (status === "loi_issued") return 2;
      return 10;
    }
    if (role === "lender") {
      if (status === "underwriting") return 0;
      if (status === "clear_to_close") return 1;
      return 10;
    }
    if (role === "escrow") {
      if (status === "closing_prep") return 0;
      if (status === "signing_funding") return 1;
      if (status === "clear_to_close") return 2;
      return 10;
    }
    return 0;
  };
  return [...apps].sort((a, b) => {
    const d = priority(a.status) - priority(b.status);
    if (d !== 0) return d;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

/** Role pipeline filter — falls back to full list if the filter would empty the demo. */
export function filterApplicationsForRole(role: UserRole): LoanApplication[] {
  const all = listAllApplications();
  const session = getSession();
  const orgId = session.user.organization_id;
  const userId = session.user.id;

  let filtered: LoanApplication[] = all;

  if (role === "vault") {
    filtered = all;
  } else if (role === "processor") {
    filtered = all.filter(
      (a) =>
        a.processor_org_id === orgId ||
        a.assigned_processor_id === userId ||
        (!a.assigned_processor_id && PACKAGE_STAGES.includes(a.status)),
    );
  } else if (role === "lender") {
    // Match assigned org, or show all underwriting+ for demo coverage
    filtered = all.filter(
      (a) => a.lender_org_id === orgId || UW_PLUS.includes(a.status),
    );
  } else if (role === "escrow") {
    filtered = all.filter(
      (a) =>
        a.escrow_org_id === orgId ||
        a.status === "closing_prep" ||
        a.status === "signing_funding" ||
        a.status === "clear_to_close",
    );
  } else if (role === "borrower") {
    filtered = all.filter((a) => a.borrower_id === userId);
  }

  if (filtered.length === 0 && role !== "borrower") {
    filtered = all;
  }

  return sortForRole(filtered, role);
}

export function listProcessorUsers() {
  hydrateMockApplicationsFromStorage();
  return users.filter((u) => u.role === "processor");
}

export function listOrgsByType(orgType: "lender" | "escrow" | "processor") {
  return organizations.filter((o) => o.org_type === orgType && o.status === "active");
}
