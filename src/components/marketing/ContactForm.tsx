"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter a valid email."),
  message: z
    .string()
    .trim()
    .min(10, "Add a short message (at least 10 characters).")
    .max(2000, "Keep messages under 2,000 characters."),
});

type ContactValues = z.infer<typeof contactSchema>;

const fieldClass =
  "mt-2 w-full rounded-2xl border border-line-strong bg-white px-4 py-3 text-[1.0625rem] text-ink outline-none transition placeholder:text-steel/70 focus:border-green focus:shadow-[var(--shadow-focus)]";

const labelClass = "block text-[0.9375rem] font-medium text-charcoal";

export function ContactForm() {
  const [submitted, setSubmitted] = useState<ContactValues | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    // Mock only — no backend
    console.log("Contact form submit", values);
    setSubmitted(values);
    reset();
  });

  if (submitted) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
        <p className="text-[0.875rem] font-semibold text-green">Message recorded locally</p>
        <h2 className="headline-lg mt-3 max-w-[16ch] text-balance text-ink">
          Thanks — we logged your note in this session.
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
          This form does not send email yet. Your submission was printed to the browser console and
          stored in local UI state for demonstration.
        </p>
        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Name</dt>
            <dd className="text-charcoal">{submitted.name}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Email</dt>
            <dd className="text-charcoal">{submitted.email}</dd>
          </div>
        </dl>
        <div className="mt-8">
          <Button type="button" variant="secondary" onClick={() => setSubmitted(null)}>
            Send another message
          </Button>
        </div>
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
        {/* PLACEHOLDER — wire to Vault inbox / CRM when ready */}
        Mock form for Connect. Submissions console.log and show a local success state — no backend.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            autoComplete="name"
            className={fieldClass}
            placeholder="Your name"
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className={fieldClass}
            placeholder="you@company.com"
            {...register("email")}
          />
          {errors.email ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.email.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            Message
          </label>
          <textarea
            id="contact-message"
            rows={5}
            className={`${fieldClass} resize-y`}
            placeholder="How can Vault help?"
            {...register("message")}
          />
          {errors.message ? (
            <p className="mt-2 text-[0.875rem] text-red-600">{errors.message.message}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
        <p className="text-[0.8125rem] text-steel">We respond during business hours.</p>
      </div>
    </form>
  );
}
