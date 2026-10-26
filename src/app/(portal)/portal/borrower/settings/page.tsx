"use client";

import { useEffect, useState } from "react";
import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";
import { getAppSession } from "@/lib/data/session";

export default function BorrowerSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    void getAppSession().then((session) => {
      if (!session) return;
      setName(session.user.full_name);
      setEmail(session.user.email);
    });
  }, []);

  return (
    <PortalPlaceholderPage
      role="borrower"
      title="Settings"
      description="Profile details from your signed-in account."
    >
      <dl className="mt-6 space-y-3 text-[0.9375rem]">
        <div className="flex justify-between gap-4 border-b border-line pb-3">
          <dt className="text-steel">Name</dt>
          <dd className="font-medium text-ink">{name || "…"}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line pb-3">
          <dt className="text-steel">Email</dt>
          <dd className="font-medium text-ink">{email || "…"}</dd>
        </div>
      </dl>
    </PortalPlaceholderPage>
  );
}
