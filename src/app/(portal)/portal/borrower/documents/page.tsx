"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { getApplicationDetail, listApplicationsForBorrower } from "@/lib/data/applications";
import type { Document, LoanApplication } from "@/lib/types/database";

type DocRow = Document & { reference_code: string };

export default function BorrowerDocumentsPage() {
  const [rows, setRows] = useState<DocRow[]>([]);

  useEffect(() => {
    void (async () => {
      const apps = await listApplicationsForBorrower();
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
        eyebrow="Borrower"
        title="Documents"
        description="Files across your applications. Open a row to work in that file’s workspace."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-[0.9375rem] text-steel">No documents uploaded yet.</p>
            <Link href="/apply" className="mt-4 inline-block text-[0.9375rem] font-semibold text-green">
              Start a file
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/portal/borrower/applications/${doc.application_id}`}
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
