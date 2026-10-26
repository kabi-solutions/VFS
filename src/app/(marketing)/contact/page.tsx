import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/ContactForm";
import {
  FinalCta,
  PageHero,
  RelatedLinks,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Connect with Vault Financial Services — borrower questions, media, recruiting, and general inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Contact Vault"
        description="Reach the team for file questions, partnership diligence, media, or recruiting. Product applications start on Apply."
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/company/about", label: "About Vault" }}
        image={images.plans}
      />

      <Section tone="paper">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <h2 className="headline-lg max-w-[12ch] text-balance text-ink">How to reach us</h2>
            <p className="mt-5 text-[1.125rem] leading-relaxed text-steel">
              Use the form for general inquiries. Borrowers with a live file should prefer the portal
              once Apply creates access. Capital partners should use Partner Application for diligence
              intake.
            </p>
            <dl className="mt-8 space-y-4 border-t border-line pt-6 text-[0.9375rem]">
              <div>
                <dt className="font-medium text-charcoal">Headquarters</dt>
                {/* PLACEHOLDER — confirm address with Vault */}
                <dd className="mt-1 text-steel">Las Vegas, Nevada · Southern Nevada</dd>
              </div>
              <div>
                <dt className="font-medium text-charcoal">Email</dt>
                {/* PLACEHOLDER — confirm public inbox with Vault */}
                <dd className="mt-1 text-steel">hello@vaultfinancial.example</dd>
              </div>
              <div>
                <dt className="font-medium text-charcoal">Hours</dt>
                <dd className="mt-1 text-steel">Weekdays · business hours Pacific</dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </Section>

      <SoftStage src={images.capital.src}>
        <div className="mx-auto max-w-[34rem] text-center">
          <h2 className="headline-lg text-balance text-ink">Prefer a structured intake?</h2>
          <p className="body-lg mt-5">
            Borrowers: start Apply. Capital partners: submit a Partner Application to create a pending
            organization for diligence.
          </p>
        </div>
      </SoftStage>

      <Section>
        <RelatedLinks
          title="Related"
          links={[
            {
              href: "/apply",
              label: "Apply",
              body: "Create your borrower portal and start a file.",
            },
            {
              href: "/capital-partners/apply",
              label: "Partner Application",
              body: "Pending capital_partner organization for diligence.",
            },
            {
              href: "/company/press",
              label: "Press & Media",
              body: "Media kit requests and approved coverage.",
            },
            {
              href: "/locations",
              label: "Locations",
              body: "Starter markets and state pages.",
            },
          ]}
        />
      </Section>

      <FinalCta
        imageSrc={images.funded.src}
        title="Ready to submit a file?"
        description="Apply creates your borrower portal so you can return, update documents, and track status across the lifecycle."
      />
    </>
  );
}
