/**
 * Real-DB RLS isolation check (E1).
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL + anon key.
 * Creates two borrower auth users + loans, proves borrower A cannot read borrower B.
 *
 * Usage: node --env-file=.env.local scripts/rls-isolation-check.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!url || !anon || !service) {
  console.error("Missing Supabase env (URL, anon, service role).");
  process.exit(2);
}

const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

function userClient(accessToken) {
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const stamp = Date.now();
const emailA = `rls-a-${stamp}@example.com`;
const emailB = `rls-b-${stamp}@example.com`;
const password = `Rls-Test-${stamp}!`;

async function createBorrower(email) {
  const { data: auth, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authErr) throw authErr;
  const { data: profile, error: profileErr } = await admin
    .from("users")
    .insert({
      email,
      full_name: `RLS ${email}`,
      role: "borrower",
      auth_user_id: auth.user.id,
    })
    .select("*")
    .single();
  if (profileErr) throw profileErr;
  const { data: loan, error: loanErr } = await admin
    .from("loan_applications")
    .insert({
      reference_code: `VFS-RLS-${stamp}-${email.slice(4, 8)}`,
      borrower_id: profile.id,
      loan_type: "bridge",
      property_address: "1 Test St",
      property_city: "Austin",
      property_state: "TX",
      property_postal: "78701",
      loan_amount: 250000,
    })
    .select("*")
    .single();
  if (loanErr) throw loanErr;
  return { authUserId: auth.user.id, profile, loan };
}

async function signIn(email) {
  const { data, error } = await admin.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session.access_token;
}

let created = [];
try {
  const a = await createBorrower(emailA);
  const b = await createBorrower(emailB);
  created = [a, b];

  const tokenA = await signIn(emailA);
  const clientA = userClient(tokenA);

  const { data: own, error: ownErr } = await clientA
    .from("loan_applications")
    .select("id")
    .eq("id", a.loan.id)
    .maybeSingle();
  if (ownErr) throw ownErr;
  if (!own) throw new Error("Borrower A cannot read own loan — RLS too strict or miswired");

  const { data: other, error: otherErr } = await clientA
    .from("loan_applications")
    .select("id")
    .eq("id", b.loan.id)
    .maybeSingle();
  if (otherErr) throw otherErr;
  if (other) {
    console.error("FAIL: Borrower A can read Borrower B loan", other);
    process.exit(1);
  }

  // Audit append-only: update/delete should fail for authenticated user
  const { error: updErr } = await clientA
    .from("audit_events")
    .update({ action: "tamper" })
    .eq("loan_id", a.loan.id);
  if (!updErr) {
    console.error("FAIL: audit_events UPDATE succeeded for borrower");
    process.exit(1);
  }

  const { error: delErr } = await clientA.from("audit_events").delete().eq("loan_id", a.loan.id);
  if (!delErr) {
    console.error("FAIL: audit_events DELETE succeeded for borrower");
    process.exit(1);
  }

  console.log("PASS: borrower isolation + audit append-only (update/delete denied)");
  process.exit(0);
} catch (e) {
  console.error("ERROR", e);
  process.exit(1);
} finally {
  for (const row of created) {
    try {
      await admin.from("loan_applications").delete().eq("id", row.loan.id);
      await admin.from("users").delete().eq("id", row.profile.id);
      await admin.auth.admin.deleteUser(row.authUserId);
    } catch {
      /* cleanup best-effort */
    }
  }
}
