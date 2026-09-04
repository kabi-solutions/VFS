"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { submitCapitalPartnerApplication } from "@/lib/mock/capital-partner-applications";

const partnerApplicationSchema = z.object({
  firmName: z.string().trim().min(2, "Enter the firm name."),
  contactName: z.string().trim().min(2, "Enter a contact name."),
  email: z.email("Enter a valid work email."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  deployableCapital: z
    .string()
    .trim()
    .min(2, "Describe AUM or deployable capital qualitatively."),
  notes: z.string().trim().max(2000, "Keep notes under 2,000 characters."),
});

type PartnerApplicationValues = z.infer<typeof partnerApplicationSchema>;

const fieldClass =
  "mt-2 w-full rounded-2xl border border-line-strong bg-white px-4 py-3 text-[1.0625rem] text-ink outline-none transition placeholder:text-steel/70 focus:border-green focus:shadow-[var(--shadow-focus)]";

const labelClass = "block text-[0.9375rem] font-medium text-charcoal";

export function PartnerApplicationForm() {
  const [result, setResult] = useState<{
    organizationId: string;
    firmName: string;
    status: "pending_review";
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PartnerApplicationValues>({
    resolver: zodResolver(partnerApplicationSchema),
    defaultValues: {
      firmName: "",
      contactName: "",
      email: "",
      phone: "",
      deployableCapital: "",
      notes: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const { organization } = submitCapitalPartnerApplication({
      firmName: values.firmName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      deployableCapital: values.deployableCapital,
      notes: values.notes,
    });

    setResult({
      organizationId: organization.id,
      firmName: organization.name,
      status: organization.status as "pending_review",
    });
  });

  if (result) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
        <p className="text-[0.875rem] font-semibold text-green">Application received</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Pending organization created for diligence.
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
          Your Partner Application created a{" "}
          <span className="font-medium text-charcoal">capital_partner</span> organization record
          for <span className="font-medium text-charcoal">{result.firmName}</span> with status{" "}
          <span className="font-medium text-charcoal">{result.status}</span>. This is not a
          disposable lead — Vault will use the record for partnership diligence.
        </p>
        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Organization ID</dt>
            <dd className="font-mono text-charcoal">{result.organizationId}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Org type</dt>
            <dd className="text-charcoal">capital_partner</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Status</dt>
            <dd className="text-charcoal">pending_review</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/capital-partners/deployment">How Deployment Works</Button>
          <Button href="/capital-partners" variant="secondary">
            Why Partner With Vault
          </Button>
        </div>
        <p className="mt-6 text-[0.875rem] text-steel">
          Questions before diligence begins?{" "}
          <Link href="/contact" className="font-medium text-green hover:text-green-hover">
            Contact Vault
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10"
    >
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        Submitting creates a pending{" "}
        <span className="font-medium text-charcoal">capital_partner</span> organization with status{" "}
        <span className="font-medium text-charcoal">pending_review</span> for diligence — not a
        marketing lead capture.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="firmName" className={labelClass}>
            Firm name
          </label>
          <input
            id="firmName"
            autoComplete="organization"
            className={fieldClass}
            placeholder="Firm or fund legal name"
            {...register("firmName")}
          />
          {errors.firmName ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.firmName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contactName" className={labelClass}>
            Contact name
          </label>
          <input
            id="contactName"
            autoComplete="name"
            className={fieldClass}
            placeholder="Primary contact"
            {...register("contactName")}
          />
          {errors.contactName ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.contactName.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            placeholder="name@firm.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
            placeholder="Direct line"
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.phone.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="deployableCapital" className={labelClass}>
            AUM / deployable capital
          </label>
          <input
            id="deployableCapital"
            className={fieldClass}
            placeholder="Qualitative range (e.g. mid-eight figures)"
            {...register("deployableCapital")}
          />
          {errors.deployableCapital ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.deployableCapital.message}</p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className={labelClass}>
            Notes <span className="font-normal text-steel">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Mandate fit, product interest, reporting needs"
            {...register("notes")}
          />
          {errors.notes ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.notes.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit Partner Application"}
        </Button>
        <p className="text-[0.8125rem] text-steel">
          {/* PLACEHOLDER — compliance review of partner intake disclosures */}
          Subject to Vault diligence and applicable partnership terms.
        </p>
      </div>
    </form>
  );
}
