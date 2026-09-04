"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listAllApplications, getUserById } from "@/lib/mock/applications";
import { organizations } from "@/lib/mock/data";
import { applicationStatusLabels } from "@/lib/mock/status-labels";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import type { LoanApplication } from "@/lib/types/database";

function orgName(id: string | null) {
  if (!id) return "Unassigned";
  return organizations.find((o) => o.id === id)?.name ?? id;
}

export default function VaultAssignmentsPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);

  useEffect(() => {
    setApps(listAllApplications());
  }, []);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Vault ops"
        title="Assignments"
        description="Processor, lender, and escrow org assignment status across the pipeline."
      />
      <PortalPanel className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-[0.875rem]">
          <thead className="border-b border-line text-[0.75rem] uppercase tracking-[0.04em] text-steel">
            <tr>
              <th className="px-4 py-3 font-semibold">File</th>
              <th className="px-4 py-3 font-semibold">Borrower</th>
              <th className="px-4 py-3 font-semibold">Processor</th>
              <th className="px-4 py-3 font-semibold">Lender</th>
              <th className="px-4 py-3 font-semibold">Escrow</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {apps.map((app) => (
              <tr key={app.id} className="hover:bg-paper/80">
                <td className="px-4 py-3">
                  <Link
                    href={`/portal/vault/applications/${app.id}`}
                    className="font-mono text-[0.8125rem] font-medium text-green"
                  >
                    {app.reference_code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal">
                  {getUserById(app.borrower_id)?.full_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-charcoal">{orgName(app.processor_org_id)}</td>
                <td className="px-4 py-3 text-charcoal">{orgName(app.lender_org_id)}</td>
                <td className="px-4 py-3 text-charcoal">{orgName(app.escrow_org_id)}</td>
                <td className="px-4 py-3 text-steel">
                  {applicationStatusLabels[app.status].label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PortalPanel>
    </div>
  );
}
