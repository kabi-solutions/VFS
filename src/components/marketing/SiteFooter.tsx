import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Solutions",
    links: [
      { href: "/solutions/private-money", label: "Private Money" },
      { href: "/solutions/rehab-fix-flip", label: "Rehab / Fix & Flip" },
      { href: "/solutions/bridge-loans", label: "Bridge Loans" },
      { href: "/solutions/ground-up", label: "Ground-Up Construction" },
      { href: "/solutions/dscr-non-qm", label: "DSCR & Non-QM" },
    ],
  },
  {
    title: "Capital",
    links: [
      { href: "/capital-partners", label: "Why Partner" },
      { href: "/capital-partners/deployment", label: "Deployment" },
      { href: "/capital-partners/apply", label: "Partner Application" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/about", label: "About" },
      { href: "/company/community-impact", label: "Community Impact" },
      { href: "/resources", label: "Learning Center" },
      { href: "/locations", label: "States We Serve" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { href: "/trust/licensing", label: "Licensing" },
      { href: "/trust/security", label: "Security" },
      { href: "/trust/legal", label: "Legal" },
      { href: "/login", label: "Client Login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[980px] px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_2fr]">
          <div>
            {/* PLACEHOLDER — Vault to supply final logo assets */}
            <Image
              src="/brand/vault-logo-white.png"
              alt="Vault Financial Services LLC"
              width={120}
              height={48}
              className="h-8 w-auto opacity-90"
            />
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/55">
              Private real estate credit for investors who need certainty of close, disciplined
              underwriting, and a process that holds through funding.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-white">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-white/50 transition-colors hover:text-green"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[0.75rem] leading-relaxed text-white/40 sm:flex-row sm:items-end sm:justify-between">
          <p>© {new Date().getFullYear()} Vault Financial Services LLC. All rights reserved.</p>
          {/* PLACEHOLDER — Vault to supply real licensing / NMLS disclosures */}
          <p className="max-w-xl sm:text-right">
            Lending products are subject to credit approval and applicable state licensing.
            Placeholder disclosures pending Vault compliance review.
          </p>
        </div>
      </div>
    </footer>
  );
}
