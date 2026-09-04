"use client";

import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function VaultNotificationsPage() {
  return (
    <PortalPlaceholderPage
      role="vault"
      title="Notifications"
      description="Ops alerts across review, assignments, and funding. Live delivery is not wired yet."
    >
      <ul className="space-y-3 text-[0.9375rem] text-charcoal">
        {/* PLACEHOLDER — mock inbox rows */}
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          New application submitted for initial review.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Processor assignment completed on a mid-funnel file.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          File marked funded — attribution reporting updated.
        </li>
      </ul>
    </PortalPlaceholderPage>
  );
}
