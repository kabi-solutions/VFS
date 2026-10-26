"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAppSession } from "@/lib/data/session";
import { usesSupabaseData } from "@/lib/data/source";
import { hydrateMockApplicationsFromStorage } from "@/lib/mock/applications";
import { firstNavHref } from "@/lib/portal/nav";

export default function PortalHubPage() {
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      if (!usesSupabaseData()) hydrateMockApplicationsFromStorage();
      const session = await getAppSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      router.replace(firstNavHref(session.user.role));
    })();
  }, [router]);

  return (
    <div className="rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-black/[0.04]">
      <p className="text-[0.9375rem] text-steel">Routing to your workspace…</p>
    </div>
  );
}
