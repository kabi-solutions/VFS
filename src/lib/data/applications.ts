import { displayName, getPackageCompleteness, type ApplicationPackage } from "@/lib/apply/package";
import {
  createApplication as createMockApplication,
  getApplicationById as getMockApplicationById,
  getConditionsForApplication as getMockConditions,
  getDocumentsForApplication as getMockDocuments,
  getStatusEventsForApplication as getMockStatusEvents,
  getUserById as getMockUserById,
  listAllApplications as listMockAll,
  listApplicationsForBorrower as listMockForBorrower,
  resolveBorrowerId as resolveMockBorrowerId,
  updateApplicationPackage as updateMockPackage,
  type CreateApplicationInput,
  type CreateApplicationResult,
  type MockDocumentInput,
} from "@/lib/mock/applications";
import {
  filterApplicationsForRole as filterMockForRole,
  listOrgsByType as listMockOrgsByType,
  listProcessorUsers as listMockProcessors,
} from "@/lib/mock/actions";
import { organizations as mockOrganizations } from "@/lib/mock/data";
import {
  mapApplication,
  mapCondition,
  mapDocument,
  mapOrganization,
  mapStatusEvent,
  mapUser,
} from "@/lib/data/mappers";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
import type {
  Condition,
  Document,
  LoanApplication,
  Organization,
  StatusEvent,
  User,
  UserRole,
} from "@/lib/types/database";

export type { CreateApplicationInput, CreateApplicationResult, MockDocumentInput };

export function usesLiveBackend(): boolean {
  return isSupabaseConfigured();
}

export async function createApplicationLive(
  input: CreateApplicationInput & { password?: string; establishSession?: boolean },
): Promise<CreateApplicationResult & { sessionEstablished?: boolean }> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Failed to create application (${res.status})`);
  }
  return body as CreateApplicationResult & { sessionEstablished?: boolean };
}

export async function createApplication(
  input: CreateApplicationInput & { password?: string; establishSession?: boolean },
): Promise<CreateApplicationResult & { sessionEstablished?: boolean }> {
  if (isSupabaseConfigured()) {
    try {
      return await createApplicationLive(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (
        message.includes("SERVICE_ROLE") ||
        message.includes("503") ||
        message.includes("not configured")
      ) {
        return { ...createMockApplication(input), sessionEstablished: false };
      }
      throw err;
    }
  }
  return { ...createMockApplication(input), sessionEstablished: false };
}

export async function listApplicationsForBorrower(borrowerId?: string): Promise<LoanApplication[]> {
  if (!isSupabaseConfigured()) {
    return listMockForBorrower(borrowerId ?? resolveMockBorrowerId());
  }
  const res = await fetch("/api/portal/applications?scope=borrower", { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401) return listMockForBorrower(borrowerId ?? resolveMockBorrowerId());
    throw new Error("Failed to load applications");
  }
  return ((await res.json()) as { applications: LoanApplication[] }).applications;
}

export async function listAllApplications(): Promise<LoanApplication[]> {
  if (!isSupabaseConfigured()) return listMockAll();
  const res = await fetch("/api/portal/applications?scope=all", { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401) return listMockAll();
    throw new Error("Failed to load applications");
  }
  return ((await res.json()) as { applications: LoanApplication[] }).applications;
}

export async function filterApplicationsForRole(role: UserRole): Promise<LoanApplication[]> {
  if (!isSupabaseConfigured()) return filterMockForRole(role);
  const res = await fetch(`/api/portal/applications?scope=role&role=${role}`, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401) return filterMockForRole(role);
    throw new Error("Failed to load pipeline");
  }
  return ((await res.json()) as { applications: LoanApplication[] }).applications;
}

export async function getApplicationById(id: string): Promise<LoanApplication | null> {
  if (!isSupabaseConfigured()) return getMockApplicationById(id) ?? null;
  const res = await fetch(`/api/portal/applications/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    if (res.status === 401) return getMockApplicationById(id) ?? null;
    throw new Error("Failed to load application");
  }
  return ((await res.json()) as { application: LoanApplication }).application;
}

export async function getApplicationDetail(id: string): Promise<{
  application: LoanApplication | null;
  events: StatusEvent[];
  documents: Document[];
  conditions: Condition[];
  borrower: User | null;
}> {
  if (!isSupabaseConfigured()) {
    const application = getMockApplicationById(id) ?? null;
    return {
      application,
      events: application ? getMockStatusEvents(id) : [],
      documents: application ? getMockDocuments(id) : [],
      conditions: application ? getMockConditions(id) : [],
      borrower: application ? getMockUserById(application.borrower_id) ?? null : null,
    };
  }
  const res = await fetch(`/api/portal/applications/${id}`, { cache: "no-store" });
  if (!res.ok) {
    if (res.status === 401 || res.status === 404) {
      const application = res.status === 404 ? null : getMockApplicationById(id) ?? null;
      return {
        application,
        events: application ? getMockStatusEvents(id) : [],
        documents: application ? getMockDocuments(id) : [],
        conditions: application ? getMockConditions(id) : [],
        borrower: application ? getMockUserById(application.borrower_id) ?? null : null,
      };
    }
    throw new Error("Failed to load application");
  }
  return res.json();
}

export async function updateApplicationPackage(
  applicationId: string,
  pkg: ApplicationPackage,
): Promise<LoanApplication> {
  if (!isSupabaseConfigured()) return updateMockPackage(applicationId, pkg);
  const res = await fetch(`/api/applications/${applicationId}/package`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ package: pkg }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Failed to update package");
  return body.application as LoanApplication;
}

export async function uploadApplicationDocument(
  applicationId: string,
  file: File,
  docType: string,
): Promise<Document> {
  if (!isSupabaseConfigured()) {
    const { addMockDocument } = await import("@/lib/mock/actions");
    return addMockDocument(applicationId, {
      file_name: file.name,
      doc_type: docType,
      file_size_bytes: file.size,
      mime_type: file.type || null,
    });
  }
  const form = new FormData();
  form.set("file", file);
  form.set("doc_type", docType);
  const res = await fetch(`/api/applications/${applicationId}/documents`, {
    method: "POST",
    body: form,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Upload failed");
  return body.document as Document;
}

export async function getUserById(id: string): Promise<User | undefined> {
  if (!isSupabaseConfigured()) return getMockUserById(id);
  const res = await fetch(`/api/portal/users/${id}`, { cache: "no-store" });
  if (!res.ok) return getMockUserById(id);
  return ((await res.json()) as { user: User }).user;
}

export async function listProcessorUsers(): Promise<User[]> {
  if (!isSupabaseConfigured()) return listMockProcessors();
  const res = await fetch("/api/portal/users?role=processor", { cache: "no-store" });
  if (!res.ok) return listMockProcessors();
  return ((await res.json()) as { users: User[] }).users;
}

export async function listOrgsByType(
  orgType: "lender" | "escrow" | "processor",
): Promise<Organization[]> {
  if (!isSupabaseConfigured()) return listMockOrgsByType(orgType);
  const res = await fetch(`/api/portal/organizations?type=${orgType}`, { cache: "no-store" });
  if (!res.ok) return listMockOrgsByType(orgType);
  return ((await res.json()) as { organizations: Organization[] }).organizations;
}

export function listOrganizationsLocalFallback(): Organization[] {
  return mockOrganizations;
}

export {
  resolveMockBorrowerId as resolveBorrowerId,
  getPackageCompleteness,
  displayName,
  hasServiceRole,
};
