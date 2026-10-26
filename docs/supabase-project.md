# Supabase project bootstrap (VFS)

Handoff for frontend wiring (`cursor/supabase-backend-wire-9fbe` and related work).

## Project

| Field | Value |
| --- | --- |
| Organization | Webryact LLC (`rcrivreqfuvalxvwuupf`) — only org on the authenticated Supabase account |
| Project name | **VFS** |
| Project ref / id | `fsatcxmmfvmspremmtmu` |
| Region | `us-east-1` |
| Status | `ACTIVE_HEALTHY` |
| API URL | `https://fsatcxmmfvmspremmtmu.supabase.co` |
| Dashboard | https://supabase.com/dashboard/project/fsatcxmmfvmspremmtmu |

## Schema / migrations

- Source of truth in repo: `supabase/schema.sql`
- Applied remotely as migration `initial_schema` (`20261026043640`)
- Includes `loan_type` value `new_construction` and `loan_applications.package` (`jsonb`) + `package_complete`
- RLS enabled on all public tables; security advisors clean at bootstrap time

## Env vars for local + Vercel

Copy `.env.example` → `.env.local`. Set real keys from the agent response / Supabase Dashboard (API settings). **Do not commit keys.**

| Variable | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel + local | `https://fsatcxmmfvmspremmtmu.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel + local | Legacy `anon` JWT or new publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server only) | From Dashboard → API; never `NEXT_PUBLIC_` |

On Vercel: Project → Settings → Environment Variables → add the three above for Production / Preview as needed, then redeploy.

## Notes

- A second project was **not** created: **VFS** already existed in this org with schema applied.
- Service role / secret keys are not stored in git; obtain from Dashboard or the bootstrap agent secure note.
