"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { listApplicationsForBorrower } from "@/lib/data/applications";
import { getAppSession } from "@/lib/data/session";
import { applicationStatusLabels, loanTypeLabels } from "@/lib/mock/status-labels";
import type { LoanApplication } from "@/lib/types/database";

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function BorrowerApplicationsPage() {
  const [apps, setApps] = useState<LoanApplication[]>([]);
  const [borrowerName, setBorrowerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await getAppSession();
        if (!cancelled) setBorrowerName(session?.user.full_name ?? "Borrower");
        const list = await listApplicationsForBorrower(session?.user.id);
        if (!cancelled) setApps(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-steel">Borrower</p>
          <h1 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">Applications</h1>
          <p className="mt-2 text-[0.9375rem] text-steel">Signed in as {borrowerName}. Status stays plain-language — no invented rates.</p>
        </div>
        <Button href="/apply" shine>Start new application</Button>
      </div>
      {error ? <p className="mt-6 text-[0.875rem] font-medium text-red-700" role="alert">{error}</p> : null}
      {apps.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-black/[0.04]">
          <p className="text-[1.0625rem] text-charcoal">No applications on this account yet.</p>
          <div className="mt-6"><Button href="/apply" shine>Apply now</Button></div>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {apps.map((app) => {
            const status = applicationStatusLabels[app.status];
            return (
              <li key={app.id}>
                <Link href={`/portal/borrower/applications/${app.id}`} className="block rounded-2xl bg-white px-5 py-4 ring-1 ring-black/[0.04] transition hover:ring-green/40">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.8125rem] text-steel">{app.reference_code}</p>
                      <p className="mt-1 text-[1.0625rem] font-semibold text-ink">{app.property_address}</p>
                      <p className="mt-1 text-[0.875rem] text-steel">{app.property_city}, {app.property_state} · {loanTypeLabels[app.loan_type]} · {formatMoney(app.loan_amount)}</p>
                    </div>
                    <span className="rounded-full bg-green-soft px-3 py-1 text-[0.75rem] font-semibold text-green">{status.label}</span>
                  </div>
                  <p className="mt-3 text-[0.875rem] text-steel">{status.plain}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
