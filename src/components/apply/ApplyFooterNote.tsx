"use client";

/**
 * Production-safe disclosure under Apply.
 * Dev banner is gated so mock-only copy never ships in production UI.
 */
export function ApplyFooterNote() {
  const showMock = process.env.NODE_ENV !== "production";

  return (
    <p className="mx-auto mt-8 max-w-[36rem] text-center text-[0.875rem] text-steel">
      {/* PLACEHOLDER — compliance disclosure / E-SIGN when live */}
      No rates or approvals are quoted on this form.
      {showMock ? (
        <span className="mt-2 block text-[0.8125rem] text-steel/80">
          {/* Dev-only note — not shown in production builds */}
          Dev preview — submissions persist in this browser.
        </span>
      ) : null}
    </p>
  );
}
