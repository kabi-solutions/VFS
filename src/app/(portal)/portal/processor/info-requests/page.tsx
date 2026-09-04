"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function ProcessorInfoRequestsPage() {
  return (
    <RolePipelinePage
      role="processor"
      title="Info requests"
      blurb="Files waiting on borrower or package information. Open a file to review requests and advance packaging."
      statusFilter={["info_requested"]}
    />
  );
}
