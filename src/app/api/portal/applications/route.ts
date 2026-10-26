import { NextResponse } from "next/server";
import { mapApplication } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ApplicationStatus, LoanApplication, UserRole } from "@/lib/types/database";
export const runtime = "nodejs";
const UW_PLUS: ApplicationStatus[] = ["underwriting","clear_to_close","closing_prep","signing_funding","funded"];
const PACKAGE_STAGES: ApplicationStatus[] = ["package_submission","info_requested","loi_issued"];
function sortForRole(apps: LoanApplication[], role: UserRole) {
  return [...apps].sort((a,b)=> new Date(b.updated_at).getTime()-new Date(a.updated_at).getTime());
}
function filterForRole(apps: LoanApplication[], role: UserRole, userId: string, orgId: string | null) {
  if (role === "borrower") return sortForRole(apps.filter(a=>a.borrower_id===userId), role);
  if (role === "processor") return sortForRole(apps.filter(a=>a.processor_org_id===orgId||a.assigned_processor_id===userId||(!a.assigned_processor_id&&PACKAGE_STAGES.includes(a.status))), role);
  if (role === "lender") return sortForRole(apps.filter(a=>a.lender_org_id===orgId||UW_PLUS.includes(a.status)), role);
  if (role === "escrow") return sortForRole(apps.filter(a=>a.escrow_org_id===orgId||["clear_to_close","closing_prep","signing_funding"].includes(a.status)), role);
  return sortForRole(apps, role);
}
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") || "role";
  const roleParam = (searchParams.get("role") as UserRole | null) || session.user.role;
  const supabase = await createClient();
  const { data, error } = await supabase.from("loan_applications").select("*").order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  let applications = (data ?? []).map(row => mapApplication(row as Record<string, unknown>));
  if (scope === "borrower" || roleParam === "borrower") applications = applications.filter(a => a.borrower_id === session.user.id);
  else if (scope === "role") applications = filterForRole(applications, roleParam, session.user.id, session.user.organization_id);
  else if (scope === "all" && session.user.role !== "vault") applications = filterForRole(applications, session.user.role, session.user.id, session.user.organization_id);
  return NextResponse.json({ applications });
}
