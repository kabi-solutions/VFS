import { NextResponse } from "next/server";
import { mapApplication, mapCondition, mapDocument, mapStatusEvent, mapUser } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session-server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };
export async function GET(_request: Request, { params }: Params) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const supabase = await createClient();
  const { data: app, error } = await supabase.from("loan_applications").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const application = mapApplication(app as Record<string, unknown>);
  const [{ data: events }, { data: documents }, { data: conditions }, { data: borrower }] = await Promise.all([
    supabase.from("status_events").select("*").eq("application_id", id).order("created_at", { ascending: true }),
    supabase.from("documents").select("*").eq("application_id", id).order("created_at", { ascending: false }),
    supabase.from("conditions").select("*").eq("application_id", id).order("created_at", { ascending: true }),
    supabase.from("users").select("*").eq("id", application.borrower_id).maybeSingle(),
  ]);
  return NextResponse.json({
    application,
    events: (events ?? []).map(r => mapStatusEvent(r as Record<string, unknown>)),
    documents: (documents ?? []).map(r => mapDocument(r as Record<string, unknown>)),
    conditions: (conditions ?? []).map(r => mapCondition(r as Record<string, unknown>)),
    borrower: borrower ? mapUser(borrower as Record<string, unknown>) : null,
  });
}
