import { NextResponse } from "next/server";
import { mapDocument } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session-server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
export const runtime = "nodejs";
const BUCKET = "application-documents";
const MAX_BYTES = 25 * 1024 * 1024;
type Params = { params: Promise<{ id: string }> };
export async function POST(request: Request, { params }: Params) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const { id: applicationId } = await params;
  const session = await getServerAppSession();
  if (!session && !hasServiceRole()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  const docType = String(form.get("doc_type") || "other");
  if (!(file instanceof File)) return NextResponse.json({ error: "file is required" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File exceeds 25MB limit" }, { status: 400 });
  const adminOrUser = hasServiceRole() ? createAdminClient() : await createClient();
  const { data: app } = await adminOrUser.from("loan_applications").select("id, borrower_id").eq("id", applicationId).maybeSingle();
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (session && session.user.role === "borrower" && String((app as { borrower_id: string }).borrower_id) !== session.user.id && !hasServiceRole()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const safeName = file.name.replace(/[^\w.\-()+ ]+/g, "_");
  const storage_path = `${applicationId}/${crypto.randomUUID()}-${safeName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadError } = await adminOrUser.storage.from(BUCKET).upload(storage_path, bytes, { contentType: file.type || "application/octet-stream", upsert: false });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
  const { data: docRow, error: docError } = await adminOrUser.from("documents").insert({
    application_id: applicationId, doc_type: docType, file_name: file.name, storage_path,
    mime_type: file.type || null, file_size_bytes: file.size, status: "pending", uploaded_by: session?.user.id ?? null,
  }).select("*").single();
  if (docError || !docRow) return NextResponse.json({ error: docError?.message || "Metadata insert failed" }, { status: 500 });
  return NextResponse.json({ document: mapDocument(docRow as Record<string, unknown>) }, { status: 201 });
}
