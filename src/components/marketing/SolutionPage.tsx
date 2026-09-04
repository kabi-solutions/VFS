import {
  CheckList,
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { JsonLd } from "@/components/seo/JsonLd";
import { solutions, type SolutionSlug } from "@/lib/marketing/solutions";
import { images } from "@/lib/marketing/images";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

function getServiceJsonLd(slug: SolutionSlug) {
  const s = solutions[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: `${SITE_URL}${s.href}`,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "US",
    serviceType: "Private real estate lending",
  };
}

export function SolutionPage({ slug }: { slug: SolutionSlug }) {
  const s = solutions[slug];
  const related = s.related.map((id) => ({
    href: solutions[id].href,
    label: solutions[id].name,
    body: solutions[id].headline,
  }));

  return (
    <>
      <JsonLd data={getServiceJsonLd(slug)} />

      <PageHero
        eyebrow={s.eyebrow}
        title={s.headline}
        description={s.description}
        image={s.image}
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/contact", label: "Talk with Vault" }}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who this product is for</h2>
            <div className="mt-6">
              <CheckList items={s.whoFor} />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">How this structure differs</h2>
            <div className="mt-6">
              <CheckList items={s.differentiators} />
            </div>
          </div>
        </div>
      </Section>

      <SoftStage src={s.image.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">{s.processTitle}</h2>
          <p className="body-lg mt-5">{s.processBody}</p>
        </div>
        <div className="mx-auto mt-10 max-w-[36rem] rounded-[2rem] bg-white/95 px-8 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <CheckList items={s.processPoints} />
        </div>
      </SoftStage>

      <Section tone="paper">
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">Documents typically requested</h2>
          <p className="body-lg mt-5">
            Exact checklists appear in the borrower portal after Apply. The list below reflects
            materials commonly needed to move a {s.name.toLowerCase()} file through package and
            underwriting.
          </p>
          <div className="mt-8">
            <CheckList items={s.documents} />
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-[40rem]">
          <h2 className="headline-lg text-balance">{s.name} FAQs</h2>
          <p className="body-lg mt-5">
            Short answers for search and diligence. Terms stay deal-specific after you submit.
          </p>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {s.faqs.map((faq) => (
              <div key={faq.question} className="py-7">
                <dt className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                  {faq.question}
                </dt>
                <dd className="body-md mt-3">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="mist">
        <RelatedLinks title="Related solutions" links={related} />
      </Section>

      <FinalCta imageSrc={images.funded.src} />
    </>
  );
}
