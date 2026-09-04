"use client";

import { useEffect, useMemo, useState } from "react";
import { listAllApplications } from "@/lib/mock/applications";
import { attributionSources } from "@/lib/mock/data";
import { PortalPageHeader, PortalPanel, PortalStat } from "@/components/portal/PortalUi";
import type { LoanApplication } from "@/lib/types/database";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function VaultReportingPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);

  useEffect(() => {
    setApps(listAllApplications());
  }, []);

  const volume = useMemo(
    () => apps.reduce((sum, a) => sum + a.loan_amount, 0),
    [apps],
  );
  const funded = apps.filter((a) => a.status === "funded");
  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    for (const app of apps) {
      const key = app.attribution_source_id ?? "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()];
  }, [apps]);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Vault ops"
        title="Attribution & reporting"
        description="Pipeline volume and attribution channels. Commission detail stays Vault-admin only when live."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <PortalStat label="Files" value={apps.length} />
        <PortalStat label="Pipeline volume" value={formatMoney(volume)} />
        <PortalStat label="Funded files" value={funded.length} />
      </div>
      <PortalPanel className="mt-8 overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-[1rem] font-semibold text-ink">By attribution source</h2>
        </div>
        <ul className="divide-y divide-line">
          {bySource.map(([id, count]) => {
            const label =
              attributionSources.find((s) => s.id === id)?.label ?? id;
            return (
              <li key={id} className="flex items-center justify-between px-5 py-3 text-[0.9375rem]">
                <span className="text-charcoal">{label}</span>
                <span className="font-semibold text-ink">{count}</span>
              </li>
            );
          })}
        </ul>
      </PortalPanel>
    </div>
  );
}
