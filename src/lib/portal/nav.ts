import type { UserRole } from "@/lib/types/database";

export type PortalNavItem = {
  href: string;
  label: string;
  /** Exact match only when true (avoids Overview highlighting every child) */
  exact?: boolean;
};

export type PortalNavGroup = {
  label: string;
  items: PortalNavItem[];
};

export const roleLabels: Record<UserRole, string> = {
  borrower: "Borrower",
  vault: "Vault ops",
  processor: "Processor",
  lender: "Lender",
  escrow: "Escrow",
};

export const roleHomes: Record<UserRole, string> = {
  borrower: "/portal/borrower",
  vault: "/portal/vault",
  processor: "/portal/processor",
  lender: "/portal/lender",
  escrow: "/portal/escrow",
};

/** Full SaaS nav — every page a role can open in the demo portal */
export const navByRole: Record<UserRole, PortalNavGroup[]> = {
  borrower: [
    {
      label: "Workspace",
      items: [
        { href: "/portal/borrower", label: "Overview", exact: true },
        { href: "/portal/borrower/applications", label: "Applications" },
        { href: "/portal/borrower/documents", label: "Documents" },
        { href: "/portal/borrower/messages", label: "Messages" },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/portal/borrower/notifications", label: "Notifications" },
        { href: "/portal/borrower/settings", label: "Settings" },
        { href: "/apply", label: "New application" },
      ],
    },
  ],
  vault: [
    {
      label: "Operations",
      items: [
        { href: "/portal/vault", label: "Overview", exact: true },
        { href: "/portal/vault/pipeline", label: "Pipeline" },
        { href: "/portal/vault/review-queue", label: "Review queue" },
        { href: "/portal/vault/assignments", label: "Assignments" },
      ],
    },
    {
      label: "Network",
      items: [
        { href: "/portal/vault/organizations", label: "Organizations" },
        { href: "/portal/vault/reporting", label: "Attribution & reporting" },
      ],
    },
    {
      label: "Communication",
      items: [
        { href: "/portal/vault/messages", label: "Messages" },
        { href: "/portal/vault/notifications", label: "Notifications" },
        { href: "/portal/vault/settings", label: "Settings" },
      ],
    },
  ],
  processor: [
    {
      label: "Workqueue",
      items: [
        { href: "/portal/processor", label: "Overview", exact: true },
        { href: "/portal/processor/pipeline", label: "Pipeline" },
        { href: "/portal/processor/info-requests", label: "Info requests" },
        { href: "/portal/processor/documents", label: "Documents" },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/portal/processor/messages", label: "Messages" },
        { href: "/portal/processor/notifications", label: "Notifications" },
        { href: "/portal/processor/settings", label: "Settings" },
      ],
    },
  ],
  lender: [
    {
      label: "Underwriting",
      items: [
        { href: "/portal/lender", label: "Overview", exact: true },
        { href: "/portal/lender/pipeline", label: "Underwriting queue" },
        { href: "/portal/lender/conditions", label: "Conditions" },
        { href: "/portal/lender/clear-to-close", label: "Clear to close" },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/portal/lender/messages", label: "Messages" },
        { href: "/portal/lender/notifications", label: "Notifications" },
        { href: "/portal/lender/settings", label: "Settings" },
      ],
    },
  ],
  escrow: [
    {
      label: "Closing",
      items: [
        { href: "/portal/escrow", label: "Overview", exact: true },
        { href: "/portal/escrow/pipeline", label: "Closing queue" },
        { href: "/portal/escrow/documents", label: "Document intake" },
        { href: "/portal/escrow/recording", label: "Recording status" },
      ],
    },
    {
      label: "Account",
      items: [
        { href: "/portal/escrow/messages", label: "Messages" },
        { href: "/portal/escrow/notifications", label: "Notifications" },
        { href: "/portal/escrow/settings", label: "Settings" },
      ],
    },
  ],
};

export function isNavItemActive(pathname: string, item: PortalNavItem): boolean {
  if (item.exact) return pathname === item.href;
  if (item.href === "/apply") return pathname.startsWith("/apply");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function firstNavHref(role: UserRole): string {
  return navByRole[role][0]?.items[0]?.href ?? roleHomes[role];
}
