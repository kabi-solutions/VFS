import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckList,
  FinalCta,
  PageHero,
  Section,
} from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_SECONDARY, CTA_TERTIARY } from "@/lib/config/ctas";
import {
  experienceList,
  experiences,
  strategies,
  type ExperienceSlug,
} from "@/lib/config/strategies";
import { images } from "@/lib/marketing/images";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return experienceList.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const e = experiences[slug as ExperienceSlug];
  if (!e) return { title: "Experience" };
  return { title: e.name, description: e.description };
}

export default async function ExperiencePage({ params }: { params: Params }) {
  const { slug } = await params;
  const e = experiences[slug as ExperienceSlug];
  if (!e) notFound();
  const suggested = strategies[e.defaultStrategy];

  return (
    <>
      <PageHero
        eyebrow={e.name}
        title={e.headline}
        description={e.description}
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_SECONDARY.href, label: CTA_SECONDARY.label }}
        image={images.investor}
      />

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">How Vault frames this stage</h2>
          <div className="mt-6">
            <CheckList items={e.framing} />
          </div>
          <p className="mt-8 text-[1.0625rem] text-charcoal">
            Suggested starting point:{" "}
            <Link
              href={`/strategies/${suggested.slug}`}
              className="font-medium text-green hover:text-green-hover"
            >
              {suggested.name}
            </Link>{" "}
            →{" "}
            <Link href={suggested.productHref} className="font-medium text-green hover:text-green-hover">
              {suggested.name} product page
            </Link>
            .
          </p>
          {e.slug === "high-volume" ? (
            <p className="mt-4 text-[0.9375rem] text-steel">
              High-volume sponsors may prefer to{" "}
              <Link href={CTA_TERTIARY.href} className="text-green hover:text-green-hover">
                talk to Vault
              </Link>{" "}
              about pipeline and partnership structure.
            </p>
          ) : null}
        </div>
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        primaryLabel={CTA_PRIMARY.label}
        secondaryHref={
          e.slug === "high-volume" ? CTA_TERTIARY.href : CTA_SECONDARY.href
        }
        secondaryLabel={
          e.slug === "high-volume" ? CTA_TERTIARY.label : CTA_SECONDARY.label
        }
      />
    </>
  );
}
