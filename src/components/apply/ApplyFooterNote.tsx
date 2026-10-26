"use client";

/**
 * Production-safe disclosure under Apply.
 * Dev/mock banner is gated so placeholder "mock environment" copy never ships in production UI.
 */
export function ApplyFooterNote() {
  const showMock = process.env.NODE_ENV !== "production";

  return (
    <p className="mx-auto mt-8 max-w-[36rem] text-center text-[0.875rem] text-steel">
      {/* PLACEHOLDER — compliance disclosure / E-SIGN when live */}
      No rates or approvals are quoted on this form.
      {showMock ? (
        <span className="mt-2 block text-[0.8125rem] text-steel/80">
          {/* Dev-only: Submitting creates an application record and portal access in this mock environment. */}
          Dev preview — submissions persist in this browser.
        </span>
      ) : null}
    </p>
  );
}
