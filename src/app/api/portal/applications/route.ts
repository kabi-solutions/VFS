import { NextResponse } from "next/server";
import { mapApplication } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session-server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { LoanApplication, UserRole } from "@/lib/types/database";

export const runtime = "nodejs";

function sortApps(apps: LoanApplication[]) {
  return [...apps].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

/** Assigned-only filter (A3). RLS already scopes rows; this mirrors session role. */
function filterForRole(
  apps: LoanApplication[],
  role: UserRole,
  userId: string,
  orgId: string | null,
) {
  if (role === "borrower") return sortApps(apps.filter((a) => a.borrower_id === userId));
  if (role === "processor") {
    return sortApps(
      apps.filter(
        (a) => a.assigned_processor_id === userId || (orgId != null && a.processor_org_id === orgId),
      ),
    );
  }
  if (role === "lender") {
    return sortApps(apps.filter((a) => orgId != null && a.lender_org_id === orgId));
  }
  if (role === "escrow") {
    return sortApps(apps.filter((a) => orgId != null && a.escrow_org_id === orgId));
  }
  return sortApps(apps);
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "role";
  // Never honor a spoofed role higher than the session role.
  const roleParam = session.user.role;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("loan_applications")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let applications = (data ?? []).map((row) => mapApplication(row as Record<string, unknown>));
  if (scope === "borrower" || roleParam === "borrower") {
    applications = applications.filter((a) => a.borrower_id === session.user.id);
  } else if (scope === "role" || (scope === "all" && session.user.role !== "vault")) {
    applications = filterForRole(
      applications,
      roleParam,
      session.user.id,
      session.user.organization_id,
    );
  }
  return NextResponse.json({ applications });
}
