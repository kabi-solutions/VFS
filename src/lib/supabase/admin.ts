import { createClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  hasServiceRole,
} from "@/lib/supabase/env";

export function createAdminClient() {
  if (!hasServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for privileged server operations.");
  }
  return createClient(getSupabaseUrl()!, getSupabaseServiceRoleKey()!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createAnonServerClient() {
  return createClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
