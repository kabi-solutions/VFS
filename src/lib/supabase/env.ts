/**
 * Supabase env gating. Mock/localStorage is used only when URL + anon key are missing.
 * Never put service_role in NEXT_PUBLIC_* vars.
 */

export function getSupabaseUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  return url || undefined;
}

export function getSupabaseAnonKey(): string | undefined {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  return key || undefined;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  // Prefer the canonical name; also accept SUPABASE_SERVICE_KEY (common Vercel typo).
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_KEY?.trim();
  return key || undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function hasServiceRole(): boolean {
  return Boolean(isSupabaseConfigured() && getSupabaseServiceRoleKey());
}

export function isDemoRoleSwitcherEnabled(): boolean {
  if (!isSupabaseConfigured()) return true;
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_ROLE_SWITCHER === "true";
}
