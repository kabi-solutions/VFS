"use client";

import { useMemo, useState, type DragEvent } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { createApplication, type MockDocumentInput } from "@/lib/mock/applications";
import { starterStates } from "@/lib/marketing/states";
import { loanTypeLabels } from "@/lib/mock/status-labels";
import type { LoanType } from "@/lib/types/database";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

const loanTypes = Object.keys(loanTypeLabels) as LoanType[];

const propertySchema = z.object({
  property_address: z.string().trim().min(3, "Enter the street address."),
  property_city: z.string().trim().min(2, "Enter the city."),
  property_state: z.string().trim().min(2, "Enter a state."),
  property_postal: z
    .string()
    .trim()
    .min(5, "Enter a postal code.")
    .max(10, "Postal code is too long."),
  property_type: z.string().trim().max(80).optional().or(z.literal("")),
});

const borrowerSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Enter a valid email."),
  phone: z.string().trim().min(7, "Enter a phone number."),
  entity_name: z.string().trim().max(120).optional().or(z.literal("")),
});

const optionalMoney = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || !Number.isNaN(Number(String(v).replace(/,/g, ""))), {
    message: "Enter a valid amount.",
  });

const loanSchema = z.object({
  loan_type: z.enum([
    "private_money",
    "rehab_fix_flip",
    "bridge",
    "ground_up",
    "dscr_non_qm",
  ]),
  loan_amount: z
    .string()
    .trim()
    .min(1, "Enter a loan amount.")
    .refine((v) => {
      const n = Number(String(v).replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }, "Enter a valid loan amount."),
  purchase_price: optionalMoney,
  estimated_arv: optionalMoney,
  notes: z.string().trim().max(2000, "Keep notes under 2,000 characters.").optional().or(z.literal("")),
  attribution_source_id: z.literal("direct_apply"),
});

const applySchema = propertySchema.merge(borrowerSchema).merge(loanSchema);

type ApplyValues = z.infer<typeof applySchema>;

const stepFields: Record<1 | 2 | 3, (keyof ApplyValues)[]> = {
  1: ["property_address", "property_city", "property_state", "property_postal", "property_type"],
  2: ["full_name", "email", "phone", "entity_name"],
  3: [
    "loan_type",
    "loan_amount",
    "purchase_price",
    "estimated_arv",
    "notes",
    "attribution_source_id",
  ],
};

const steps = [
  { id: 1, label: "Property" },
  { id: 2, label: "Borrower" },
  { id: 3, label: "Loan" },
  { id: 4, label: "Documents" },
] as const;

const docCategories = [
  { id: "purchase_contract", label: "Purchase contract" },
  { id: "entity_docs", label: "Entity documents" },
  { id: "insurance", label: "Insurance" },
  { id: "bank_statements", label: "Bank statements" },
  { id: "rehab_budget", label: "Rehab budget / scope" },
  { id: "other", label: "Other" },
] as const;

type PendingDoc = MockDocumentInput & { localId: string; error?: string };

const fieldClass =
  "mt-2 w-full rounded-2xl border border-line-strong bg-white px-4 py-3 text-[1.0625rem] text-ink outline-none transition placeholder:text-steel/70 focus:border-green focus:shadow-[var(--shadow-focus)]";

const labelClass = "block text-[0.9375rem] font-medium text-charcoal";

function parseMoney(value?: string): number | null {
  if (!value?.trim()) return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isNaN(n) ? null : n;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplyWizard({ priorApplicationId }: { priorApplicationId?: string }) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [pendingDocs, setPendingDocs] = useState<PendingDoc[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [defaultDocType, setDefaultDocType] = useState<string>("other");
  const [result, setResult] = useState<{
    referenceCode: string;
    applicationId: string;
    email: string;
  } | null>(null);

  const defaultValues = useMemo<ApplyValues>(
    () => ({
      property_address: "",
      property_city: "",
      property_state: "NV",
      property_postal: "",
      property_type: "",
      full_name: "",
      email: "",
      phone: "",
      entity_name: "",
      loan_type: "rehab_fix_flip",
      loan_amount: "",
      purchase_price: "",
      estimated_arv: "",
      notes: "",
      attribution_source_id: "direct_apply",
    }),
    [],
  );

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    defaultValues,
    mode: "onTouched",
  });

  async function goNext() {
    if (step < 4) {
      const ok = await trigger(stepFields[step as 1 | 2 | 3]);
      if (!ok) return;
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    }
  }

  function goBack() {
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
  }

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const next: PendingDoc[] = files.map((file) => {
      const tooLarge = file.size > MAX_FILE_BYTES;
      return {
        localId: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file_name: file.name,
        doc_type: defaultDocType,
        file_size_bytes: file.size,
        mime_type: file.type || null,
        error: tooLarge ? `Exceeds ${formatBytes(MAX_FILE_BYTES)} limit` : undefined,
      };
    });
    setPendingDocs((prev) => [...prev, ...next]);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  const onSubmit = handleSubmit((values) => {
    const validDocs = pendingDocs.filter((d) => !d.error);
    const { application, user } = createApplication({
      property_address: values.property_address,
      property_city: values.property_city,
      property_state: values.property_state,
      property_postal: values.property_postal,
      property_type: values.property_type || undefined,
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      entity_name: values.entity_name || undefined,
      loan_type: values.loan_type,
      loan_amount: parseMoney(values.loan_amount) ?? 0,
      purchase_price: parseMoney(values.purchase_price),
      estimated_arv: parseMoney(values.estimated_arv),
      notes: values.notes || undefined,
      attribution_source_id: "direct_apply",
      prior_application_id: priorApplicationId || null,
      documents: validDocs.map(({ file_name, doc_type, file_size_bytes, mime_type }) => ({
        file_name,
        doc_type,
        file_size_bytes,
        mime_type,
      })),
    });

    setResult({
      referenceCode: application.reference_code,
      applicationId: application.id,
      email: user.email,
    });
  });

  if (result) {
    return (
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
        <p className="text-[0.875rem] font-semibold text-green">Application submitted</p>
        <h2 className="headline-lg mt-3 max-w-[18ch] text-balance text-ink">
          Your file is on the record.
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-steel">
          Portal access was created for{" "}
          <span className="font-medium text-charcoal">{result.email}</span>. Status, documents, and
          history live in the borrower workspace — return anytime without restarting the file.
        </p>
        <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Reference</dt>
            <dd className="font-mono text-charcoal">{result.referenceCode}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2">
            <dt className="text-steel">Status</dt>
            <dd className="text-charcoal">application_submitted</dd>
          </div>
          {priorApplicationId ? (
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-steel">Prior file</dt>
              <dd className="font-mono text-charcoal">{priorApplicationId}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/portal/borrower" shine>
            Open borrower portal
          </Button>
          <Button href="/login" variant="secondary">
            Client login
          </Button>
        </div>
        <p className="mt-6 text-[0.875rem] text-steel">
          {/* PLACEHOLDER — replace mock session with real auth */}
          Mock layer only — submissions persist in this browser via localStorage.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] sm:p-10">
      <div className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Application progress">
          {steps.map((s) => {
            const active = step === s.id;
            const done = step > s.id;
            return (
              <li key={s.id} className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[0.8125rem] font-semibold ${
                    active
                      ? "bg-green text-white"
                      : done
                        ? "bg-green-soft text-green"
                        : "bg-paper text-steel"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {s.id}
                </span>
                <span
                  className={`hidden text-[0.875rem] font-medium sm:inline ${
                    active ? "text-ink" : "text-steel"
                  }`}
                >
                  {s.label}
                </span>
                {s.id < 4 ? (
                  <span className="hidden h-px w-6 bg-line-strong sm:block" aria-hidden />
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-[0.875rem] text-steel sm:hidden">
          Step {step} of 4 — {steps[step - 1].label}
        </p>
      </div>

      {priorApplicationId ? (
        <p className="mb-6 rounded-2xl bg-green-mist px-4 py-3 text-[0.9375rem] text-charcoal">
          Starting a new application linked to prior file{" "}
          <span className="font-mono text-[0.875rem]">{priorApplicationId}</span>.
        </p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 4) {
            void goNext();
            return;
          }
          void onSubmit();
        }}
        noValidate
      >
        {step === 1 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="property_address" className={labelClass}>
                Property address
              </label>
              <input
                id="property_address"
                autoComplete="street-address"
                className={fieldClass}
                placeholder="Street address"
                {...register("property_address")}
              />
              {errors.property_address ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.property_address.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="property_city" className={labelClass}>
                City
              </label>
              <input
                id="property_city"
                autoComplete="address-level2"
                className={fieldClass}
                {...register("property_city")}
              />
              {errors.property_city ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.property_city.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="property_state" className={labelClass}>
                State
              </label>
              <input
                id="property_state"
                list="vfs-starter-states"
                autoComplete="address-level1"
                className={fieldClass}
                placeholder="NV or other"
                {...register("property_state")}
              />
              <datalist id="vfs-starter-states">
                {starterStates.map((s) => (
                  <option key={s.abbr} value={s.abbr}>
                    {s.name}
                  </option>
                ))}
              </datalist>
              {errors.property_state ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.property_state.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="property_postal" className={labelClass}>
                Postal code
              </label>
              <input
                id="property_postal"
                autoComplete="postal-code"
                className={fieldClass}
                {...register("property_postal")}
              />
              {errors.property_postal ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.property_postal.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="property_type" className={labelClass}>
                Property type <span className="font-normal text-steel">(optional)</span>
              </label>
              <input
                id="property_type"
                className={fieldClass}
                placeholder="SFR, duplex, mixed-use…"
                {...register("property_type")}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="full_name" className={labelClass}>
                Full name
              </label>
              <input
                id="full_name"
                autoComplete="name"
                className={fieldClass}
                {...register("full_name")}
              />
              {errors.full_name ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.full_name.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={fieldClass}
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
                {...register("phone")}
              />
              {errors.phone ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="entity_name" className={labelClass}>
                Entity name <span className="font-normal text-steel">(optional)</span>
              </label>
              <input
                id="entity_name"
                className={fieldClass}
                placeholder="LLC or trust if closing in entity"
                {...register("entity_name")}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="loan_type" className={labelClass}>
                Loan type
              </label>
              <select id="loan_type" className={fieldClass} {...register("loan_type")}>
                {loanTypes.map((t) => (
                  <option key={t} value={t}>
                    {loanTypeLabels[t]}
                  </option>
                ))}
              </select>
              {errors.loan_type ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.loan_type.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="loan_amount" className={labelClass}>
                Loan amount
              </label>
              <input
                id="loan_amount"
                inputMode="decimal"
                className={fieldClass}
                placeholder="Requested amount"
                {...register("loan_amount")}
              />
              {errors.loan_amount ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.loan_amount.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="purchase_price" className={labelClass}>
                Purchase price <span className="font-normal text-steel">(optional)</span>
              </label>
              <input
                id="purchase_price"
                inputMode="decimal"
                className={fieldClass}
                {...register("purchase_price")}
              />
              {errors.purchase_price ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.purchase_price.message}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="estimated_arv" className={labelClass}>
                Estimated ARV <span className="font-normal text-steel">(optional)</span>
              </label>
              <input
                id="estimated_arv"
                inputMode="decimal"
                className={fieldClass}
                {...register("estimated_arv")}
              />
              {errors.estimated_arv ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.estimated_arv.message}</p>
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
                placeholder="Deal context, timing, or structure notes — qualitative only"
                {...register("notes")}
              />
              {errors.notes ? (
                <p className="mt-2 text-[0.875rem] text-red-600">{errors.notes.message}</p>
              ) : null}
            </div>
            <input type="hidden" {...register("attribution_source_id")} />
            <p className="sm:col-span-2 text-[0.8125rem] text-steel">
              Attribution defaults to direct apply. Terms are evaluated deal by deal — no public rate
              tables on this form.
            </p>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-6">
            <p className="text-[0.9375rem] leading-relaxed text-steel">
              {/* PLACEHOLDER — wire to Supabase Storage; metadata only in mock */}
              Upload is mocked. Files stay in this browser session as metadata — you can skip and add
              documents later in the portal.
            </p>
            <div>
              <label htmlFor="default_doc_type" className={labelClass}>
                Document category for next upload
              </label>
              <select
                id="default_doc_type"
                className={fieldClass}
                value={defaultDocType}
                onChange={(e) => setDefaultDocType(e.target.value)}
              >
                {docCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`rounded-[1.75rem] border border-dashed px-6 py-10 text-center transition ${
                dragOver
                  ? "border-green bg-green-mist"
                  : "border-line-strong bg-paper/80"
              }`}
            >
              <p className="text-[1.0625rem] font-medium text-ink">Drag and drop files here</p>
              <p className="mt-2 text-[0.875rem] text-steel">
                Max {formatBytes(MAX_FILE_BYTES)} per file. PDF and common office formats preferred.
              </p>
              <label className="mt-6 inline-flex cursor-pointer">
                <span className="rounded-[var(--radius-control)] bg-white px-5 py-2.5 text-[0.9375rem] font-medium text-charcoal shadow-[inset_0_0_0_1px_var(--line-strong)]">
                  Browse files
                </span>
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files?.length) addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {pendingDocs.length > 0 ? (
              <ul className="divide-y divide-line rounded-[1.5rem] border border-line">
                {pendingDocs.map((doc) => (
                  <li
                    key={doc.localId}
                    className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 text-[0.9375rem]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{doc.file_name}</p>
                      <p className="mt-1 text-[0.8125rem] text-steel">
                        {docCategories.find((c) => c.id === doc.doc_type)?.label ?? doc.doc_type} ·{" "}
                        {formatBytes(doc.file_size_bytes)}
                      </p>
                      {doc.error ? (
                        <p className="mt-1 text-[0.8125rem] text-red-600">{doc.error}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-xl border border-line bg-white px-2 py-1.5 text-[0.8125rem]"
                        value={doc.doc_type}
                        onChange={(e) =>
                          setPendingDocs((prev) =>
                            prev.map((d) =>
                              d.localId === doc.localId ? { ...d, doc_type: e.target.value } : d,
                            ),
                          )
                        }
                        aria-label={`Category for ${doc.file_name}`}
                      >
                        {docCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="text-[0.8125rem] font-medium text-steel hover:text-ink"
                        onClick={() =>
                          setPendingDocs((prev) => prev.filter((d) => d.localId !== doc.localId))
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.875rem] text-steel">No documents attached — skip is allowed.</p>
            )}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <div>
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={goBack}>
                Back
              </Button>
            ) : (
              <Link href="/" className="text-[0.9375rem] font-medium text-steel hover:text-ink">
                Cancel
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {step < 4 ? (
              <Button type="submit">Continue</Button>
            ) : (
              <Button type="submit" shine disabled={isSubmitting}>
                {isSubmitting ? "Submitting…" : "Submit application"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
