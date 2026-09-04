"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { hydrateMockApplicationsFromStorage, MOCK_BORROWER_ID_KEY } from "@/lib/mock/applications";
import { setMockSessionUserId, users } from "@/lib/mock/data";
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

function mockUserForRole(role: UserRole) {
  return users.find((u) => u.role === role) ?? users[0];
}

export function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("borrower");
  const [email, setEmail] = useState(() => mockUserForRole("borrower").email);
  const [password, setPassword] = useState("demo");

  useEffect(() => {
    setEmail(mockUserForRole(role).email);
  }, [role]);

  function selectRole(next: UserRole) {
    setRole(next);
    setEmail(mockUserForRole(next).email);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    hydrateMockApplicationsFromStorage();
    const matched =
      users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === role) ??
      mockUserForRole(role);
    setMockSessionUserId(matched.id);
    if (typeof window !== "undefined" && matched.role === "borrower") {
      try {
        localStorage.setItem(MOCK_BORROWER_ID_KEY, matched.id);
        sessionStorage.setItem(MOCK_BORROWER_ID_KEY, matched.id);
      } catch {
        /* ignore */
      }
    }
    // PLACEHOLDER — real auth / password check
    void password;
    router.push(portalByRole[matched.role]);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04] sm:p-10"
    >
      <p className="text-[0.875rem] font-semibold text-green">Client login</p>
      <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
        Sign in to your portal
      </h2>
      <p className="body-md mt-3">
        Mock credentials only. Choose a role to open the matching workspace.
      </p>
      <p className="mt-2 text-[0.875rem] text-steel">Demo: any password works.</p>

      <fieldset className="mt-8">
        <legend className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-steel">
          Role
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectRole(r.id)}
              className={`rounded-[var(--radius-control)] px-4 py-2 text-[0.9375rem] font-medium transition-colors ${
                role === r.id
                  ? "bg-green text-white"
                  : "bg-paper text-charcoal hover:bg-green-mist"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-[0.875rem] font-medium text-ink">Email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-[var(--radius-control)] border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink outline-none ring-green focus:ring-2"
          />
        </label>
        <label className="block">
          <span className="text-[0.875rem] font-medium text-ink">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-[var(--radius-control)] border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink outline-none ring-green focus:ring-2"
            placeholder="Any password (demo)"
          />
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button type="submit" shine>
          Sign in
        </Button>
        <Link href="/apply" className="text-[0.9375rem] font-medium text-green hover:text-green-hover">
          New here? Apply first
        </Link>
      </div>
    </form>
  );
}
