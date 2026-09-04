"use client";

import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function EscrowNotificationsPage() {
  return (
    <PortalPlaceholderPage
      role="escrow"
      title="Notifications"
      description="Closing and funding alerts. Live delivery is not wired yet."
    >
      <ul className="space-y-3 text-[0.9375rem] text-charcoal">
        {/* PLACEHOLDER — mock inbox rows */}
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          File assigned for closing prep.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Signing package ready for review.
        </li>
      </ul>
    </PortalPlaceholderPage>
  );
}
