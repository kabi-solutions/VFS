import type {
  AttributionSourceId,
  Condition,
  Document,
  LoanApplication,
  LoanType,
  StatusEvent,
  User,
} from "@/lib/types/database";
import {
  conditions,
  documents,
  getSession,
  loanApplications,
  setMockSessionUserId,
  statusEvents,
  users,
} from "@/lib/mock/data";

export const MOCK_APPLICATIONS_STORAGE_KEY = "vfs_mock_applications";
export const MOCK_BORROWER_ID_KEY = "vfs_mock_borrower_id";

export type MockDocumentInput = {
  file_name: string;
  doc_type: string;
  file_size_bytes: number;
  mime_type?: string | null;
};

export type CreateApplicationInput = {
  property_address: string;
  property_city: string;
  property_state: string;
  property_postal: string;
  /** PLACEHOLDER — property_type not yet on LoanApplication schema */
  property_type?: string;
  full_name: string;
  email: string;
  phone: string;
  /** PLACEHOLDER — entity_name not yet on User / LoanApplication schema */
  entity_name?: string;
  loan_type: LoanType;
  loan_amount: number;
  purchase_price?: number | null;
  estimated_arv?: number | null;
  notes?: string;
  attribution_source_id?: AttributionSourceId;
  prior_application_id?: string | null;
  documents?: MockDocumentInput[];
};

export type CreateApplicationResult = {
  user: User;
  application: LoanApplication;
  statusEvent: StatusEvent;
  documents: Document[];
};

type PersistedBundle = {
  users: User[];
  applications: LoanApplication[];
  statusEvents: StatusEvent[];
  documents: Document[];
  conditions: Condition[];
};

let hydrated = false;

function byId<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function upsertById<T extends { id: string }>(target: T[], incoming: T[]) {
  const map = byId(target);
  for (const item of incoming) {
    const existing = map.get(item.id);
    if (existing) {
      Object.assign(existing, item);
    } else {
      target.push(item);
      map.set(item.id, item);
    }
  }
}

function mergeById<T extends { id: string }>(target: T[], incoming: T[]) {
  const map = byId(target);
  for (const item of incoming) {
    if (!map.has(item.id)) {
      target.push(item);
      map.set(item.id, item);
    }
  }
}

function readPersisted(): PersistedBundle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MOCK_APPLICATIONS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedBundle;
  } catch {
    return null;
  }
}

/** Persist in-memory mock loan state so demo mutations survive refresh. */
export function persistMockState() {
  if (typeof window === "undefined") return;
  const bundle: PersistedBundle = {
    users: [...users],
    applications: [...loanApplications],
    statusEvents: [...statusEvents],
    documents: [...documents],
    conditions: [...conditions],
  };
  try {
    localStorage.setItem(MOCK_APPLICATIONS_STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    /* ignore quota / private mode */
  }
}

/** @deprecated Prefer persistMockState */
function writePersisted() {
  persistMockState();
}

/** Merge localStorage Apply + portal mutations into in-memory mock arrays. Safe to call repeatedly. */
export function hydrateMockApplicationsFromStorage() {
  if (typeof window === "undefined" || hydrated) return;
  hydrated = true;
  const bundle = readPersisted();
  if (!bundle) return;
  upsertById(users, bundle.users ?? []);
  upsertById(loanApplications, bundle.applications ?? []);
  upsertById(statusEvents, bundle.statusEvents ?? []);
  upsertById(documents, bundle.documents ?? []);
  upsertById(conditions, bundle.conditions ?? []);
}

function nextReferenceCode(): string {
  let max = 1000;
  for (const app of loanApplications) {
    const match = /^VFS-(\d+)$/i.exec(app.reference_code);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `VFS-${max + 1}`;
}

function findOrCreateBorrower(input: CreateApplicationInput, now: string): User {
  const email = input.email.trim().toLowerCase();
  const existing = users.find((u) => u.role === "borrower" && u.email.toLowerCase() === email);
  if (existing) {
    existing.full_name = input.full_name.trim();
    existing.phone = input.phone.trim();
    existing.updated_at = now;
    return existing;
  }

  const user: User = {
    id: `user-borrower-apply-${Date.now()}`,
    auth_user_id: null,
    email,
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    role: "borrower",
    organization_id: null,
    created_at: now,
    updated_at: now,
  };
  users.push(user);
  return user;
}

export function createApplication(input: CreateApplicationInput): CreateApplicationResult {
  hydrateMockApplicationsFromStorage();

  const now = new Date().toISOString();
  const user = findOrCreateBorrower(input, now);
  const applicationId = `app-${Date.now()}`;
  const reference_code = nextReferenceCode();

  const noteParts: string[] = ["Application submitted via digital Apply."];
  if (input.entity_name?.trim()) {
    noteParts.push(`Entity: ${input.entity_name.trim()}.`);
  }
  if (input.property_type?.trim()) {
    noteParts.push(`Property type: ${input.property_type.trim()}.`);
  }
  if (input.notes?.trim()) {
    noteParts.push(input.notes.trim());
  }

  const application: LoanApplication = {
    id: applicationId,
    reference_code,
    borrower_id: user.id,
    loan_type: input.loan_type,
    status: "application_submitted",
    info_requested_from: null,
    prior_application_id: input.prior_application_id?.trim() || null,
    property_address: input.property_address.trim(),
    property_city: input.property_city.trim(),
    property_state: input.property_state.trim().toUpperCase(),
    property_postal: input.property_postal.trim(),
    purchase_price: input.purchase_price ?? null,
    loan_amount: input.loan_amount,
    estimated_arv: input.estimated_arv ?? null,
    processor_org_id: null,
    lender_org_id: null,
    escrow_org_id: null,
    assigned_processor_id: null,
    attribution_source_id: input.attribution_source_id ?? "direct_apply",
    commission_rate: null,
    created_at: now,
    updated_at: now,
    funded_at: null,
    denied_at: null,
  };

  const statusEvent: StatusEvent = {
    id: `evt-${Date.now()}`,
    application_id: applicationId,
    actor_id: user.id,
    from_status: null,
    to_status: "application_submitted",
    note: noteParts.join(" "),
    created_at: now,
  };

  const createdDocs: Document[] = (input.documents ?? []).map((doc, index) => ({
    id: `doc-${Date.now()}-${index}`,
    application_id: applicationId,
    doc_type: doc.doc_type,
    file_name: doc.file_name,
    // PLACEHOLDER — metadata only; no Supabase Storage upload
    storage_path: `mock/${applicationId}/${doc.file_name}`,
    mime_type: doc.mime_type ?? null,
    file_size_bytes: doc.file_size_bytes,
    status: "pending" as const,
    uploaded_by: user.id,
    created_at: now,
    updated_at: now,
  }));

  loanApplications.push(application);
  statusEvents.push(statusEvent);
  for (const doc of createdDocs) documents.push(doc);

  setMockSessionUserId(user.id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(MOCK_BORROWER_ID_KEY, user.id);
      sessionStorage.setItem(MOCK_BORROWER_ID_KEY, user.id);
    } catch {
      /* ignore */
    }
  }

  writePersisted();

  return { user, application, statusEvent, documents: createdDocs };
}

export function listAllApplications(): LoanApplication[] {
  hydrateMockApplicationsFromStorage();
  return [...loanApplications].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

export function listApplicationsForBorrower(borrowerId: string): LoanApplication[] {
  return listAllApplications().filter((a) => a.borrower_id === borrowerId);
}

export function getApplicationById(id: string): LoanApplication | undefined {
  hydrateMockApplicationsFromStorage();
  return loanApplications.find((a) => a.id === id);
}

export function getStatusEventsForApplication(applicationId: string): StatusEvent[] {
  hydrateMockApplicationsFromStorage();
  return statusEvents
    .filter((e) => e.application_id === applicationId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getDocumentsForApplication(applicationId: string): Document[] {
  hydrateMockApplicationsFromStorage();
  return documents
    .filter((d) => d.application_id === applicationId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function getConditionsForApplication(applicationId: string): Condition[] {
  hydrateMockApplicationsFromStorage();
  return conditions
    .filter((c) => c.application_id === applicationId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getUserById(id: string): User | undefined {
  hydrateMockApplicationsFromStorage();
  return users.find((u) => u.id === id);
}

/** Prefer mock session borrower, then Apply storage keys, then seed borrower. */
export function resolveBorrowerId(): string {
  hydrateMockApplicationsFromStorage();
  const session = getSession();
  if (session.user.role === "borrower") return session.user.id;
  if (typeof window !== "undefined") {
    try {
      const fromSession = sessionStorage.getItem(MOCK_BORROWER_ID_KEY);
      if (fromSession) return fromSession;
      const fromLocal = localStorage.getItem(MOCK_BORROWER_ID_KEY);
      if (fromLocal) return fromLocal;
    } catch {
      /* ignore */
    }
  }
  return "user-borrower-1";
}
