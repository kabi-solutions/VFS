import {
  assignEscrow as mockAssignEscrow,
  assignLender as mockAssignLender,
  assignProcessor as mockAssignProcessor,
  clearToClose as mockClearToClose,
  denyApplication as mockDeny,
  generateLoi as mockGenerateLoi,
  issueConditions as mockIssueConditions,
  markClosingPrep as mockClosingPrep,
  markDocumentStatus as mockMarkDoc,
  markFunded as mockFunded,
  markSigningFunding as mockSigning,
  requestInfo as mockRequestInfo,
  resolveInfoRequest as mockResolveInfo,
  startInitialReview as mockStartReview,
  submitPackageToLender as mockSubmitPackage,
  transitionStatus as mockTransition,
} from "@/lib/mock/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ApplicationStatus, DocumentStatus, LoanApplication } from "@/lib/types/database";

async function postAction(appId: string, body: Record<string, unknown>) {
  const res = await fetch(`/api/portal/applications/${appId}/actions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Action failed");
  return json;
}

export async function transitionStatus(appId: string, toStatus: ApplicationStatus, note?: string) {
  if (!isSupabaseConfigured()) return mockTransition(appId, toStatus, note);
  const { application } = await postAction(appId, { action: "transition", toStatus, note });
  return application as LoanApplication;
}

export async function denyApplication(appId: string, note?: string) {
  if (!isSupabaseConfigured()) return mockDeny(appId, note);
  return transitionStatus(appId, "denied", note ?? "Application denied.");
}

export async function startInitialReview(appId: string) {
  if (!isSupabaseConfigured()) return mockStartReview(appId);
  return transitionStatus(appId, "initial_review", "Vault opened initial review.");
}

export async function generateLoi(appId: string) {
  if (!isSupabaseConfigured()) return mockGenerateLoi(appId);
  return postAction(appId, { action: "generate_loi" });
}

export async function assignProcessor(appId: string, processorUserId: string) {
  if (!isSupabaseConfigured()) return mockAssignProcessor(appId, processorUserId);
  const { application } = await postAction(appId, { action: "assign_processor", processorUserId });
  return application as LoanApplication;
}

export async function assignLender(appId: string, lenderOrgId: string) {
  if (!isSupabaseConfigured()) return mockAssignLender(appId, lenderOrgId);
  const { application } = await postAction(appId, { action: "assign_lender", lenderOrgId });
  return application as LoanApplication;
}

export async function assignEscrow(appId: string, escrowOrgId: string) {
  if (!isSupabaseConfigured()) return mockAssignEscrow(appId, escrowOrgId);
  const { application } = await postAction(appId, { action: "assign_escrow", escrowOrgId });
  return application as LoanApplication;
}

export async function requestInfo(appId: string, note: string) {
  if (!isSupabaseConfigured()) return mockRequestInfo(appId, note);
  const { application } = await postAction(appId, { action: "request_info", note });
  return application as LoanApplication;
}

export async function resolveInfoRequest(appId: string) {
  if (!isSupabaseConfigured()) return mockResolveInfo(appId);
  const { application } = await postAction(appId, { action: "resolve_info" });
  return application as LoanApplication;
}

export async function submitPackageToLender(appId: string) {
  if (!isSupabaseConfigured()) return mockSubmitPackage(appId);
  return transitionStatus(appId, "underwriting", "Package submitted to lender for underwriting.");
}

export async function issueConditions(appId: string, descriptions: string[]) {
  if (!isSupabaseConfigured()) return mockIssueConditions(appId, descriptions);
  return postAction(appId, { action: "issue_conditions", descriptions });
}

export async function clearToClose(appId: string) {
  if (!isSupabaseConfigured()) return mockClearToClose(appId);
  return transitionStatus(appId, "clear_to_close", "Lender cleared file to close.");
}

export async function markClosingPrep(appId: string) {
  if (!isSupabaseConfigured()) return mockClosingPrep(appId);
  return transitionStatus(appId, "closing_prep", "Moved to closing preparation.");
}

export async function markSigningFunding(appId: string) {
  if (!isSupabaseConfigured()) return mockSigning(appId);
  return transitionStatus(appId, "signing_funding", "Signing and funding in progress.");
}

export async function markFunded(appId: string) {
  if (!isSupabaseConfigured()) return mockFunded(appId);
  return transitionStatus(appId, "funded", "File funded.");
}

export async function markDocumentStatus(docId: string, status: DocumentStatus, appId: string) {
  if (!isSupabaseConfigured()) return mockMarkDoc(docId, status);
  const { document } = await postAction(appId, { action: "mark_document", docId, status });
  return document;
}
