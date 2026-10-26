import { NextResponse } from "next/server";
import { mapUser } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session-server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { UserRole } from "@/lib/types/database";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const session = await getServerAppSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = new URL(request.url).searchParams.get("role") as UserRole | null;
  const supabase = await createClient();
  let query = supabase.from("users").select("*").order("full_name");
  if (role) query = query.eq("role", role);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: (data ?? []).map(r => mapUser(r as Record<string, unknown>)) });
}
