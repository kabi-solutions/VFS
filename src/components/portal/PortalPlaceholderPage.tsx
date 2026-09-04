"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PortalPageHeader, PortalPanel } from "@/components/portal/PortalUi";
import { roleLabels } from "@/lib/portal/nav";
import type { UserRole } from "@/lib/types/database";

const listHrefByRole: Record<UserRole, string> = {
  borrower: "/portal/borrower/applications",
  vault: "/portal/vault/pipeline",
  processor: "/portal/processor/pipeline",
  lender: "/portal/lender/pipeline",
  escrow: "/portal/escrow/pipeline",
};

/** Polished section page for demo surfaces that are not full CRUD yet */
export function PortalPlaceholderPage({
  role,
  title,
  description,
  children,
  actions,
}: {
  role: UserRole;
  title: string;
  description: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div>
      <PortalPageHeader
        eyebrow={roleLabels[role]}
        title={title}
        description={description}
        actions={actions}
      />
      <PortalPanel className="mt-8 px-6 py-8 sm:px-8">
        {children ?? (
          <p className="text-[0.9375rem] leading-relaxed text-steel">
            {/* PLACEHOLDER — wire live data / actions in a later pass */}
            This view is available in the {roleLabels[role]} workspace navigation. Demo data and
            mutations live primarily on Overview, Pipeline, and individual file workspaces.
          </p>
        )}
        <p className="mt-6 text-[0.875rem] text-steel">
          Prefer the file list?{" "}
          <Link
            href={listHrefByRole[role]}
            className="font-medium text-green hover:text-green-hover"
          >
            Open your primary list
          </Link>
          .
        </p>
      </PortalPanel>
    </div>
  );
}
