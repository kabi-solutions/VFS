import { NextResponse } from "next/server";
import { mapOrganization } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { OrgType } from "@/lib/types/database";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const type = new URL(request.url).searchParams.get("type") as OrgType | null;
  const supabase = await createClient();
  let query = supabase.from("organizations").select("*").eq("status", "active").order("name");
  if (type) query = query.eq("org_type", type);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ organizations: (data ?? []).map(r => mapOrganization(r as Record<string, unknown>)) });
}
