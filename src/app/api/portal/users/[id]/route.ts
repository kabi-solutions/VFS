import { NextResponse } from "next/server";
import { mapUser } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session";
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
  const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ user: mapUser(data as Record<string, unknown>) });
}
