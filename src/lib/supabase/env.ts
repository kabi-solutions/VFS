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

function looksLikeJwt(value: string | undefined): value is string {
  if (!value) return false;
  // Reject misconfigured placeholders like the literal "SUPABASE_SERVICE_KEY".
  if (!value.includes(".") || value.length < 40) return false;
  if (value === "SUPABASE_SERVICE_KEY" || value === "SUPABASE_SERVICE_ROLE_KEY") return false;
  return true;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  // Prefer a valid JWT from either name (ROLE_KEY has been mis-set to a literal alias before).
  const primary = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const alias = process.env.SUPABASE_SERVICE_KEY?.trim();
  if (looksLikeJwt(primary)) return primary;
  if (looksLikeJwt(alias)) return alias;
  return undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

export function hasServiceRole(): boolean {
  return Boolean(isSupabaseConfigured() && getSupabaseServiceRoleKey());
}

/** A6: demo role switcher only when explicitly enabled via env flag. */
export function isDemoRoleSwitcherEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_ROLE_SWITCHER === "true";
}
