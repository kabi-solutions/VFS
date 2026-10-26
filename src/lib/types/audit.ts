import type { UserRole } from "@/lib/types/database";

export type AuditEvent = {
  id: string;
  actor_id: string | null;
  actor_role: UserRole | null;
  loan_id: string | null;
  action: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  created_at: string;
};

/** Borrower-facing view — strip heavy package / PII blobs from states. */
export function redactAuditForBorrower(event: AuditEvent): AuditEvent {
  return {
    ...event,
    before_state: redactState(event.before_state),
    after_state: redactState(event.after_state),
  };
}

function redactState(state: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!state) return null;
  const next = { ...state };
  delete next.package;
  delete next.payload;
  if (typeof next.email === "string") next.email = "[redacted]";
  if (typeof next.phone === "string") next.phone = "[redacted]";
  return next;
}
