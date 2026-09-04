"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PortalPageHeader, PortalPanel, PortalSectionCard, PortalStat } from "@/components/portal/PortalUi";
import { filterApplicationsForRole } from "@/lib/mock/actions";
import {
  listApplicationsForBorrower,
  resolveBorrowerId,
  getUserById,
} from "@/lib/mock/applications";
import { getSession, setMockSessionUserId, users } from "@/lib/mock/data";
import { applicationStatusLabels, loanTypeLabels } from "@/lib/mock/status-labels";
import { navByRole, roleLabels } from "@/lib/portal/nav";
import type { LoanApplication, UserRole } from "@/lib/types/database";

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function recentApps(apps: LoanApplication[], limit = 5) {
  return [...apps]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, limit);
}

export function PortalOverview({ role }: { role: UserRole }) {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [name, setName] = useState("");

  const groups = navByRole[role];
  const shortcuts = groups.flatMap((g) => g.items).filter((i) => !i.exact && i.href !== "/apply");

  const detailBase =
    role === "borrower" ? "/portal/borrower/applications" : `/portal/${role}/applications`;

  // Ensure mock session matches this overview role before reading pipeline data
  useEffect(() => {
    const user = users.find((u) => u.role === role);
    if (user) setMockSessionUserId(user.id);
    const session = getSession();
    setName(session.user.full_name);
    if (role === "borrower") {
      const id = resolveBorrowerId();
      setApps(listApplicationsForBorrower(id));
      setName(getUserById(id)?.full_name ?? session.user.full_name);
    } else {
      setApps(filterApplicationsForRole(role));
    }
  }, [role]);

  const stats = useMemo(() => {
    const active = apps.filter((a) => a.status !== "funded" && a.status !== "denied");
    const funded = apps.filter((a) => a.status === "funded");
    const review = apps.filter((a) =>
      ["application_submitted", "initial_review", "info_requested", "underwriting"].includes(
        a.status,
      ),
    );
    return { total: apps.length, active: active.length, funded: funded.length, review: review.length };
  }, [apps]);

  return (
    <div>
      <PortalPageHeader
        eyebrow={roleLabels[role]}
        title="Overview"
        description={`Welcome back, ${name}. Jump into any page in the sidebar — this workspace lists everything ${roleLabels[role].toLowerCase()} can access.`}
        actions={
          role === "borrower" ? (
            <Button href="/apply" shine>
              New application
            </Button>
          ) : (
            <Button href={`/portal/${role}/pipeline`} variant="secondary">
              Open pipeline
            </Button>
          )
        }
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStat label="Files in view" value={stats.total} />
        <PortalStat label="Active" value={stats.active} hint="Not funded or denied" />
        <PortalStat label="Needs attention" value={stats.review} hint="Review / UW / info" />
        <PortalStat label="Funded" value={stats.funded} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
            Recent files
          </h2>
          <PortalPanel className="mt-4 overflow-hidden">
            {recentApps(apps).length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.9375rem] text-steel">
                No files in this workspace yet.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recentApps(apps).map((app) => (
                  <li key={app.id}>
                    <Link
                      href={`${detailBase}/${app.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-paper/80"
                    >
                      <div>
                        <p className="font-mono text-[0.75rem] text-steel">{app.reference_code}</p>
                        <p className="mt-0.5 text-[0.9375rem] font-medium text-ink">
                          {app.property_address}
                        </p>
                        <p className="mt-0.5 text-[0.8125rem] text-steel">
                          {loanTypeLabels[app.loan_type]} · {formatMoney(app.loan_amount)}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-soft px-2.5 py-1 text-[0.75rem] font-semibold text-green">
                        {applicationStatusLabels[app.status].label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </PortalPanel>
        </div>

        <div>
          <h2 className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
            Your pages
          </h2>
          <p className="mt-1 text-[0.875rem] text-steel">
            Same links as the sidebar — use these as shortcuts.
          </p>
          <ul className="mt-4 space-y-3">
            {shortcuts.slice(0, 6).map((item) => (
              <li key={item.href}>
                <PortalSectionCard
                  title={item.label}
                  body={`Open the ${item.label.toLowerCase()} view for this role.`}
                  href={item.href}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
