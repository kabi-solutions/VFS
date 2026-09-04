"use client";

import { useEffect, useState } from "react";
import { PortalPlaceholderPage } from "@/components/portal/PortalPlaceholderPage";
import { getSession } from "@/lib/mock/data";

export default function ProcessorSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const session = getSession();
    setName(session.user.full_name);
    setEmail(session.user.email);
  }, []);

  return (
    <PortalPlaceholderPage
      role="processor"
      title="Settings"
      description="Profile from the current mock session."
    >
      <dl className="space-y-4 text-[0.9375rem]">
        <div>
          <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-steel">
            Name
          </dt>
          <dd className="mt-1 font-medium text-ink">{name || "—"}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-steel">
            Email
          </dt>
          <dd className="mt-1 font-medium text-ink">{email || "—"}</dd>
        </div>
      </dl>
    </PortalPlaceholderPage>
  );
}
