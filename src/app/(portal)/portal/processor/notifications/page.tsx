"use client";

import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function ProcessorNotificationsPage() {
  return (
    <PortalPlaceholderPage
      role="processor"
      title="Notifications"
      description="Workqueue alerts for packaging and info requests. Live delivery is not wired yet."
    >
      <ul className="space-y-3 text-[0.9375rem] text-charcoal">
        {/* PLACEHOLDER — mock inbox rows */}
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          New file assigned for packaging review.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Borrower uploaded documents on an info-requested file.
        </li>
      </ul>
    </PortalPlaceholderPage>
  );
}
