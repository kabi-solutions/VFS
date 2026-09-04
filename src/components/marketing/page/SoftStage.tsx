import Image from "next/image";
import type { ReactNode } from "react";

/** Soft mist banner with faint photo — matches homepage FAQ / soft stages */
export function SoftStage({
  src,
  children,
  className = "",
}: {
  src: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-paper ${className}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* PLACEHOLDER — commissioned photography */}
        <Image src={src} alt="" fill className="object-cover opacity-[0.16]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-mist/95 via-paper/92 to-green-mist/95" />
      </div>
      <div className="relative mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
        {children}
      </div>
    </section>
  );
}
