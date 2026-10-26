import { testimonials } from "@/lib/config/proof";

/** Testimonials strip — hidden when empty (no fake seed). */
export function Testimonials({
  title = "What borrowers say",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className={className}>
      <div className="mx-auto max-w-[1080px] px-6 lg:px-8">
        <h2 className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">{title}</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="rounded-[1.5rem] bg-paper px-6 py-6 ring-1 ring-black/[0.04]"
            >
              <blockquote className="text-[1.0625rem] leading-relaxed text-charcoal">
                “{item.quote}”
              </blockquote>
              <p className="mt-4 text-[0.875rem] font-semibold text-ink">{item.attribution}</p>
              {item.role ? <p className="text-[0.8125rem] text-steel">{item.role}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
