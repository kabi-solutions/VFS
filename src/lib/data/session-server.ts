import { mapOrganization, mapUser } from "@/lib/data/mappers";
import { usesSupabaseData } from "@/lib/data/source";
import { getSession as getMockSession } from "@/lib/mock/data";
import { createClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/lib/types/database";

export async function getServerAppSession(): Promise<SessionUser | null> {
  if (!usesSupabaseData()) return getMockSession();
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;
    const { data: profile } = await supabase.from("users").select("*").eq("auth_user_id", authUser.id).maybeSingle();
    if (!profile) return null;
    const user = mapUser(profile as Record<string, unknown>);
    let organization = null;
    if (user.organization_id) {
      const { data: org } = await supabase.from("organizations").select("*").eq("id", user.organization_id).maybeSingle();
      if (org) organization = mapOrganization(org as Record<string, unknown>);
    }
    return { user, organization };
  } catch {
    return null;
  }
}
