import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QualificationBox } from "@/components/marketing/QualificationBox";
import {
  CheckList,
  FinalCta,
  PageHero,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { CTA_PRIMARY, CTA_SECONDARY, CTA_TERTIARY } from "@/lib/config/ctas";
import { strategies, strategyList, type StrategySlug } from "@/lib/config/strategies";
import { solutions } from "@/lib/marketing/solutions";
import { images } from "@/lib/marketing/images";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return strategyList.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = strategies[slug as StrategySlug];
  if (!s) return { title: "Strategy" };
  return {
    title: s.name,
    description: s.description,
  };
}

export default async function StrategyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const s = strategies[slug as StrategySlug];
  if (!s) notFound();
  const product = solutions[s.productSlug];

  return (
    <>
      <PageHero
        eyebrow={s.name}
        title={s.headline}
        description={s.description}
        primaryCta={{ href: CTA_PRIMARY.href, label: CTA_PRIMARY.label, shine: true }}
        secondaryCta={{ href: CTA_SECONDARY.href, label: CTA_SECONDARY.label }}
        image={product.image}
      />

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <QualificationBox compact />
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who this is for</h2>
            <div className="mt-6">
              <CheckList items={product.whoFor} />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who this is not for</h2>
            <p className="body-lg mt-6">{s.whoNotFor}</p>
            <p className="mt-6 text-[0.9375rem] text-steel">
              Primary product path:{" "}
              <a href={s.productHref} className="font-medium text-green hover:text-green-hover">
                {product.name}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      <SoftStage src={images.funded.src}>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Next step</h2>
          <p className="body-lg mt-5">
            Check fit in four fields, or start your file when you have a live deal. Talk to Vault if
            volume or partnership structure needs a conversation first.
          </p>
        </div>
      </SoftStage>

      <FinalCta
        imageSrc={images.funded.src}
        primaryLabel={CTA_PRIMARY.label}
        secondaryHref={CTA_TERTIARY.href}
        secondaryLabel={CTA_TERTIARY.label}
      />
    </>
  );
}
