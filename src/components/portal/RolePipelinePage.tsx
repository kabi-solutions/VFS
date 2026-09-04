"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { filterApplicationsForRole } from "@/lib/mock/actions";
import { getUserById } from "@/lib/mock/applications";
import { applicationStatusLabels, loanTypeLabels } from "@/lib/mock/status-labels";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { roleLabels } from "@/lib/portal/nav";
import type { ApplicationStatus, LoanApplication, UserRole } from "@/lib/types/database";

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const defaults: Record<
  Exclude<UserRole, "borrower">,
  { title: string; blurb: string }
> = {
  vault: {
    title: "Pipeline",
    blurb: "All files across the funnel. Open a file to review, issue LOIs, assign processors, or deny.",
  },
  processor: {
    title: "Pipeline",
    blurb: "Package and info-request workqueue. Open a file to request info, assign a lender, or submit to UW.",
  },
  lender: {
    title: "Underwriting queue",
    blurb: "Underwriting desk. Open a file to issue conditions, clear to close, or assign escrow.",
  },
  escrow: {
    title: "Closing queue",
    blurb: "Closing prep and funding coordination. Open a file to advance signing and mark funded.",
  },
};

export function RolePipelinePage({
  role,
  title,
  blurb,
  statusFilter,
}: {
  role: Exclude<UserRole, "borrower">;
  title?: string;
  blurb?: string;
  statusFilter?: ApplicationStatus[];
}) {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const copy = defaults[role];

  useEffect(() => {
    setApps(filterApplicationsForRole(role));
  }, [role]);

  const visible = useMemo(() => {
    if (!statusFilter?.length) return apps;
    return apps.filter((a) => statusFilter.includes(a.status));
  }, [apps, statusFilter]);

  return (
    <div>
      <PortalPageHeader
        eyebrow={roleLabels[role]}
        title={title ?? copy.title}
        description={blurb ?? copy.blurb}
      />

      <PortalPanel className="mt-8 overflow-x-auto">
        <table className="min-w-full text-left text-[0.875rem]">
          <thead className="border-b border-line text-[0.75rem] uppercase tracking-[0.04em] text-steel">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Property</th>
              <th className="px-4 py-3 font-semibold">Borrower</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((app) => {
              const borrower = getUserById(app.borrower_id);
              return (
                <tr key={app.id} className="hover:bg-paper/80">
                  <td className="px-4 py-3 font-mono text-[0.8125rem]">
                    <Link
                      href={`/portal/${role}/applications/${app.id}`}
                      className="font-medium text-green hover:text-green-hover"
                    >
                      {app.reference_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {app.property_city}, {app.property_state}
                  </td>
                  <td className="px-4 py-3 text-charcoal">{borrower?.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal">{loanTypeLabels[app.loan_type]}</td>
                  <td className="px-4 py-3 text-charcoal">{formatMoney(app.loan_amount)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-green-soft px-2.5 py-1 text-[0.75rem] font-semibold text-green">
                      {applicationStatusLabels[app.status].label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 ? (
          <p className="px-4 py-8 text-center text-steel">No applications in this view.</p>
        ) : null}
      </PortalPanel>
    </div>
  );
}
