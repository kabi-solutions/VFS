import {
  clearMockSession,
  getSession as getMockSession,
  setMockSessionUserId,
  users as mockUsers,
} from "@/lib/mock/data";
import { hydrateMockApplicationsFromStorage } from "@/lib/mock/applications";
import { isDemoRoleSwitcherEnabled, isSupabaseConfigured } from "@/lib/supabase/env";
import { mapOrganization, mapUser } from "@/lib/data/mappers";
import type { SessionUser, UserRole } from "@/lib/types/database";

export async function getAppSession(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) {
    hydrateMockApplicationsFromStorage();
    return getMockSession();
  }
  try {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      if (isDemoRoleSwitcherEnabled()) {
        hydrateMockApplicationsFromStorage();
        return getMockSession();
      }
      return null;
    }
    const { data: profile, error } = await supabase
      .from("users").select("*").eq("auth_user_id", authUser.id).maybeSingle();
    if (error || !profile) return null;
    const user = mapUser(profile as Record<string, unknown>);
    let organization = null;
    if (user.organization_id) {
      const { data: org } = await supabase.from("organizations").select("*").eq("id", user.organization_id).maybeSingle();
      if (org) organization = mapOrganization(org as Record<string, unknown>);
    }
    return { user, organization };
  } catch {
    if (isDemoRoleSwitcherEnabled()) {
      hydrateMockApplicationsFromStorage();
      return getMockSession();
    }
    return null;
  }
}

export async function getServerAppSession(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return getMockSession();
  try {
    const { createClient } = await import("@/lib/supabase/server");
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

export function setDemoSessionUserId(userId: string) {
  if (!isDemoRoleSwitcherEnabled()) return;
  setMockSessionUserId(userId);
}

export function clearAppSessionLocal() {
  clearMockSession();
}

export function demoUserForRole(role: UserRole) {
  return mockUsers.find((u) => u.role === role) ?? mockUsers[0];
}
