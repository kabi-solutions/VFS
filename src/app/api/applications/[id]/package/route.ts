import { NextResponse } from "next/server";
import { getPackageCompleteness, type ApplicationPackage } from "@/lib/apply/package";
import { mapApplication } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session-server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";
type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { id } = await params;
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { package?: ApplicationPackage };
  if (!body.package) return NextResponse.json({ error: "package is required" }, { status: 400 });

  const supabase = await createClient();
  const { data: app, error: loadError } = await supabase
    .from("loan_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError || !app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  const mapped = mapApplication(app as Record<string, unknown>);

  const { data: docs } = await supabase.from("documents").select("doc_type").eq("application_id", id);
  const docTypes = (docs ?? []).map((d) => String((d as { doc_type: string }).doc_type));
  const completeness = getPackageCompleteness(body.package, mapped.loan_type, docTypes);
  const { data: updated, error } = await supabase
    .from("loan_applications")
    .update({
      package: body.package,
      package_complete: completeness.missing.length === 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error || !updated) {
    return NextResponse.json({ error: error?.message || "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ application: mapApplication(updated as Record<string, unknown>) });
}
