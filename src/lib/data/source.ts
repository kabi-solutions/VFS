/**
 * Data source switch for the mock → Supabase cutover.
 * - mock: in-memory / localStorage (release escape hatch)
 * - supabase: live backend (default when URL + anon are configured)
 */
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type DataSource = "mock" | "supabase";

export function getDataSource(): DataSource {
  const explicit = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim().toLowerCase();
  if (explicit === "mock" || explicit === "supabase") return explicit;
  return isSupabaseConfigured() ? "supabase" : "mock";
}

export function usesSupabaseData(): boolean {
  return getDataSource() === "supabase" && isSupabaseConfigured();
}
