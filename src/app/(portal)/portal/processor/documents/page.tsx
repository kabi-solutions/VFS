"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { filterApplicationsForRole } from "@/lib/mock/actions";
import { getDocumentsForApplication } from "@/lib/mock/applications";
import type { Document } from "@/lib/types/database";

type DocRow = Document & { reference_code: string };

export default function ProcessorDocumentsPage() {
  const [rows, setRows] = useState<DocRow[]>([]);

  useEffect(() => {
    const apps = filterApplicationsForRole("processor");
    const docs: DocRow[] = apps.flatMap((app) =>
      getDocumentsForApplication(app.id).map((doc) => ({
        ...doc,
        reference_code: app.reference_code,
      })),
    );
    setRows(docs);
  }, []);

  return (
    <div>
      <PortalPageHeader
        eyebrow="Processor"
        title="Documents"
        description="Documents across files in your processor workqueue. Open a row to manage the file workspace."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-[0.9375rem] text-steel">
            No documents in the current processor filter.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/portal/processor/applications/${doc.application_id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-paper/80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.9375rem] font-medium text-ink">{doc.file_name}</p>
                    <p className="mt-1 text-[0.8125rem] text-steel">
                      {doc.doc_type.replaceAll("_", " ")} · {doc.reference_code}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-soft px-2.5 py-1 text-[0.75rem] font-semibold capitalize text-green">
                    {doc.status}
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
