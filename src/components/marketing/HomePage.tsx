import Image from "next/image";
import Link from "next/link";
import { BrandImage } from "@/components/marketing/BrandImage";
import { CtaGroup } from "@/components/marketing/CtaGroup";
import { HomeLowerSections } from "@/components/marketing/HomeLowerSections";
import { LifecycleFlow, type LifecycleStep } from "@/components/marketing/LifecycleFlow";
import {
  ProductFeatureSection,
  type ProductFeature,
} from "@/components/marketing/ProductFeatureSection";
import { RecentFiles } from "@/components/marketing/RecentFiles";
import { Testimonials } from "@/components/marketing/Testimonials";
import { fundingSpeedClaimShort } from "@/lib/config/claims";
import { CTA_PRIMARY, CTA_SECONDARY } from "@/lib/config/ctas";
import { homepageFaqs as faqs } from "@/lib/marketing/faqs";
import { images } from "@/lib/marketing/images";

const productFeatures: ProductFeature[] = [
  {
    href: "/solutions/private-money",
    title: "Private Money",
    titleSize: "lg",
    headline: "Flexible, fast-approvals, at the best interest rates - no one does private money better than us.",
    bullets: [
      "First and second trust deed options",
      "Leverage built for acquisition speed — not bank templates",
      "Guided application process provides you with a pre-approval in minutes and your funding in days – not weeks.",
    ],
    image: images.privateMoney,
    cardLabel: "Structure",
    cardValue: "Private capital",
    cardMeta: "Deal-first terms",
    reverse: false,
  },
  {
    href: "/solutions/rehab-fix-flip",
    title: "Rehab / Fix & Flip",
    titleSize: "lg",
    headline: "Buy, renovate, and exit quickly.",
    bullets: [
      "Funding to cover the purchase and the rehab",
      "Designed for the investor who moves quickly between projects",
      "Online portal allows you to apply and track projects in one place. Reuse common data between projects to eliminate redundant data entry.",
    ],
    image: images.rehab,
    cardLabel: "For investors",
    cardValue: "Fix & flip",
    cardMeta: "Purchase + rehab",
    reverse: true,
  },
  {
    href: "/solutions/bridge-loans",
    title: "Bridge Loans",
    titleSize: "lg",
    headline: "Bridge the gap and keep the close on your schedule.",
    bullets: [
      "Bridge acquisition, refinance, or hold periods",
      "Designed for clean exits into permanent or DSCR financing",
      "Processor and lender assignment tracked on every file",
    ],
    image: images.bridge,
    cardLabel: "Hold period",
    cardValue: "Bridge",
    cardMeta: "Transitional capital",
    reverse: false,
  },
  {
    href: "/solutions/ground-up",
    title: "Ground-Up Construction",
    headline: "Draws that release when the build earns them.",
    bullets: [
      "Foundation, framing, and completion milestones",
      "Draw requests tied to verified progress",
      "Same audited lifecycle from package through funding",
    ],
    image: images.groundUp,
    cardLabel: "Build stage",
    cardValue: "Draw schedule",
    cardMeta: "Milestone based",
    reverse: true,
  },
  {
    href: "/solutions/dscr-non-qm",
    title: "DSCR & Non-QM",
    headline: "Qualify on rent rolls — not W-2 paperwork alone.",
    bullets: [
      "Debt-service coverage focused underwriting for rentals",
      "Built for portfolio investors and non-traditional income",
      "Close in entity or personal name when the file supports it",
    ],
    image: images.dscr,
    cardLabel: "Qualification",
    cardValue: "Property cash flow",
    cardMeta: "Investor DSCR",
    reverse: false,
  },
];

const lifecycleSteps: LifecycleStep[] = [
  {
    id: "application",
    title: "Application",
    body: "Submit property, borrower, and loan details in minutes. Vector by Vault opens so you can return and update the file anytime.",
    image: images.lifecycleApply,
  },
  {
    id: "initial_review",
    title: "Initial review",
    body: "Vault reviews the file. Approval triggers a Letter of Intent and a package request. Denial ends cleanly with notice.",
    image: images.lifecycleReview,
  },
  {
    id: "package",
    title: "Package",
    body: "Upload the full loan package. Missing items return as info requested — then snap back to the right stage once resolved.",
    image: images.lifecyclePackage,
  },
  {
    id: "underwriting",
    title: "Underwriting",
    body: "A Processor routes the package to the assigned Lender. Conditions stay attached to the file until cleared.",
    image: images.lifecycleUnderwrite,
  },
  {
    id: "clear_to_close",
    title: "Clear to close",
    body: "Prior-to-funding conditions are issued and satisfied. Closing prep moves documents to Escrow/Title.",
    image: images.lifecycleClose,
  },
  {
    id: "funding",
    title: "Signing & funding",
    body: "Documents are signed, funds move to Title, recording is confirmed, and the seller or lienholder is paid.",
    image: images.lifecycleFund,
  },
];

export function HomePage() {
  const speed = fundingSpeedClaimShort();

  return (
    <>
      {/* Hero — benefit-forward, bright */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1080px] items-center gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-1 text-[0.8125rem] font-semibold text-green">
              Investor credit · Multi-state coverage · Diligence-first
            </p>
            <h1 className="headline-xl mt-5 max-w-[16ch] text-balance text-ink">
              Capital that moves as fast as you.
            </h1>
            <p className="body-lg mt-5 max-w-[34rem]">
              Private money for fix &amp; flip, bridge, ground-up, and DSCR investors.
            </p>
            <p className="mt-4 max-w-[34rem] text-[1rem] font-medium text-charcoal">{speed}</p>
            <p className="mt-3 max-w-[34rem] text-[1.0625rem] font-semibold text-ink">
              Give us 2 minutes and we&apos;ll give you a pre-approval.
            </p>
            <ul className="mt-6 space-y-3">
              {["Apply in one sitting", "Track status in real-time"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[1.0625rem] text-charcoal">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-soft text-green">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
                      <path
                        d="M3.5 8.2 6.2 10.9 12.5 4.6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <CtaGroup className="mt-8" showDisclaimer />
            <p className="mt-5 text-[0.8125rem] text-steel">
              Subject to credit approval and applicable state licensing. Terms vary by deal.
            </p>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-green-mist sm:aspect-[5/4]">
              <BrandImage
                src={images.hero.src}
                alt={images.hero.alt}
                priority
                greenAccent="corner"
                className="absolute inset-4 overflow-hidden rounded-[1.5rem] sm:inset-5"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefit strip */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-6 py-12 sm:grid-cols-3 lg:px-8">
          {[
            {
              title: "Quickly apply for your loan in one location. No endless emailing back-and-forth.",
              body: "Quickly apply for funding in one location. No uploading documents to outside applications or endless emails.",
            },
            {
              title: "Track your application in real-time",
              body: "Published gates from review to funding — visible in Vector by Vault as your file moves.",
            },
            {
              title: "Online Portal Access",
              body: "Stay organized with a secure portal that stores your information and projects. No re-entering data for every new project.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-green-soft text-green sm:mx-0">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                  <path
                    d="M5 12.5 9.5 17 19 7.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h2>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions intro */}
      <section className="bg-white pt-16 lg:pt-20">
        <div className="mx-auto max-w-[40rem] px-6 text-center lg:px-8">
          <h2 className="headline-lg text-balance">The right solution for you.</h2>
          <p className="body-lg mt-5">
            Whether it&apos;s a fix &amp; flip, bridge, ground-up, or DSCR, we specialize in finding
            the right lending solution for your specific needs.
          </p>
          <p className="mt-4">
            <Link href="/strategies" className="font-medium text-green hover:text-green-hover">
              Browse by strategy or experience
            </Link>
          </p>
        </div>
      </section>

      {/* Alternating product feature sections */}
      {productFeatures.map((feature) => (
        <ProductFeatureSection key={feature.href} feature={feature} />
      ))}

      {/* How it works — Vector by Vault */}
      <section className="relative overflow-hidden bg-green-mist">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={images.plans.src}
            alt=""
            fill
            className="object-cover opacity-[0.12]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-mist/90 via-green-mist/95 to-paper" />
        </div>
        <div className="relative mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="mx-auto max-w-[40rem] text-center">
            <h2 className="headline-lg text-balance">
              Vector by Vault allows you to apply, review, and track all your loans in one place. No
              more endless back-and-forth emails or wondering where you are in the process.
            </h2>
            <p className="body-lg mt-5">Get your project funded in six easy steps. {speed}</p>
          </div>

          <LifecycleFlow steps={lifecycleSteps} />
          <div className="mt-10 flex justify-center">
            <CtaGroup align="center" />
          </div>
        </div>
      </section>

      {/* Borrower-focused CTA band (capital partners removed from home) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-green-mist">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
                <BrandImage
                  src={images.investor.src}
                  alt={images.investor.alt}
                  greenAccent="corner"
                  className="absolute inset-0"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-8 lg:p-12">
                <p className="text-[0.875rem] font-semibold text-green">For borrowers</p>
                <h2 className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
                  Get started now with Vault.
                </h2>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-steel">
                  Quickly apply for funding, track your application in real-time, and stay organized
                  in Vector by Vault.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={CTA_PRIMARY.href}
                    className="btn-shine inline-flex items-center justify-center rounded-full bg-green px-5 py-2.5 text-[0.9375rem] font-medium text-white hover:bg-green-hover"
                  >
                    {CTA_PRIMARY.label}
                  </a>
                  <a
                    href={CTA_SECONDARY.href}
                    className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-[0.9375rem] font-medium text-ink ring-1 ring-line hover:bg-white"
                  >
                    {CTA_SECONDARY.label}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentFiles className="bg-white py-[var(--spacing-section)]" />
      <Testimonials className="bg-paper py-[var(--spacing-section)]" />

      <HomeLowerSections faqs={faqs} />
    </>
  );
}
