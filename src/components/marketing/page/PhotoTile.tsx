import Image from "next/image";
import Link from "next/link";

export function PhotoTile({
  href,
  title,
  body,
  image,
  cta = "Continue",
}: {
  href: string;
  title: string;
  body: string;
  image: { src: string; alt: string };
  cta?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block min-h-[16rem] overflow-hidden rounded-[1.75rem] focus-visible:outline-offset-4 sm:min-h-[18rem]"
    >
      {/* PLACEHOLDER — commissioned photography */}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition duration-500 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 p-7">
        <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-white">{title}</p>
        <p className="mt-1.5 text-[0.9375rem] text-white/75">{body}</p>
        <span className="mt-4 inline-flex text-[0.875rem] font-medium text-green">{cta}</span>
      </div>
    </Link>
  );
}
