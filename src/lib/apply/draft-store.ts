/**
 * Apply draft persistence — localStorage today, swappable for Supabase later.
 * Interface stays stable; storage backend can change without UI rewrites.
 */

import type { ApplicationPackage } from "@/lib/apply/package";
import type { LoanType } from "@/lib/types/database";

const DRAFT_PREFIX = "vfs:apply-draft:";
const ACTIVE_KEY = "vfs:apply-draft:active";

export type ApplyDraftLocation = {
  phaseId: "deal" | "profile" | "package";
  subStepId: string;
};

export type ApplyDraft = {
  id: string;
  updatedAt: string;
  location: ApplyDraftLocation;
  loanType: LoanType;
  package: ApplicationPackage;
  /** Document metadata only — file bytes are not persisted in drafts. */
  pendingDocs: Array<{
    localId: string;
    file_name: string;
    doc_type: string;
    file_size_bytes: number;
    mime_type: string | null;
  }>;
};

export type ApplyDraftStore = {
  createId: () => string;
  get: (id: string) => ApplyDraft | null;
  list: () => ApplyDraft[];
  save: (draft: ApplyDraft) => void;
  remove: (id: string) => void;
  getActiveId: () => string | null;
  setActiveId: (id: string | null) => void;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readJson<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode — fail quiet */
  }
}

function removeKey(key: string): void {
  if (!canUseStorage()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const localApplyDraftStore: ApplyDraftStore = {
  createId,
  get(id) {
    return readJson<ApplyDraft>(`${DRAFT_PREFIX}${id}`);
  },
  list() {
    if (!canUseStorage()) return [];
    const drafts: ApplyDraft[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(DRAFT_PREFIX) || key === ACTIVE_KEY) continue;
        const draft = readJson<ApplyDraft>(key);
        if (draft?.id) drafts.push(draft);
      }
    } catch {
      return [];
    }
    return drafts.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },
  save(draft) {
    const next: ApplyDraft = { ...draft, updatedAt: new Date().toISOString() };
    writeJson(`${DRAFT_PREFIX}${draft.id}`, next);
    writeJson(ACTIVE_KEY, draft.id);
  },
  remove(id) {
    removeKey(`${DRAFT_PREFIX}${id}`);
    if (localApplyDraftStore.getActiveId() === id) {
      removeKey(ACTIVE_KEY);
    }
  },
  getActiveId() {
    return readJson<string>(ACTIVE_KEY);
  },
  setActiveId(id) {
    if (id == null) removeKey(ACTIVE_KEY);
    else writeJson(ACTIVE_KEY, id);
  },
};

function syncDraftToSupabase(draft: ApplyDraft) {
  if (typeof window === "undefined") return;
  if (process.env.NEXT_PUBLIC_DATA_SOURCE === "mock") return;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  const email = draft.package.borrower.email?.trim().toLowerCase() || undefined;
  void fetch("/api/apply/drafts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: draft.id,
      owner_email: email,
      location: draft.location,
      loan_type: draft.loanType,
      package: draft.package,
      pending_docs: draft.pendingDocs,
    }),
  }).catch(() => {
    /* non-blocking dual-write */
  });
}

/** Local cache + dual-write to Supabase apply_drafts when configured (C2). */
export const applyDraftStore: ApplyDraftStore = {
  ...localApplyDraftStore,
  save(draft) {
    localApplyDraftStore.save(draft);
    syncDraftToSupabase(draft);
  },
  remove(id) {
    localApplyDraftStore.remove(id);
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      void fetch(`/api/apply/drafts?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(
        () => undefined,
      );
    }
  },
};

export function draftSubjectLabel(draft: ApplyDraft): string {
  const address = draft.package.subject_property.address?.trim();
  if (address) return address;
  const name = [draft.package.borrower.first_name, draft.package.borrower.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || "Untitled draft";
}
