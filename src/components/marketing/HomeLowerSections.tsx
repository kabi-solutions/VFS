import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { UpdatesSignup } from "@/components/marketing/UpdatesSignup";
import { Button } from "@/components/ui/Button";
import { images } from "@/lib/marketing/images";

type FaqItem = { question: string; answer: string };

function SoftBanner({
  src,
  alt,
  children,
  className = "",
}: {
  src: string;
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* PLACEHOLDER — commissioned photography */}
        <Image src={src} alt={alt} fill className="object-cover opacity-[0.18]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-green-mist/95 via-paper/92 to-green-mist/95" />
      </div>
      <div className="relative">{children}</div>
    </section>
  );
}

function PortalMock() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="h-2 w-2 rounded-full bg-white/25" />
          <span className="ml-2 text-[0.6875rem] text-white/45">Borrower portal</span>
        </div>
        <div className="space-y-4 bg-gradient-to-b from-[#121212] to-[#0a0a0a] px-5 py-6">
          <div>
            <p className="text-[0.6875rem] font-medium text-white/45">File VFS-1001</p>
            <p className="mt-1 text-[1.125rem] font-semibold tracking-[-0.02em] text-white">
              Package in review
            </p>
          </div>
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="mb-3 flex justify-between text-[0.6875rem] text-white/50">
              <span>Lifecycle</span>
              <span className="text-green">Step 3 of 6</span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 flex-1 rounded-full ${n <= 3 ? "bg-green" : "bg-white/15"}`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {["Purchase contract", "Insurance binder", "Entity docs"].map((doc, i) => (
              <div
                key={doc}
                className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2.5"
              >
                <span className="text-[0.8125rem] text-white/80">{doc}</span>
                <span
                  className={`text-[0.6875rem] font-semibold ${
                    i < 2 ? "text-green" : "text-white/40"
                  }`}
                >
                  {i < 2 ? "Received" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating callouts */}
      <div className="absolute -left-2 top-[18%] z-10 max-w-[11.5rem] rounded-2xl bg-white px-3.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:-left-10">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path
                d="M3.5 8.2 6.2 10.9 12.5 4.6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="text-[0.75rem] font-medium leading-snug text-ink">
            Status updated — package received
          </p>
        </div>
      </div>
      <div className="absolute -right-1 bottom-[22%] z-10 max-w-[12rem] rounded-2xl bg-white px-3.5 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.12)] sm:-right-8">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-[0.6875rem] font-bold text-white">
            3
          </span>
          <p className="text-[0.75rem] font-medium leading-snug text-ink">
            Docs cleared this week on the file
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeLowerSections({ faqs }: { faqs: FaqItem[] }) {
  const helpPaths = [
    {
      href: "/apply",
      title: "Fast path to apply",
      body: "Start a digital file in one sitting",
      image: images.investor,
    },
    {
      href: "/login",
      title: "Plain-language status",
      body: "Know the gate without jargon",
      image: images.plans,
    },
    {
      href: "/apply",
      title: "Secure document center",
      body: "Upload once, track what’s received",
      image: images.rehab,
    },
    {
      href: "/capital-partners",
      title: "Capital partner path",
      body: "Deploy into a controlled pipeline",
      image: images.capital,
    },
  ];

  const quotes = [
    {
      quote:
        "The portal made status obvious. We knew what was missing before we got on a call.",
      name: "Borrower · Fix & Flip",
    },
    {
      quote:
        "Draw schedule visibility mattered more than marketing claims. The path matched what we were told.",
      name: "Borrower · Ground-Up",
    },
    {
      quote:
        "Assignment, conditions, and funding history were usable for diligence — not decoration.",
      name: "Capital partner",
    },
  ];

  return (
    <>
      {/* What investors notice — soft stage + floating portal proof */}
      <SoftBanner src={images.funded.src} alt="" className="bg-green-mist">
        <div className="mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="mx-auto max-w-[36rem] text-center">
            <h2 className="headline-lg text-balance">What investors notice first.</h2>
            <p className="body-lg mt-5">
              {/* PLACEHOLDER — Vault to supply real testimonials */}
              Clarity of status, documents, and next steps — illustrated here with placeholder
              feedback until Vault clears real quotes.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,340px)_1fr]">
            <ul className="order-2 space-y-4 lg:order-1">
              {quotes.slice(0, 2).map((item) => (
                <li
                  key={item.name}
                  className="rounded-[1.75rem] bg-white/90 px-6 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.07)] backdrop-blur-sm"
                >
                  <p className="text-[1.0625rem] leading-relaxed text-charcoal">“{item.quote}”</p>
                  <p className="mt-4 text-[0.8125rem] font-semibold text-green">{item.name}</p>
                </li>
              ))}
            </ul>

            <div className="order-1 lg:order-2">
              <PortalMock />
            </div>

            <div className="order-3">
              <div className="rounded-[1.75rem] bg-white/90 px-6 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.07)] backdrop-blur-sm">
                <p className="text-[1.0625rem] leading-relaxed text-charcoal">
                  “{quotes[2].quote}”
                </p>
                <p className="mt-4 text-[0.8125rem] font-semibold text-green">{quotes[2].name}</p>
              </div>
              <div className="mt-4 rounded-[1.75rem] bg-green-soft/80 px-6 py-5">
                <p className="text-[0.875rem] font-semibold text-ink">Why the portal matters</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel">
                  Same audited lifecycle on the marketing site and inside the file — so the borrower
                  view matches operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SoftBanner>

      {/* How can we help — image tiles, not flat white/mint cards */}
      <section className="bg-ink">
        <div className="mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <h2 className="headline-lg mx-auto max-w-[18ch] text-balance text-center text-white">
            How can we help today?
          </h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {helpPaths.map((card) => (
              <li key={card.title}>
                <Link
                  href={card.href}
                  className="group relative block aspect-[16/10] overflow-hidden rounded-[1.75rem] focus-visible:outline-offset-4"
                >
                  {/* PLACEHOLDER — commissioned photography */}
                  <Image
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/10" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-white">
                      {card.title}
                    </p>
                    <p className="mt-1.5 text-[0.9375rem] text-white/75">{card.body}</p>
                    <span className="mt-4 inline-flex text-[0.875rem] font-medium text-green">
                      Continue
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — soft banner + white accordion (restored) */}
      <SoftBanner src={images.plans.src} alt="" className="bg-paper">
        <div className="mx-auto max-w-[880px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="mx-auto max-w-[36rem] text-center">
            <h2 className="headline-lg text-balance">Vault FAQs</h2>
            <p className="body-lg mt-5">
              Straight answers for borrowers and capital partners — without invented rate tables.
            </p>
          </div>
          <div className="mt-10 rounded-[2rem] bg-white/95 px-5 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-sm sm:px-8">
            <FaqAccordion items={faqs} />
          </div>
          <p className="mt-8 text-center">
            <Link href="/resources/faqs" className="font-medium text-green hover:text-green-hover">
              See all FAQs
            </Link>
          </p>
        </div>
      </SoftBanner>

      {/* Trust — editorial strip on near-black related photo */}
      <section className="relative overflow-hidden bg-ink">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* PLACEHOLDER — security / precision architecture imagery */}
          <Image
            src={images.capital.src}
            alt=""
            fill
            className="object-cover opacity-[0.28] saturate-[0.55] brightness-[0.45]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/92 via-ink/88 to-ink/94" />
        </div>
        <div className="relative mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_1.35fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-[0.8125rem] font-semibold tracking-[0.08em] text-green uppercase">
                Diligence
              </p>
              <h2 className="headline-lg mt-4 text-balance text-white">
                Trust that holds up to diligence.
              </h2>
              <p className="mt-5 text-[1.125rem] leading-relaxed text-white/65">
                Licensing, security, and legal disclosures — written to be checked, not decorated.
              </p>
            </div>
            <ol className="border-t border-white/15">
              {[
                {
                  href: "/trust/licensing",
                  n: "01",
                  title: "Licensing & Compliance",
                  body: "State licensing posture pending Vault’s compliance pack.",
                },
                {
                  href: "/trust/security",
                  n: "02",
                  title: "Security & Data",
                  body: "Role-based access and audited status history on every file.",
                },
                {
                  href: "/trust/legal",
                  n: "03",
                  title: "Legal",
                  body: "Privacy, Terms, and lending disclosures in one place.",
                },
              ].map((item) => (
                <li key={item.href} className="border-b border-white/15">
                  <Link
                    href={item.href}
                    className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 sm:gap-6"
                  >
                    <span className="font-mono text-[0.8125rem] tabular-nums text-green">{item.n}</span>
                    <span>
                      <span className="block text-[1.125rem] font-semibold tracking-[-0.02em] text-white group-hover:text-green">
                        {item.title}
                      </span>
                      <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-white/55">
                        {item.body}
                      </span>
                    </span>
                    <span className="text-[0.875rem] font-medium text-green">Learn more</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Updates + resource bentos — restored light stage */}
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={images.capital.src}
            alt=""
            fill
            className="object-cover opacity-[0.08]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-white/90 to-paper" />
        </div>
        <div className="relative mx-auto max-w-[1080px] px-6 py-[var(--spacing-section)] lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="headline-lg max-w-[14ch] text-balance">
              Sign up for the latest offers &amp; updates
            </h2>
            <UpdatesSignup />
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
              <div className="flex items-start justify-between gap-4">
                <Link
                  href="/resources"
                  className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink hover:text-green"
                >
                  Learning resources
                </Link>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-mist text-ink"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M6 8h12v10H6V8Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 8V6.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  { href: "/resources", label: "Learning Center / Guides" },
                  { href: "/resources/glossary", label: "Glossary of lending terms" },
                  { href: "/resources/case-studies", label: "Case studies / funded deals" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-[1.0625rem] text-charcoal hover:text-green"
                    >
                      <span aria-hidden>→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(0,0,0,0.07)] ring-1 ring-black/[0.04]">
              <div className="flex items-start justify-between gap-4">
                <Link
                  href="/resources/faqs"
                  className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink hover:text-green"
                >
                  Investor tools
                </Link>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-green-soft text-green"
                  aria-hidden
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <rect
                      x="5"
                      y="4"
                      width="14"
                      height="16"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 9h8M8 12.5h8M8 16h5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {[
                  { href: "/resources/faqs", label: "Expanded FAQs" },
                  { href: "/apply", label: "Start an application" },
                  { href: "/contact", label: "Talk with Vault" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-[1.0625rem] text-charcoal hover:text-green"
                    >
                      <span aria-hidden>→</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Locations + community — photo cards */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1080px] gap-4 px-6 py-[var(--spacing-section)] md:grid-cols-2 lg:px-8">
          <Link
            href="/locations"
            className="group relative min-h-[22rem] overflow-hidden rounded-[2rem]"
          >
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/15" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-white">
                States we serve
              </h2>
              <p className="mt-3 max-w-sm text-[1.0625rem] leading-relaxed text-white/75">
                {/* PLACEHOLDER — licensing may not exist in all listed markets */}
                CA, TX, FL, AZ, NV, GA, NC, CO, WA, TN — with dynamic state landing pages.
              </p>
              <span className="mt-5 inline-flex font-medium text-green">View locations</span>
            </div>
          </Link>
          <Link
            href="/company/community-impact"
            className="group relative min-h-[22rem] overflow-hidden rounded-[2rem]"
          >
            <Image
              src={images.community.src}
              alt={images.community.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-white">
                Community impact
              </h2>
              <p className="mt-3 max-w-sm text-[1.0625rem] leading-relaxed text-white/75">
                {/* PLACEHOLDER — confirm NPHY sponsorship copy with Vault */}
                A portion of funded deals supports youth housing initiatives in Southern Nevada.
              </p>
              <span className="mt-5 inline-flex font-medium text-green">Read about our impact</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Final CTA — floating white card on mist (restored) */}
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* PLACEHOLDER — different subject than States/Community banner */}
          <Image
            src={images.groundUp.src}
            alt=""
            fill
            className="object-cover opacity-[0.14]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-green-mist/80 to-green-soft/50" />
        </div>
        <div className="relative mx-auto max-w-[720px] px-6 py-[var(--spacing-section)] text-center lg:px-8">
          <div className="rounded-[2rem] bg-white/95 px-8 py-12 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] backdrop-blur-sm sm:px-12">
            <h2 className="headline-lg mx-auto max-w-[16ch] text-balance text-ink">
              Ready to submit a file?
            </h2>
            <p className="mx-auto mt-5 max-w-[32rem] text-[1.125rem] leading-relaxed text-steel">
              Apply creates your borrower portal so you can return, update documents, and track status
              across the lifecycle.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/apply" shine>
                Apply Now
              </Button>
              <Button href="/contact" variant="secondary">
                Contact Vault
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
