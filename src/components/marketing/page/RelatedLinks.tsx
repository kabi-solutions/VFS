import Link from "next/link";

export function RelatedLinks({
  title = "Related",
  links,
}: {
  title?: string;
  links: { href: string; label: string; body?: string }[];
}) {
  return (
    <div>
      <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <span className="text-[1.0625rem] font-medium text-ink group-hover:text-green">
                {link.label}
              </span>
              {link.body ? (
                <span className="text-[0.9375rem] text-steel sm:max-w-md sm:text-right">
                  {link.body}
                </span>
              ) : (
                <span className="text-[0.875rem] font-medium text-green">View</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
