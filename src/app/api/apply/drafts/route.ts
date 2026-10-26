import { NextResponse } from "next/server";
import { getServerAppSession } from "@/lib/data/session-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

/** List or create apply drafts (C2). Authenticated users use RLS; anonymous uses service role + email. */
export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const session = await getServerAppSession();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (session) {
    const supabase = await createClient();
    if (id) {
      const { data, error } = await supabase.from("apply_drafts").select("*").eq("id", id).maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ draft: data });
    }
    const { data, error } = await supabase
      .from("apply_drafts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ drafts: data ?? [] });
  }

  if (!email || !hasServiceRole()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("apply_drafts")
    .select("*")
    .eq("owner_email", email)
    .order("updated_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ drafts: data ?? [] });
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const session = await getServerAppSession();
  const body = (await request.json()) as {
    id?: string;
    owner_email?: string;
    location?: unknown;
    loan_type?: string;
    package?: unknown;
    pending_docs?: unknown;
  };
  const now = new Date().toISOString();
  const row = {
    location: body.location ?? {},
    loan_type: body.loan_type ?? null,
    package: body.package ?? {},
    pending_docs: body.pending_docs ?? [],
    updated_at: now,
    owner_user_id: session?.user.id ?? null,
    owner_email: (body.owner_email || session?.user.email || "").trim().toLowerCase() || null,
  };

  if (session) {
    const supabase = await createClient();
    if (body.id) {
      const { data, error } = await supabase
        .from("apply_drafts")
        .update(row)
        .eq("id", body.id)
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ draft: data });
    }
    const { data, error } = await supabase.from("apply_drafts").insert(row).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ draft: data }, { status: 201 });
  }

  if (!row.owner_email || !hasServiceRole()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createAdminClient();
  if (body.id) {
    const { data, error } = await admin
      .from("apply_drafts")
      .update(row)
      .eq("id", body.id)
      .eq("owner_email", row.owner_email)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ draft: data });
  }
  const { data, error } = await admin.from("apply_drafts").insert(row).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ draft: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const session = await getServerAppSession();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = await createClient();
  const { error } = await supabase.from("apply_drafts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
