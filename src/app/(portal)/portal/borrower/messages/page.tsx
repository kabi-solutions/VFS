"use client";

import Link from "next/link";
import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";

export default function BorrowerMessagesPage() {
  return (
    <PortalPlaceholderPage
      role="borrower"
      title="Messages"
      description="Messaging threads attach to each file. Open an application workspace to review notes and requests on that file."
    >
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        No message threads yet. When processors or Vault leave notes on a file, they will show up
        here.
      </p>
      <Link
        href="/portal/borrower/applications"
        className="mt-4 inline-block text-[0.9375rem] font-medium text-green hover:text-green-hover"
      >
        Open applications
      </Link>
    </PortalPlaceholderPage>
  );
}
