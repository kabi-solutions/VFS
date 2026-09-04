import { BrandImage } from "@/components/marketing/BrandImage";
import { Button } from "@/components/ui/Button";

type Cta = {
  href: string;
  label: string;
  shine?: boolean;
  variant?: "primary" | "secondary" | "on-dark" | "green-on-dark";
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  image,
  tone = "paper",
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  image?: { src: string; alt: string };
  tone?: "paper" | "white" | "ink";
}) {
  const dark = tone === "ink";
  const bg = tone === "ink" ? "bg-ink" : tone === "white" ? "bg-white" : "bg-paper";

  return (
    <section className={bg}>
      <div
        className={`mx-auto grid max-w-[1080px] items-center gap-10 px-6 py-[var(--spacing-section)] lg:px-8 ${
          image ? "lg:grid-cols-2 lg:gap-14" : ""
        }`}
      >
        <div className={image ? "" : "mx-auto max-w-[40rem] text-center"}>
          {eyebrow ? <p className="text-[0.875rem] font-semibold text-green">{eyebrow}</p> : null}
          <h1
            className={`headline-xl mt-3 text-balance ${dark ? "text-white" : "text-ink"} ${
              image ? "max-w-[14ch]" : "mx-auto max-w-[16ch]"
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-5 text-[1.125rem] leading-relaxed ${
              dark ? "text-white/70" : "text-steel"
            } ${image ? "max-w-xl" : "mx-auto max-w-[36rem]"}`}
          >
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className={`mt-8 flex flex-wrap gap-3 ${image ? "" : "justify-center"}`}>
              {primaryCta ? (
                <Button
                  href={primaryCta.href}
                  shine={primaryCta.shine}
                  variant={primaryCta.variant ?? (dark ? "green-on-dark" : "primary")}
                >
                  {primaryCta.label}
                </Button>
              ) : null}
              {secondaryCta ? (
                <Button
                  href={secondaryCta.href}
                  variant={secondaryCta.variant ?? (dark ? "on-dark" : "secondary")}
                >
                  {secondaryCta.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
        {image ? (
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-green-mist sm:aspect-[4/3]">
            {/* PLACEHOLDER — commissioned photography */}
            <BrandImage
              src={image.src}
              alt={image.alt}
              greenAccent="corner"
              className="absolute inset-[10%] overflow-hidden rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
              sizes="(max-width: 1024px) 90vw, 480px"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
