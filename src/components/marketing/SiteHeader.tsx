"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";

const solutions = [
  { href: "/solutions/private-money", label: "Private Money" },
  { href: "/solutions/rehab-fix-flip", label: "Rehab / Fix & Flip" },
  { href: "/solutions/bridge-loans", label: "Bridge Loans" },
  { href: "/solutions/ground-up", label: "Ground-Up Construction" },
  { href: "/solutions/dscr-non-qm", label: "DSCR & Non-QM" },
];

const company = [
  { href: "/company/about", label: "About" },
  { href: "/company/leadership", label: "Leadership" },
  { href: "/company/press", label: "Press & Media" },
  { href: "/company/careers", label: "Careers" },
  { href: "/company/community-impact", label: "Community Impact" },
];

const capital = [
  { href: "/capital-partners", label: "Why Partner With Vault" },
  { href: "/capital-partners/deployment", label: "How Deployment Works" },
  { href: "/capital-partners/apply", label: "Partner Application" },
];

const resources = [
  { href: "/resources", label: "Learning Center" },
  { href: "/resources/glossary", label: "Glossary" },
  { href: "/resources/faqs", label: "FAQs" },
  { href: "/resources/case-studies", label: "Case Studies" },
];

const trust = [
  { href: "/trust/licensing", label: "Licensing & Compliance" },
  { href: "/trust/security", label: "Security & Data Protection" },
  { href: "/trust/legal", label: "Legal" },
];

type MegaKey = "solutions" | "company" | "capital" | "resources" | "trust" | null;

function MegaPanel({
  items,
  title,
  description,
}: {
  items: { href: string; label: string }[];
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-[980px] gap-8 px-6 py-8 md:grid-cols-[minmax(0,12rem)_1fr] lg:px-8">
        <div>
          <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{title}</p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-steel">{description}</p>
        </div>
        <ul className="grid gap-1 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl px-3 py-2.5 text-[0.9375rem] text-charcoal transition-colors hover:bg-paper"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState<MegaKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navButton = (key: MegaKey, label: string) => (
    <button
      type="button"
      className={`rounded-full px-3 py-1.5 text-[0.75rem] font-normal tracking-[-0.01em] transition-colors ${
        open === key ? "bg-black/[0.06] text-ink" : "text-steel hover:text-ink"
      }`}
      aria-expanded={open === key}
      aria-controls={menuId}
      onClick={() => setOpen(open === key ? null : key)}
      onMouseEnter={() => setOpen(key)}
    >
      {label}
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-xl transition-shadow duration-150 ${
        scrolled || open || mobileOpen ? "shadow-[0_1px_0_rgba(0,0,0,0.04)]" : ""
      }`}
      onMouseLeave={() => setOpen(null)}
    >
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-6 px-6 lg:px-8">
        <Link href="/" className="relative flex shrink-0 items-center" aria-label="Vault Financial Services home">
          {/* PLACEHOLDER — Vault to supply final logo assets; using existing mark */}
          <Image
            src="/brand/vault-logo.png"
            alt="Vault Financial Services LLC"
            width={148}
            height={40}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
          {navButton("solutions", "Solutions")}
          {navButton("company", "Company")}
          {navButton("capital", "Capital Partners")}
          {navButton("resources", "Resources")}
          {navButton("trust", "Trust")}
          <Link
            href="/locations"
            className="rounded-full px-3 py-1.5 text-[0.75rem] font-normal text-steel transition-colors hover:text-ink"
          >
            Locations
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-3 py-1.5 text-[0.75rem] font-normal text-steel transition-colors hover:text-ink"
          >
            Client Login
          </Link>
          <Link
            href="/apply"
            className="btn-shine rounded-full bg-green px-4 py-1.5 text-[0.75rem] font-medium text-white transition-colors hover:bg-green-hover"
          >
            <span>Apply Now</span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5" aria-hidden>
            <span className={`h-px bg-ink transition ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px bg-ink transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-px bg-ink transition ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div id={menuId} className="hidden lg:block">
        {open === "solutions" && (
          <MegaPanel
            title="Solutions"
            description="Private capital structured for acquisition, rehab, bridge, construction, and rental cash flow."
            items={solutions}
          />
        )}
        {open === "company" && (
          <MegaPanel
            title="Company"
            description="Institutional process, accountable capital, and a platform built for the full loan lifecycle."
            items={company}
          />
        )}
        {open === "capital" && (
          <MegaPanel
            title="Capital Partners"
            description="Deploy capital into Vault-originated real estate credit with clear underwriting and reporting."
            items={capital}
          />
        )}
        {open === "resources" && (
          <MegaPanel
            title="Resources"
            description="Guides, definitions, and funded-deal context for investors evaluating private lending."
            items={resources}
          />
        )}
        {open === "trust" && (
          <MegaPanel
            title="Trust & Security"
            description="Licensing posture, data protection, and legal disclosures — written for diligence, not decoration."
            items={trust}
          />
        )}
      </div>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <div className="mx-auto flex max-w-[980px] flex-col gap-6 px-6 py-6">
            {[
              { title: "Solutions", items: solutions },
              { title: "Company", items: company },
              { title: "Capital Partners", items: capital },
              { title: "Resources", items: resources },
              { title: "Trust", items: trust },
            ].map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold tracking-wide text-steel">{group.title}</p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block py-1.5 text-charcoal"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/locations" className="text-charcoal" onClick={() => setMobileOpen(false)}>
              Locations
            </Link>
            <div className="flex flex-col gap-2 border-t border-line pt-4">
              <Link href="/login" className="py-2 text-charcoal" onClick={() => setMobileOpen(false)}>
                Client Login
              </Link>
              <Link
                href="/apply"
                className="btn-shine rounded-full bg-green px-4 py-3 text-center font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                <span>Apply Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
