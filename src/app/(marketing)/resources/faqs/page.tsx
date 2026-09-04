import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCta, PageHero, SoftStage } from "@/components/marketing/page";
import { JsonLd } from "@/components/seo/JsonLd";
import { expandedFaqs } from "@/lib/marketing/faqs";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Expanded Vault FAQs for borrowers and capital partners — lifecycle, documents, markets, and portal access.",
};

function getFaqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: expandedFaqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={getFaqPageJsonLd()} />

      <PageHero
        eyebrow="Resources"
        title="Vault FAQs"
        description="Straight answers for borrowers and capital partners — without invented rate tables or licensing IDs."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
      />

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Questions we hear most</h2>
          <p className="body-lg mt-5">
            Includes the homepage set plus deeper coverage of products, documents, draws, and
            markets.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-[880px] rounded-[2rem] bg-white/95 px-5 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:px-8">
          <FaqAccordion items={expandedFaqs} />
        </div>
        <p className="mt-8 text-center">
          <Link href="/resources" className="font-medium text-green hover:text-green-hover">
            Back to Learning Center
          </Link>
        </p>
      </SoftStage>

      <FinalCta
        imageSrc={images.funded.src}
        title="Still deciding on fit?"
        description="Start an application to create portal access, or contact Vault with a market-specific question."
      />
    </>
  );
}
