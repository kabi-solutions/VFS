import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function FinalCta({
  title = "Ready to submit a file?",
  description = "Apply creates your borrower portal so you can return, update documents, and track status across the lifecycle.",
  primaryHref = "/apply",
  primaryLabel = "Apply Now",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Vault",
  /** Shine reserved for borrower Apply CTAs by default */
  primaryShine,
  imageSrc,
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  primaryShine?: boolean;
  imageSrc: string;
}) {
  const shine = primaryShine ?? primaryHref === "/apply";

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover opacity-[0.14]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-green-mist/80 to-green-soft/50" />
      </div>
      <div className="relative mx-auto max-w-[720px] px-6 py-[var(--spacing-section)] text-center lg:px-8">
        <div className="rounded-[2rem] bg-white/95 px-8 py-12 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] backdrop-blur-sm sm:px-12">
          <h2 className="headline-lg mx-auto max-w-[16ch] text-balance text-ink">{title}</h2>
          <p className="mx-auto mt-5 max-w-[32rem] text-[1.125rem] leading-relaxed text-steel">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={primaryHref} shine={shine}>
              {primaryLabel}
            </Button>
            <Button href={secondaryHref} variant="secondary">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
