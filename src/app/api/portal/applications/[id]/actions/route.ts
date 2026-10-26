import { NextResponse } from "next/server";
import { mapApplication, mapCondition, mapDocument } from "@/lib/data/mappers";
import { getServerAppSession } from "@/lib/data/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
import type { ApplicationStatus, DocumentStatus } from "@/lib/types/database";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

type ActionBody =
  | { action: "transition"; toStatus: ApplicationStatus; note?: string }
  | { action: "assign_processor"; processorUserId: string }
  | { action: "assign_lender"; lenderOrgId: string }
  | { action: "assign_escrow"; escrowOrgId: string }
  | { action: "request_info"; note: string }
  | { action: "resolve_info" }
  | { action: "issue_conditions"; descriptions: string[] }
  | { action: "mark_document"; docId: string; status: DocumentStatus }
  | { action: "generate_loi" };

export async function POST(request: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const session = await getServerAppSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as ActionBody;
  const db = hasServiceRole() ? createAdminClient() : await createClient();
  const now = new Date().toISOString();

  const { data: appRow, error: loadError } = await db
    .from("loan_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (loadError || !appRow) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const app = mapApplication(appRow as Record<string, unknown>);

  async function pushStatus(toStatus: ApplicationStatus, note?: string | null) {
    await db.from("status_events").insert({
      application_id: id,
      actor_id: session!.user.id,
      from_status: app.status,
      to_status: toStatus,
      note: note?.trim() || null,
    });
    const patch: Record<string, unknown> = {
      status: toStatus,
      updated_at: now,
    };
    if (toStatus === "denied") patch.denied_at = now;
    if (toStatus === "funded") patch.funded_at = now;
    if (toStatus !== "info_requested") patch.info_requested_from = null;
    const { data: updated, error } = await db
      .from("loan_applications")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message || "Status update failed");
    return mapApplication(updated as Record<string, unknown>);
  }

  try {
    switch (body.action) {
      case "transition": {
        const updated = await pushStatus(body.toStatus, body.note);
        return NextResponse.json({ application: updated });
      }
      case "assign_processor": {
        const { data: processor } = await db
          .from("users")
          .select("*")
          .eq("id", body.processorUserId)
          .eq("role", "processor")
          .maybeSingle();
        if (!processor) return NextResponse.json({ error: "Processor not found" }, { status: 404 });
        const { data: updated, error } = await db
          .from("loan_applications")
          .update({
            assigned_processor_id: body.processorUserId,
            processor_org_id: (processor as { organization_id: string | null }).organization_id,
            updated_at: now,
          })
          .eq("id", id)
          .select("*")
          .single();
        if (error || !updated) throw new Error(error?.message || "Assign failed");
        return NextResponse.json({ application: mapApplication(updated as Record<string, unknown>) });
      }
      case "assign_lender": {
        const { data: updated, error } = await db
          .from("loan_applications")
          .update({ lender_org_id: body.lenderOrgId, updated_at: now })
          .eq("id", id)
          .select("*")
          .single();
        if (error || !updated) throw new Error(error?.message || "Assign failed");
        return NextResponse.json({ application: mapApplication(updated as Record<string, unknown>) });
      }
      case "assign_escrow": {
        const { data: updated, error } = await db
          .from("loan_applications")
          .update({ escrow_org_id: body.escrowOrgId, updated_at: now })
          .eq("id", id)
          .select("*")
          .single();
        if (error || !updated) throw new Error(error?.message || "Assign failed");
        return NextResponse.json({ application: mapApplication(updated as Record<string, unknown>) });
      }
      case "request_info": {
        await db
          .from("loan_applications")
          .update({ info_requested_from: app.status, updated_at: now })
          .eq("id", id);
        const updated = await pushStatus("info_requested", body.note);
        return NextResponse.json({ application: updated });
      }
      case "resolve_info": {
        const resume = app.info_requested_from ?? "package_submission";
        const updated = await pushStatus(resume, "Information request resolved; file resumed.");
        return NextResponse.json({ application: updated });
      }
      case "issue_conditions": {
        const descriptions = body.descriptions.map((d) => d.trim()).filter(Boolean);
        const rows = descriptions.map((description) => ({
          application_id: id,
          description,
          status: "open" as const,
          created_by: session.user.id,
        }));
        const { data: created, error } = await db.from("conditions").insert(rows).select("*");
        if (error) throw new Error(error.message);
        if (app.status !== "underwriting" && app.status !== "clear_to_close") {
          await pushStatus("underwriting", "Conditions issued; file remains in underwriting.");
        }
        return NextResponse.json({
          conditions: (created ?? []).map((r) => mapCondition(r as Record<string, unknown>)),
        });
      }
      case "mark_document": {
        const { data: doc, error } = await db
          .from("documents")
          .update({ status: body.status, updated_at: now })
          .eq("id", body.docId)
          .select("*")
          .single();
        if (error || !doc) throw new Error(error?.message || "Document update failed");
        return NextResponse.json({ document: mapDocument(doc as Record<string, unknown>) });
      }
      case "generate_loi": {
        const updated = await pushStatus("loi_issued", "LOI generated and attached to file.");
        const { data: doc, error } = await db
          .from("documents")
          .insert({
            application_id: id,
            doc_type: "loi",
            file_name: `LOI-${app.reference_code}.pdf`,
            storage_path: `${id}/LOI-${app.reference_code}.pdf`,
            mime_type: "application/pdf",
            file_size_bytes: 175000,
            status: "received",
            uploaded_by: session.user.id,
          })
          .select("*")
          .single();
        if (error || !doc) throw new Error(error?.message || "LOI document failed");
        return NextResponse.json({
          application: updated,
          document: mapDocument(doc as Record<string, unknown>),
        });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Action failed" },
      { status: 500 },
    );
  }
}
