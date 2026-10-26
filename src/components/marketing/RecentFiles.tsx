import { recentFiles } from "@/lib/config/proof";

/** RCN-style recent files strip — hidden when empty (no fake seed). */
export function RecentFiles({
  title = "Recent files",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  if (recentFiles.length === 0) return null;

  return (
    <section className={className}>
      <div className="mx-auto max-w-[1080px] px-6 lg:px-8">
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentFiles.map((file) => (
            <li
              key={file.id}
              className="rounded-[1.5rem] bg-paper px-5 py-5 ring-1 ring-black/[0.04]"
            >
              <p className="text-[0.8125rem] font-semibold text-green">
                {file.product} · {file.market}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-charcoal">{file.shape}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.8125rem] text-steel">
          Anonymized examples. Not an offer of credit; terms evaluated deal by deal.
        </p>
      </div>
    </section>
  );
}
