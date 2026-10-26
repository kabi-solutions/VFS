import { getPackageCompleteness } from "@/lib/apply/package";
import type { CreateApplicationInput, CreateApplicationResult } from "@/lib/mock/applications";
import { mapApplication, mapDocument, mapStatusEvent, mapUser } from "@/lib/data/mappers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/env";
import type { Document } from "@/lib/types/database";

type CreateOptions = CreateApplicationInput & {
  password?: string;
  establishSession?: boolean;
};

async function nextReferenceCode(admin: ReturnType<typeof createAdminClient>): Promise<string> {
  const { data, error } = await admin.rpc("next_application_reference_code");
  if (!error && typeof data === "string" && data) return data;
  const { data: rows } = await admin.from("loan_applications").select("reference_code");
  let max = 1000;
  for (const row of rows ?? []) {
    const match = /^VFS-(\d+)$/i.exec(String((row as { reference_code: string }).reference_code));
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `VFS-${max + 1}`;
}

export async function createApplicationServer(
  input: CreateOptions,
): Promise<CreateApplicationResult & { sessionEstablished: boolean }> {
  if (!hasServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to create applications from Apply.");
  }

  const admin = createAdminClient();
  const email = input.email.trim().toLowerCase();
  const fullName = input.full_name.trim();
  const phone = input.phone.trim();
  const now = new Date().toISOString();
  const password =
    input.password?.trim() || `Vfs-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}!`;

  let authUserId: string | null = null;
  const { data: existingProfile } = await admin.from("users").select("*").eq("email", email).maybeSingle();

  if (existingProfile?.auth_user_id) {
    authUserId = String(existingProfile.auth_user_id);
  } else {
    const { data: created, error: createAuthError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (createAuthError) {
      const msg = createAuthError.message.toLowerCase();
      if (!(msg.includes("already") || msg.includes("registered") || msg.includes("exists"))) {
        throw new Error(createAuthError.message || "Failed to create auth user");
      }
    } else if (created.user) {
      authUserId = created.user.id;
    }
  }

  let profileRow: Record<string, unknown>;
  if (existingProfile) {
    const { data: updated, error } = await admin
      .from("users")
      .update({
        full_name: fullName,
        phone,
        auth_user_id: authUserId ?? existingProfile.auth_user_id,
        updated_at: now,
      })
      .eq("id", existingProfile.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error(error?.message || "Failed to update user");
    profileRow = updated as Record<string, unknown>;
  } else {
    const { data: inserted, error } = await admin
      .from("users")
      .insert({
        email,
        full_name: fullName,
        phone,
        role: "borrower",
        auth_user_id: authUserId,
      })
      .select("*")
      .single();
    if (error || !inserted) throw new Error(error?.message || "Failed to create user");
    profileRow = inserted as Record<string, unknown>;
  }

  const user = mapUser(profileRow);
  const pkg = input.package ?? null;
  const docTypes = (input.documents ?? []).map((d) => d.doc_type);
  const completeness = getPackageCompleteness(pkg, input.loan_type, docTypes);
  const reference_code = await nextReferenceCode(admin);

  const noteParts = ["Application submitted via digital Apply."];
  if (input.entity_name?.trim()) noteParts.push(`Entity: ${input.entity_name.trim()}.`);
  if (input.property_type?.trim()) noteParts.push(`Property type: ${input.property_type.trim()}.`);
  if (input.notes?.trim()) noteParts.push(input.notes.trim());

  const { data: appRow, error: appError } = await admin
    .from("loan_applications")
    .insert({
      reference_code,
      borrower_id: user.id,
      loan_type: input.loan_type,
      status: "application_submitted",
      prior_application_id: input.prior_application_id?.trim() || null,
      property_address: input.property_address.trim(),
      property_city: input.property_city.trim(),
      property_state: input.property_state.trim().toUpperCase(),
      property_postal: input.property_postal.trim(),
      purchase_price: input.purchase_price ?? null,
      loan_amount: input.loan_amount,
      estimated_arv: input.estimated_arv ?? null,
      attribution_source_id: input.attribution_source_id ?? "direct_apply",
      package: pkg,
      package_complete: completeness.missing.length === 0,
    })
    .select("*")
    .single();
  if (appError || !appRow) throw new Error(appError?.message || "Failed to create application");

  const application = mapApplication(appRow as Record<string, unknown>);
  const { data: eventRow, error: eventError } = await admin
    .from("status_events")
    .insert({
      application_id: application.id,
      actor_id: user.id,
      from_status: null,
      to_status: "application_submitted",
      note: noteParts.join(" "),
    })
    .select("*")
    .single();
  if (eventError || !eventRow) throw new Error(eventError?.message || "Failed to create status event");

  const statusEvent = mapStatusEvent(eventRow as Record<string, unknown>);
  const createdDocs: Document[] = [];
  for (const doc of input.documents ?? []) {
    const storage_path = `${application.id}/meta/${doc.file_name}`;
    const { data: docRow, error: docError } = await admin
      .from("documents")
      .insert({
        application_id: application.id,
        doc_type: doc.doc_type,
        file_name: doc.file_name,
        storage_path,
        mime_type: doc.mime_type ?? null,
        file_size_bytes: doc.file_size_bytes,
        status: "pending",
        uploaded_by: user.id,
      })
      .select("*")
      .single();
    if (docError || !docRow) throw new Error(docError?.message || "Failed to create document metadata");
    createdDocs.push(mapDocument(docRow as Record<string, unknown>));
  }

  // Always attempt to open a borrower session after Apply so "Open my portal" works.
  let sessionEstablished = false;
  if (input.establishSession !== false) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Existing auth users may not share the generated password — try admin-generated session.
        const { data: link, error: linkError } = await admin.auth.admin.generateLink({
          type: "magiclink",
          email,
        });
        if (!linkError && link?.properties?.hashed_token) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            email,
            token_hash: link.properties.hashed_token,
            type: "magiclink",
          });
          sessionEstablished = !otpError;
        }
      } else {
        sessionEstablished = true;
      }
    } catch {
      sessionEstablished = false;
    }
  }

  return { user, application, statusEvent, documents: createdDocs, sessionEstablished };
}
