import Link from "next/link";
import type { ReactNode } from "react";

export function LinkBento({
  title,
  href,
  links,
  icon,
}: {
  title: string;
  href: string;
  links: { href: string; label: string }[];
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <Link
          href={href}
          className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink hover:text-green"
        >
          {title}
        </Link>
        {icon ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-mist text-ink">
            {icon}
          </span>
        ) : null}
      </div>
      <ul className="mt-6 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center gap-2 text-[1.0625rem] text-charcoal hover:text-green"
            >
              <span aria-hidden>→</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
