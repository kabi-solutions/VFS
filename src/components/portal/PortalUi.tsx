import Link from "next/link";
import type { ReactNode } from "react";

export function PortalPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-steel">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-[1.625rem] font-semibold tracking-[-0.03em] text-ink sm:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[40rem] text-[0.9375rem] text-steel">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function PortalPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white ring-1 ring-black/[0.04] ${className}`}>{children}</div>
  );
}

export function PortalStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-black/[0.04]">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-steel">{label}</p>
      <p className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink">{value}</p>
      {hint ? <p className="mt-1 text-[0.8125rem] text-steel">{hint}</p> : null}
    </div>
  );
}

export function PortalSectionCard({
  title,
  body,
  href,
  cta = "Open",
}: {
  title: string;
  body: string;
  href: string;
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl bg-white px-5 py-5 ring-1 ring-black/[0.04] transition hover:ring-green/35"
    >
      <p className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">{title}</p>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel">{body}</p>
      <span className="mt-4 inline-flex text-[0.875rem] font-medium text-green">{cta}</span>
    </Link>
  );
}
