"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearMockSession, getSession, setMockSessionUserId, users } from "@/lib/mock/data";
import {
  hydrateMockApplicationsFromStorage,
  MOCK_APPLICATIONS_STORAGE_KEY,
} from "@/lib/mock/applications";
import {
  firstNavHref,
  isNavItemActive,
  navByRole,
  roleLabels,
  type PortalNavItem,
} from "@/lib/portal/nav";
import type { UserRole } from "@/lib/types/database";

const ROLE_ORDER: UserRole[] = ["borrower", "vault", "processor", "lender", "escrow"];

function roleFromPath(pathname: string): UserRole | null {
  return (
    ROLE_ORDER.find(
      (r) => pathname === `/portal/${r}` || pathname.startsWith(`/portal/${r}/`),
    ) ?? null
  );
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: PortalNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isNavItemActive(pathname, item);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center rounded-xl px-3 py-2 text-[0.875rem] font-medium transition-colors ${
        active
          ? "bg-green-soft text-green"
          : "text-charcoal hover:bg-black/[0.04] hover:text-ink"
      }`}
    >
      {item.label}
    </Link>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pathRole = useMemo(() => roleFromPath(pathname), [pathname]);
  const [role, setRole] = useState<UserRole>(() => pathRole ?? "borrower");
  const [name, setName] = useState("…");
  const [email, setEmail] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateMockApplicationsFromStorage();
    const nextRole = roleFromPath(pathname) ?? getSession().user.role;
    const user = users.find((u) => u.role === nextRole) ?? getSession().user;
    setMockSessionUserId(user.id);
    setRole(nextRole);
    setName(user.full_name);
    setEmail(user.email);
    setMobileOpen(false);
    setReady(true);
  }, [pathname]);

  function logout() {
    clearMockSession();
    router.push("/login");
  }

  function switchDemoRole(next: UserRole) {
    const user = users.find((u) => u.role === next);
    if (!user) return;
    setMockSessionUserId(user.id);
    setRole(next);
    setName(user.full_name);
    setEmail(user.email);
    router.push(firstNavHref(next));
  }

  function resetDemo() {
    try {
      localStorage.removeItem(MOCK_APPLICATIONS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    window.location.href = firstNavHref(role);
  }

  const displayRole = pathRole ?? role;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-3 border-b border-line px-4">
        <Link href={firstNavHref(displayRole)} className="flex items-center" aria-label="Portal home">
          <Image
            src="/brand/vault-logo.png"
            alt="Vault Financial Services"
            width={120}
            height={32}
            className="h-6 w-auto"
          />
        </Link>
      </div>

      <div className="border-b border-line px-4 py-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-steel">
          Signed in as
        </p>
        <p className="mt-1 truncate text-[0.875rem] font-semibold text-ink">
          {ready ? name : "…"}
        </p>
        <p className="truncate text-[0.75rem] text-steel">{email || " "}</p>
        <span className="mt-2 inline-flex rounded-full bg-green-soft px-2.5 py-0.5 text-[0.6875rem] font-semibold text-green">
          {roleLabels[displayRole]}
        </span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Portal">
        {navByRole[displayRole].map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-steel">
              {group.label}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-line p-4">
        <label className="block text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-steel">
          Demo role
          <select
            value={displayRole}
            onChange={(e) => switchDemoRole(e.target.value as UserRole)}
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-white px-3 py-2 text-[0.8125rem] text-ink"
            aria-label="Switch demo role"
          >
            {(Object.keys(roleLabels) as UserRole[]).map((id) => (
              <option key={id} value={id}>
                {roleLabels[id]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={resetDemo}
          className="w-full rounded-xl px-3 py-2 text-left text-[0.8125rem] font-medium text-steel hover:bg-black/[0.04] hover:text-ink"
        >
          Reset demo data
        </button>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl px-3 py-2 text-left text-[0.8125rem] font-medium text-steel hover:bg-black/[0.04] hover:text-ink"
        >
          Log out
        </button>
        <Link
          href="/"
          className="block rounded-xl px-3 py-2 text-[0.8125rem] font-medium text-green hover:bg-green-soft"
        >
          Marketing site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-full bg-[#F7F8FA] text-charcoal">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-line bg-white lg:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] font-semibold text-ink">Vault portal</p>
              <p className="truncate text-[0.75rem] text-steel">
                {roleLabels[displayRole]} workspace
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/portal/${displayRole}/notifications`}
              className="hidden rounded-full bg-paper px-3 py-1.5 text-[0.75rem] font-medium text-steel hover:text-ink sm:inline"
            >
              Notifications
            </Link>
            <span className="hidden rounded-full bg-green-soft px-2.5 py-1 text-[0.6875rem] font-semibold text-green sm:inline">
              Demo
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
