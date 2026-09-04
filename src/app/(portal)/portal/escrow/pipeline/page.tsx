"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function EscrowPipelinePage() {
  return (
    <RolePipelinePage
      role="escrow"
      title="Closing queue"
      blurb="Closing prep and funding coordination. Open a file to advance signing and mark funded."
    />
  );
}
