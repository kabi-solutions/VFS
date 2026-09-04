import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/marketing/LoginForm";
import {
  CheckList,
  PageHero,
  Section,
  SoftStage,
} from "@/components/marketing/page";
import { images } from "@/lib/marketing/images";

export const metadata: Metadata = {
  title: "Client Login",
  description:
    "Sign in to the Vault borrower and partner portal. Who logs in, role-scoped access, and security notes — authentication is mocked until full auth ships.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero
        eyebrow="Portal"
        title="Client login"
        description="Borrowers, brokers, and capital partners use this entry for durable portal access after Apply and organization setup. Authentication is mocked for now."
        image={images.capital}
        primaryCta={{ href: "/apply", label: "Apply Now", shine: true }}
        secondaryCta={{ href: "/contact", label: "Contact Vault" }}
      />

      <Section tone="paper">
        <div className="mx-auto max-w-[28rem]">
          <LoginForm />
        </div>
        <p className="mx-auto mt-10 max-w-[36rem] text-center text-[0.9375rem] text-steel">
          New to Vault?{" "}
          <Link href="/apply" className="font-medium text-green hover:text-green-hover">
            Apply
          </Link>{" "}
          creates the organization and file record your login will attach to once auth is live.
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Who logs in</h2>
            <p className="body-lg mt-5">
              Portal access is role-scoped. The same file trail stays shared; each role sees what
              operations require.
            </p>
            <div className="mt-6">
              <CheckList
                items={[
                  "Borrowers — applications, documents, info requests, and status after Apply",
                  "Brokers / correspondents — files originated through approved referral channels",
                  "Capital partners — lender visibility on assigned files after organization review",
                  "Vault operators, processors, and escrow — internal roles for diligence and closing",
                ]}
              />
            </div>
          </div>
          <div>
            <h2 className="headline-lg max-w-[14ch] text-balance">Security note</h2>
            <p className="body-lg mt-5">
              Do not share credentials. Vault will never ask for your password by email. Until full
              authentication ships, this form is a mock entry for product demos — treat production
              secrets accordingly when auth goes live.
            </p>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-steel">
              Read more under{" "}
              <Link
                href="/trust/security"
                className="font-medium text-green hover:text-green-hover"
              >
                Security & Data Protection
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      <SoftStage src={images.plans.src}>
        <div className="mx-auto max-w-[40rem] text-center">
          <h2 className="headline-lg text-balance">No portal yet?</h2>
          <p className="body-lg mt-5">
            Borrowers start with Apply. Capital partners submit a Partner Application to create a
            pending organization for diligence. Contact Vault if you need access restored for an
            existing file.
          </p>
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9375rem]">
            <Link href="/apply" className="font-medium text-green hover:text-green-hover">
              Apply Now
            </Link>
            <Link
              href="/capital-partners/apply"
              className="font-medium text-green hover:text-green-hover"
            >
              Partner Application
            </Link>
            <Link href="/contact" className="font-medium text-green hover:text-green-hover">
              Contact Vault
            </Link>
          </p>
        </div>
      </SoftStage>
    </>
  );
}
