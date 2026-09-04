"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import {
  getDocumentsForApplication,
  listApplicationsForBorrower,
  resolveBorrowerId,
} from "@/lib/mock/applications";
import type { Document, LoanApplication } from "@/lib/types/database";

type DocRow = Document & { reference_code: string };

export default function BorrowerDocumentsPage() {
  const [rows, setRows] = useState<DocRow[]>([]);

  useEffect(() => {
    const borrowerId = resolveBorrowerId();
    const apps = listApplicationsForBorrower(borrowerId);
    const byId = new Map(apps.map((a: LoanApplication) => [a.id, a]));
    const docs: DocRow[] = apps.flatMap((app) =>
      getDocumentsForApplication(app.id).map((doc) => ({
        ...doc,
        reference_code: byId.get(app.id)?.reference_code ?? app.reference_code,
      })),
    );
    setRows(docs);
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
          <p className="px-5 py-10 text-center text-[0.9375rem] text-steel">
            No documents yet. Upload from an application workspace after you apply.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((doc) => (
              <li key={doc.id}>
                <Link
                  href={`/portal/borrower/applications/${doc.application_id}`}
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
