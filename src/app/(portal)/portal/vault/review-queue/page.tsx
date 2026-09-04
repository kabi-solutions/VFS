"use client";

import { RolePipelinePage } from "@/components/portal/RolePipelinePage";

export default function VaultReviewQueuePage() {
  return (
    <RolePipelinePage
      role="vault"
      title="Review queue"
      blurb="Files waiting for Vault initial review or mid-review decisions."
      statusFilter={["application_submitted", "initial_review"]}
    />
  );
}
