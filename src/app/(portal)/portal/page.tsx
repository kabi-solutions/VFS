"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/mock/data";
import { hydrateMockApplicationsFromStorage } from "@/lib/mock/applications";
import { firstNavHref } from "@/lib/portal/nav";

export default function PortalHubPage() {
  const router = useRouter();

  useEffect(() => {
    hydrateMockApplicationsFromStorage();
    const session = getSession();
    router.replace(firstNavHref(session.user.role));
  }, [router]);

  return (
    <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-black/[0.04]">
      <p className="text-[0.9375rem] text-steel">Routing to your workspace…</p>
    </div>
  );
}
