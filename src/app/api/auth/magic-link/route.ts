import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = (await request.json()) as { email?: string; next?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const nextPath = body.next?.startsWith("/") ? body.next : "/portal";
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(nextPath)}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Best-effort audit of login challenge (no loan_id).
  try {
    await supabase.from("audit_events").insert({
      actor_id: null,
      actor_role: null,
      loan_id: null,
      action: "auth.magic_link_requested",
      before_state: null,
      after_state: { email },
    });
  } catch {
    /* audit insert may fail without vault session — non-blocking */
  }

  return NextResponse.json({ ok: true });
}
