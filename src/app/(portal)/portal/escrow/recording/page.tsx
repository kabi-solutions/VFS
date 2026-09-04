"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function EscrowRecordingPage() {
  return (
    <RolePipelinePage
      role="escrow"
      title="Recording status"
      blurb="Files in signing/funding or funded. Open a file to advance closing steps."
      statusFilter={["signing_funding", "funded"]}
    />
  );
}
