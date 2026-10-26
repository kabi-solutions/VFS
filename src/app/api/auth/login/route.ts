import { NextResponse } from "next/server";
import { mapOrganization, mapUser } from "@/lib/data/mappers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return NextResponse.json({ error: error?.message || "Invalid credentials" }, { status: 401 });

  let { data: profile } = await supabase.from("users").select("*").eq("auth_user_id", data.user.id).maybeSingle();
  if (!profile && hasServiceRole()) {
    const admin = createAdminClient();
    const { data: byEmail } = await admin.from("users").select("*").eq("email", email).maybeSingle();
    if (byEmail) {
      const { data: linked } = await admin.from("users").update({ auth_user_id: data.user.id }).eq("id", (byEmail as { id: string }).id).select("*").single();
      profile = linked;
    }
  }
  if (!profile) return NextResponse.json({ error: "Signed in, but no portal profile exists for this account yet." }, { status: 403 });

  const user = mapUser(profile as Record<string, unknown>);
  let organization = null;
  if (user.organization_id) {
    const { data: org } = await supabase.from("organizations").select("*").eq("id", user.organization_id).maybeSingle();
    if (org) organization = mapOrganization(org as Record<string, unknown>);
  }
  return NextResponse.json({ user, organization });
}
