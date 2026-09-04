import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** PLACEHOLDER imagery — replace with commissioned photography */
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Soft green accent wash in a corner — not a full dark overlay */
  greenAccent?: "corner" | "edge" | "none";
};

/**
 * Bright editorial image with optional green accent — no dark filters.
 */
export function BrandImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  sizes = "100vw",
  priority = false,
  greenAccent = "corner",
}: Props) {
  return (
    <div className={`relative h-full min-h-[1px] w-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
      />
      {greenAccent === "corner" && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-green/25"
          aria-hidden
        />
      )}
      {greenAccent === "edge" && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-green"
          aria-hidden
        />
      )}
    </div>
  );
}
