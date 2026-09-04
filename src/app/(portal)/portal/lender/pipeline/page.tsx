"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function LenderPipelinePage() {
  return (
    <RolePipelinePage
      role="lender"
      title="Underwriting queue"
      blurb="Underwriting desk. Open a file to issue conditions, clear to close, or assign escrow."
    />
  );
}
