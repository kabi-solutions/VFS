"use client";

import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function BorrowerNotificationsPage() {
  return (
    <PortalPlaceholderPage
      role="borrower"
      title="Notifications"
      description="Status and document alerts for your files. Live delivery wiring comes later."
    >
      <ul className="space-y-3 text-[0.9375rem] text-charcoal">
        {/* PLACEHOLDER — mock inbox rows for demo navigation */}
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Info requested on VFS-1002 — open the file to respond.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          New document marked received on VFS-1001.
        </li>
        <li className="rounded-xl bg-paper/80 px-4 py-3">
          Application status updated — check plain-language status on Overview.
        </li>
      </ul>
    </PortalPlaceholderPage>
  );
}
