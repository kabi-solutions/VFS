"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { filterApplicationsForRole, getApplicationDetail } from "@/lib/data/applications";
import type { Condition } from "@/lib/types/database";

type CondRow = Condition & { reference_code: string };

export default function LenderConditionsPage() {
  const [rows, setRows] = useState<CondRow[]>([]);

  useEffect(() => {
    void (async () => {
      const apps = await filterApplicationsForRole("lender");
      const conds: CondRow[] = [];
      for (const app of apps) {
        const detail = await getApplicationDetail(app.id);
        for (const c of detail.conditions) {
          conds.push({ ...c, reference_code: app.reference_code });
        }
      }
      setRows(conds);
    })();
  }, []);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Lender"
        title="Conditions"
        description="Conditions across files assigned to your lender organization."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.9375rem] text-steel">
            No conditions on assigned files yet.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/portal/lender/applications/${c.application_id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div>
                    <p className="text-[1rem] font-semibold text-ink">{c.description}</p>
                    <p className="mt-1 text-[0.8125rem] text-steel">{c.reference_code}</p>
                  </div>
                  <span className="text-[0.8125rem] text-steel">{c.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PortalPanel>
    </div>
  );
}
