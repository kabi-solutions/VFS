import { NextResponse } from "next/server";
import { getServerAppSession } from "@/lib/data/session-server";
import { isDemoRoleSwitcherEnabled, isSupabaseConfigured } from "@/lib/supabase/env";
export const runtime = "nodejs";
export async function GET() {
  const session = await getServerAppSession();
  return NextResponse.json({ configured: isSupabaseConfigured(), demoRoleSwitcher: isDemoRoleSwitcherEnabled(), session });
}
