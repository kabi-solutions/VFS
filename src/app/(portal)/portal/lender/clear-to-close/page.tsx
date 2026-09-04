"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function LenderClearToClosePage() {
  return (
    <RolePipelinePage
      role="lender"
      title="Clear to close"
      blurb="Files marked clear to close. Open a file to assign escrow or continue toward funding."
      statusFilter={["clear_to_close"]}
    />
  );
}
