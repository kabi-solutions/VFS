"use client";

import { organizations } from "@/lib/mock/data";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";

export default function VaultOrganizationsPage() {
  return (
    <div>
      <PortalPageHeader
        eyebrow="Vault ops"
        title="Organizations"
        description="Processors, lenders, escrow firms, and pending capital partners in the mock network."
      />
      <PortalPanel className="mt-8 overflow-hidden">
        <ul className="divide-y divide-line">
          {organizations.map((org) => (
            <li key={org.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-[1rem] font-semibold text-ink">{org.name}</p>
                <p className="mt-1 text-[0.8125rem] text-steel">
                  {org.org_type.replaceAll("_", " ")} · {org.contact_email ?? "No email on file"}
                </p>
              </div>
              <span className="rounded-full bg-green-soft px-2.5 py-1 text-[0.75rem] font-semibold text-green">
                {org.status.replaceAll("_", " ")}
              </span>
            </li>
          ))}
        </ul>
      </PortalPanel>
    </div>
  );
}
