"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getUserById,
  listAllApplications,
  listOrganizationsLocalFallback,
} from "@/lib/data/applications";
import { usesSupabaseData } from "@/lib/data/source";
import { applicationStatusLabels } from "@/lib/labels/status-labels";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import type { LoanApplication, Organization, User } from "@/lib/types/database";

export default function VaultAssignmentsPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<Record<string, User | undefined>>({});

  useEffect(() => {
    void (async () => {
      const list = await listAllApplications();
      setApps(list);
      if (usesSupabaseData()) {
        const res = await fetch("/api/portal/organizations");
        const body = await res.json().catch(() => ({}));
        setOrgs(body.organizations ?? []);
      } else {
        setOrgs(listOrganizationsLocalFallback());
      }
      const map: Record<string, User | undefined> = {};
      for (const app of list) {
        if (app.assigned_processor_id && !(app.assigned_processor_id in map)) {
          map[app.assigned_processor_id] = await getUserById(app.assigned_processor_id);
        }
        if (app.borrower_id && !(app.borrower_id in map)) {
          map[app.borrower_id] = await getUserById(app.borrower_id);
        }
      }
      setUsers(map);
    })();
  }, []);

  function orgName(id: string | null) {
    if (!id) return "Unassigned";
    return orgs.find((o) => o.id === id)?.name ?? id;
  }

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
              <tr key={app.id}>
                <td className="px-4 py-3">
                  <Link href={`/portal/vault/applications/${app.id}`} className="font-semibold text-green">
                    {app.reference_code}
                  </Link>
                </td>
                <td className="px-4 py-3 text-charcoal">
                  {users[app.borrower_id]?.full_name ?? app.borrower_id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-charcoal">
                  {users[app.assigned_processor_id ?? ""]?.full_name ?? orgName(app.processor_org_id)}
                </td>
                <td className="px-4 py-3 text-charcoal">{orgName(app.lender_org_id)}</td>
                <td className="px-4 py-3 text-charcoal">{orgName(app.escrow_org_id)}</td>
                <td className="px-4 py-3 text-charcoal">
                  {applicationStatusLabels[app.status]?.label ?? app.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PortalPanel>
    </div>
  );
}
