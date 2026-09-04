import type { Metadata } from "next";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: {
    default: "Portal",
    template: "%s | Vault Portal",
  },
  description: "Vault borrower and partner portal workspace.",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
