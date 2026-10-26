# Supabase wiring (Apply + portal)

## Connected

- Project **VFS** (`fsatcxmmfvmspremmtmu`, `us-east-1`) under Webryact LLC
- Postgres schema + RLS + `application-documents` Storage bucket
- Next.js clients (`@supabase/ssr` / `@supabase/supabase-js`), middleware session refresh
- Apply create → Auth user + `users` + `loan_applications` + `status_events` + document metadata
- Portal list/detail, package jsonb updates, document uploads, staff action API
- Mock/localStorage fallback when `NEXT_PUBLIC_SUPABASE_URL` / anon key are missing (or Apply 503 without service role)

## Vercel env vars (required for production)

| Variable | Scope |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production + Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview (server only) |
| `NEXT_PUBLIC_SITE_URL` | Recommended (Auth redirects) |

## Clicks still needed

1. Dashboard → API → copy **service_role** into Vercel `SUPABASE_SERVICE_ROLE_KEY`
2. Auth → URL configuration → add production + localhost redirect URLs
3. Confirm email auth (password) is enabled (default); magic link optional later
4. Seed staff users (`vault` / `processor` / `lender` / `escrow`) via SQL or Studio — roles live in `public.users`, never `user_metadata`
5. Optionally set `NEXT_PUBLIC_ENABLE_DEMO_ROLE_SWITCHER=true` while demos continue

## Demo caveats

- Without service role, Apply falls back to mock so local demos still work
- Demo role switcher remains when Supabase env is unset, or when explicitly enabled
- Lender/processor/escrow org seed beyond Vault org is left for ops to insert
