import { NextResponse } from "next/server";
import { createApplicationServer } from "@/lib/data/server/create-application";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CreateApplicationInput } from "@/lib/mock/applications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured. Using mock mode on the client." }, { status: 503 });
  }
  if (!hasServiceRole()) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing. Set it on the server to create live applications." }, { status: 503 });
  }
  try {
    const body = (await request.json()) as CreateApplicationInput & { password?: string; establishSession?: boolean };
    if (!body.email?.trim() || !body.full_name?.trim() || !body.loan_type) {
      return NextResponse.json({ error: "Missing required application fields." }, { status: 400 });
    }
    if (body.loan_amount == null || Number.isNaN(Number(body.loan_amount))) {
      return NextResponse.json({ error: "loan_amount is required." }, { status: 400 });
    }
    const result = await createApplicationServer(body);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to create application" }, { status: 500 });
  }
}
