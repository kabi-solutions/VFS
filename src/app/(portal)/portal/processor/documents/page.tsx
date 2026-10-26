"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { filterApplicationsForRole, getApplicationDetail } from "@/lib/data/applications";
import type { Document } from "@/lib/types/database";

type DocRow = Document & { reference_code: string };

export default function ProcessorDocumentsPage() {
  const [rows, setRows] = useState<DocRow[]>([]);

  useEffect(() => {
    void (async () => {
      const apps = await filterApplicationsForRole("processor");
      const docs: DocRow[] = [];
      for (const app of apps) {
        const detail = await getApplicationDetail(app.id);
        for (const doc of detail.documents) {
          docs.push({ ...doc, reference_code: app.reference_code });
        }
      }
      setRows(docs);
    })();
  }, []);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Processor"
        title="Documents"
        description="Documents across files assigned to your processor organization."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.9375rem] text-steel">
            No documents on assigned files.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/portal/processor/applications/${doc.application_id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div>
                    <p className="text-[1rem] font-semibold text-ink">{doc.file_name}</p>
                    <p className="mt-1 text-[0.8125rem] text-steel">
                      {doc.reference_code} · {doc.doc_type}
                    </p>
                  </div>
                  <span className="text-[0.8125rem] text-steel">{doc.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PortalPanel>
    </div>
  );
}
