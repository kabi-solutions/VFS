import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";

/**
 * Capital partner intake → pending organizations row (C4).
 * Uses service role for unauthenticated marketing submit (bootstrap only).
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const body = (await request.json()) as {
    firmName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    deployableCapital?: string;
    notes?: string;
  };
  const firmName = body.firmName?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!firmName || !email) {
    return NextResponse.json({ error: "Firm name and email are required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: org, error } = await admin
    .from("organizations")
    .insert({
      name: firmName,
      org_type: "capital_partner",
      status: "pending_review",
      contact_email: email,
      website: null,
    })
    .select("*")
    .single();
  if (error || !org) {
    return NextResponse.json({ error: error?.message || "Failed to create partner org" }, { status: 500 });
  }

  await admin.from("audit_events").insert({
    actor_id: null,
    actor_role: null,
    loan_id: null,
    action: "partner_application.submit",
    before_state: null,
    after_state: {
      organization_id: (org as { id: string }).id,
      contact_name: body.contactName?.trim() || null,
      email,
      phone: body.phone?.trim() || null,
      deployable_capital: body.deployableCapital?.trim() || null,
      notes: body.notes?.trim() || null,
    },
  });

  return NextResponse.json({ organization: org }, { status: 201 });
}
