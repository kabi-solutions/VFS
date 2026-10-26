import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  return createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!);
}
