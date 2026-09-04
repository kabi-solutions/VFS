"use client";

import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function LenderNotificationsPage() {
  return (
    <PortalPlaceholderPage
      role="lender"
      title="Notifications"
      description="Underwriting alerts for conditions and clear-to-close. Live delivery is not wired yet."
    >
      <ul className="space-y-3 text-[0.9375rem] text-charcoal">
        {/* PLACEHOLDER — mock inbox rows */}
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Package submitted for underwriting review.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Condition response received on an open file.
        </li>
      </ul>
    </PortalPlaceholderPage>
  );
}
