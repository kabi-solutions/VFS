"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { filterApplicationsForRole } from "@/lib/mock/actions";
import { getConditionsForApplication } from "@/lib/mock/applications";
import type { Condition } from "@/lib/types/database";

type CondRow = Condition & { reference_code: string };

export default function LenderConditionsPage() {
  const [rows, setRows] = useState<CondRow[]>([]);

  useEffect(() => {
    const apps = filterApplicationsForRole("lender");
    const conds: CondRow[] = apps.flatMap((app) =>
      getConditionsForApplication(app.id).map((c) => ({
        ...c,
        reference_code: app.reference_code,
      })),
    );
    setRows(conds);
  }, []);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Lender"
        title="Conditions"
        description="Conditions across files in your underwriting filter. Issue and clear them on the file workspace."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.9375rem] text-steel">
            No conditions on filtered files yet. Open a file workspace to issue conditions.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/portal/lender/applications/${c.application_id}`}
                  className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 transition hover:bg-paper/80"
                >
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-ink">{c.description}</p>
                    <p className="mt-1 text-[0.8125rem] text-steel">{c.reference_code}</p>
                  </div>
                  <span className="rounded-full bg-green-soft px-2.5 py-1 text-[0.75rem] font-semibold capitalize text-green">
                    {c.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PortalPanel>
    </div>
  );
}
