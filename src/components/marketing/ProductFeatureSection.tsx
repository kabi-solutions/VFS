import Link from "next/link";
import { BrandImage } from "@/components/marketing/BrandImage";
import { Button } from "@/components/ui/Button";

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.12" />
      <path
        d="M6 10.2 8.6 12.8 14 7.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type ProductFeature = {
  href: string;
  title: string;
  headline: string;
  bullets: string[];
  image: { src: string; alt: string };
  cardLabel: string;
  cardValue: string;
  cardMeta: string;
  applyHref?: string;
  reverse?: boolean;
};

/**
 * Prosper-style alternating product block: soft green stage + floating card + CTAs.
 */
export function ProductFeatureSection({ feature }: { feature: ProductFeature }) {
  const visual = (
    <div className="relative">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-green-mist sm:aspect-[4/3]">
        {/* PLACEHOLDER — commissioned photography */}
        <BrandImage
          src={feature.image.src}
          alt={feature.image.alt}
          greenAccent="corner"
          className="absolute inset-[12%] overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
          sizes="(max-width: 1024px) 90vw, 480px"
        />
        <div className="absolute left-[8%] top-[10%] z-10 max-w-[14rem] rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:left-[6%] sm:top-[12%]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
                <path
                  d="M5 10.2 8.2 13.4 15 6.6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-[0.75rem] font-medium text-steel">{feature.cardLabel}</p>
              <p className="mt-0.5 text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                {feature.cardValue}
              </p>
              <p className="mt-1 text-[0.8125rem] text-steel">{feature.cardMeta}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[10%] right-[8%] z-10 rounded-full bg-green px-3.5 py-1.5 text-[0.75rem] font-semibold text-white shadow-lg">
          {feature.title}
        </div>
      </div>
    </div>
  );

  const copy = (
    <div className={feature.reverse ? "lg:pr-4" : "lg:pl-4"}>
      <p className="text-[0.875rem] font-semibold text-green">{feature.title}</p>
      <h2 className="headline-lg mt-3 max-w-[16ch] text-balance text-ink">{feature.headline}</h2>
      <ul className="mt-6 space-y-3">
        {feature.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3 text-[1.0625rem] leading-snug text-charcoal">
            <CheckIcon />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button href={feature.applyHref ?? "/apply"} shine>
          Apply Now
        </Button>
        <Link
          href={feature.href}
          className="text-[1.0625rem] font-medium text-ink underline decoration-green/40 underline-offset-4 hover:decoration-green"
        >
          Explore {feature.title}
        </Link>
      </div>
    </div>
  );

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        {feature.reverse ? (
          <>
            {copy}
            {visual}
          </>
        ) : (
          <>
            {visual}
            {copy}
          </>
        )}
      </div>
    </section>
  );
}
