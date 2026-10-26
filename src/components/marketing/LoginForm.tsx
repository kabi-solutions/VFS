"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { demoUserForRole, setDemoSessionUserId } from "@/lib/data/session";
import { hydrateMockApplicationsFromStorage, MOCK_BORROWER_ID_KEY } from "@/lib/mock/applications";
import type { UserRole } from "@/lib/types/database";

const roles: { id: UserRole; label: string }[] = [
  { id: "borrower", label: "Borrower" },
  { id: "vault", label: "Vault" },
  { id: "processor", label: "Processor" },
  { id: "lender", label: "Lender" },
  { id: "escrow", label: "Escrow" },
];

const portalByRole: Record<UserRole, string> = {
  borrower: "/portal/borrower",
  vault: "/portal/vault",
  processor: "/portal/processor",
  lender: "/portal/lender",
  escrow: "/portal/escrow",
};

export function LoginForm() {
  const router = useRouter();
  const [configured, setConfigured] = useState(false);
  const [demoSwitcher, setDemoSwitcher] = useState(true);
  const [role, setRole] = useState<UserRole>("borrower");
  const [email, setEmail] = useState(() => demoUserForRole("borrower").email);
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((body: { configured?: boolean; demoRoleSwitcher?: boolean }) => {
        setConfigured(Boolean(body.configured));
        setDemoSwitcher(body.demoRoleSwitcher !== false);
      })
      .catch(() => { setConfigured(false); setDemoSwitcher(true); });
  }, []);

  useEffect(() => {
    if (demoSwitcher) setEmail(demoUserForRole(role).email);
  }, [role, demoSwitcher]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (configured) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (demoSwitcher && (res.status === 401 || res.status === 403)) {
            hydrateMockApplicationsFromStorage();
            const matched = demoUserForRole(role);
            setDemoSessionUserId(matched.id);
            router.push(portalByRole[matched.role]);
            return;
          }
          throw new Error(body.error || "Sign-in failed");
        }
        router.push(portalByRole[(body.user?.role as UserRole) || "borrower"]);
        return;
      }
      hydrateMockApplicationsFromStorage();
      const matched = demoUserForRole(role);
      setDemoSessionUserId(matched.id);
      if (matched.role === "borrower") {
        try {
          localStorage.setItem(MOCK_BORROWER_ID_KEY, matched.id);
          sessionStorage.setItem(MOCK_BORROWER_ID_KEY, matched.id);
        } catch { /* ignore */ }
      }
      router.push(portalByRole[matched.role]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04] sm:p-10">
      <p className="text-[0.875rem] font-semibold text-green">Client login</p>
      <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">Sign in to your portal</h2>
      <p className="body-md mt-3">
        {configured
          ? "Sign in with your Vault account. Staff roles come from your profile — not the browser."
          : "Local demo mode (Supabase env not set). Choose a role to open the matching workspace."}
      </p>
      {demoSwitcher ? (
        <fieldset className="mt-8">
          <legend className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-steel">Role</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {roles.map((r) => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={`rounded-[var(--radius-control)] px-4 py-2 text-[0.9375rem] font-medium transition-colors ${role === r.id ? "bg-green text-white" : "bg-paper text-charcoal hover:bg-green-mist"}`}>
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-[0.875rem] font-medium text-ink">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-[var(--radius-control)] border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink outline-none ring-green focus:ring-2" />
        </label>
        <label className="block">
          <span className="text-[0.875rem] font-medium text-ink">Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-[var(--radius-control)] border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink outline-none ring-green focus:ring-2" />
        </label>
      </div>
      {error ? <p className="mt-4 text-[0.875rem] font-medium text-red-700" role="alert">{error}</p> : null}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button type="submit" shine disabled={submitting}>{submitting ? "Signing in…" : "Sign in"}</Button>
        <Link href="/apply" className="text-[0.9375rem] font-medium text-green hover:text-green-hover">New here? Apply first</Link>
      </div>
    </form>
  );
}
