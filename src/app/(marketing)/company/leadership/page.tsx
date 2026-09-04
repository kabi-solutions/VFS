import type { Metadata } from "next";
import Image from "next/image";
import {
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Leadership at Vault Financial Services — institutional private lending for real estate investors.",
};

/* PLACEHOLDER — replace names, titles, bios, and headshots with Vault-approved content */
const leaders = [
  {
    name: "Alex Rivera",
    title: "Chief Executive Officer",
    bio: "Sets credit posture and operating standards across originations, underwriting, and capital partnership diligence.",
    image: {
      src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
      alt: "Placeholder portrait for CEO",
    },
  },
  {
    name: "Jordan Blake",
    title: "Chief Credit Officer",
    bio: "Owns underwriting policy, condition discipline, and file quality from package through clear to close.",
    image: {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      alt: "Placeholder portrait for Chief Credit Officer",
    },
  },
  {
    name: "Sam Nguyen",
    title: "Head of Capital Markets",
    bio: "Coordinates capital partner relationships, deployment reporting, and diligence readiness for pending organizations.",
    image: {
      src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
      alt: "Placeholder portrait for Head of Capital Markets",
    },
  },
  {
    name: "Taylor Brooks",
    title: "Head of Operations",
    bio: "Runs processor routing, document workflows, and the audited lifecycle that borrowers see in the portal.",
    image: {
      src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
      alt: "Placeholder portrait for Head of Operations",
    },
  },
] as const;

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="Leadership"
        description="The people accountable for credit quality, operating discipline, and capital partnership diligence at Vault."
        primaryCta={{ href: "/company/about", label: "Our story" }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
        image={images.plans}
      />

      <Section>
        <div className="mx-auto max-w-[36rem] text-center">
          <h2 className="headline-lg text-balance">Accountable leadership</h2>
          <p className="body-lg mt-5">
            {/* PLACEHOLDER — confirm org chart and bios with Vault */}
            Roles below are structural until Vault approves names, photos, and biographies for public use.
          </p>
        </div>

        <ul className="mt-14 grid gap-10 sm:grid-cols-2">
          {leaders.map((person) => (
            <li key={person.name} className="flex flex-col gap-5 sm:flex-row sm:gap-6">
              <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[1.5rem] bg-green-mist sm:h-40 sm:w-40 sm:aspect-auto">
                {/* PLACEHOLDER — commissioned headshots */}
                <Image
                  src={person.image.src}
                  alt={person.image.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, 160px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[1.25rem] font-semibold tracking-[-0.02em] text-ink">
                  {person.name}
                </p>
                <p className="mt-1 text-[0.9375rem] font-medium text-green">{person.title}</p>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-steel">{person.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[34rem] text-center">
          <h2 className="headline-lg text-balance text-ink">Credit and operations in one system</h2>
          <p className="body-lg mt-5">
            Leadership is measured by file quality — published stages, retained history, and clear
            ownership from application through funding.
          </p>
        </div>
      </SoftStage>

      <Section tone="paper">
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/company/about",
              label: "About Vault",
              body: "Institutional private lending and operating model.",
            },
            {
              href: "/company/careers",
              label: "Careers",
              body: "Open roles and how we hire — listings confirmed through Contact.",
            },
            {
              href: "/trust/licensing",
              label: "Licensing",
              body: "Disclosures maintained under Trust.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.capital.src}
        title="Talk with Vault"
        description="Questions about partnership, coverage, or a live file? Reach the team through Contact."
        primaryHref="/contact"
        primaryLabel="Contact Vault"
        secondaryHref="/company/about"
        secondaryLabel="Our story"
      />
    </>
  );
}
