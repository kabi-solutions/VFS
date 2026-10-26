"use client";

import type { ReactNode } from "react";
import { FieldRequirementChip } from "@/components/apply/FieldRequirementChip";
import { errorClass, fieldClass, labelClass } from "@/components/apply/fieldStyles";
import type { BorrowerParty } from "@/lib/apply/package";

type Props = {
  idPrefix: string;
  party: BorrowerParty;
  onChange: (next: BorrowerParty) => void;
  /** Phase 1 contact: first/last/email/phone only. */
  contactOnly?: boolean;
  hardRequired?: boolean;
  errors?: Partial<Record<"first_name" | "last_name" | "email" | "cell_phone", string>>;
  onBlurValidate?: () => void;
};

function Label({
  htmlFor,
  children,
  chip,
}: {
  htmlFor: string;
  children: ReactNode;
  chip?: "required" | "helps";
}) {
  return (
    <label htmlFor={htmlFor} className={labelClass}>
      {children}
      {chip ? <FieldRequirementChip kind={chip} /> : null}
    </label>
  );
}

export function PartyFields({
  idPrefix,
  party,
  onChange,
  contactOnly,
  hardRequired,
  errors,
  onBlurValidate,
}: Props) {
  function set<K extends keyof BorrowerParty>(key: K, value: BorrowerParty[K]) {
    onChange({ ...party, [key]: value });
  }

  function setEmp<K extends keyof BorrowerParty["employment"]>(
    key: K,
    value: BorrowerParty["employment"][K],
  ) {
    onChange({ ...party, employment: { ...party.employment, [key]: value } });
  }

  const reqChip = hardRequired ? ("required" as const) : ("helps" as const);
  const softChip = "helps" as const;

  const contactBlock = (
    <>
      <div>
        <Label htmlFor={`${idPrefix}-first`} chip={reqChip}>
          First name
        </Label>
        <input
          id={`${idPrefix}-first`}
          className={fieldClass}
          value={party.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          onBlur={onBlurValidate}
          autoComplete="given-name"
        />
        {errors?.first_name ? <p className={errorClass}>{errors.first_name}</p> : null}
      </div>
      {!contactOnly ? (
        <div>
          <Label htmlFor={`${idPrefix}-middle`} chip={softChip}>
            Middle name
          </Label>
          <input
            id={`${idPrefix}-middle`}
            className={fieldClass}
            value={party.middle_name}
            onChange={(e) => set("middle_name", e.target.value)}
            autoComplete="additional-name"
          />
        </div>
      ) : null}
      <div>
        <Label htmlFor={`${idPrefix}-last`} chip={reqChip}>
          Last name
        </Label>
        <input
          id={`${idPrefix}-last`}
          className={fieldClass}
          value={party.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          onBlur={onBlurValidate}
          autoComplete="family-name"
        />
        {errors?.last_name ? <p className={errorClass}>{errors.last_name}</p> : null}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-email`} chip={reqChip}>
          Email
        </Label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          className={fieldClass}
          value={party.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={onBlurValidate}
          autoComplete="email"
        />
        {errors?.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-phone`} chip={reqChip}>
          Cell phone
        </Label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          className={fieldClass}
          value={party.cell_phone}
          onChange={(e) => set("cell_phone", e.target.value)}
          onBlur={onBlurValidate}
          autoComplete="tel"
        />
        {errors?.cell_phone ? <p className={errorClass}>{errors.cell_phone}</p> : null}
      </div>
    </>
  );

  if (contactOnly) {
    return <div className="grid gap-6 sm:grid-cols-2">{contactBlock}</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {contactBlock}
      <div>
        <Label htmlFor={`${idPrefix}-marital`} chip={softChip}>
          Marital status
        </Label>
        <select
          id={`${idPrefix}-marital`}
          className={fieldClass}
          value={party.marital_status}
          onChange={(e) => set("marital_status", e.target.value as BorrowerParty["marital_status"])}
        >
          <option value="">Select…</option>
          <option value="married">Married</option>
          <option value="unmarried">Unmarried</option>
          <option value="separated">Separated</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-secondary-phone`} chip={softChip}>
          Secondary phone
        </Label>
        <input
          id={`${idPrefix}-secondary-phone`}
          type="tel"
          className={fieldClass}
          value={party.secondary_phone}
          onChange={(e) => set("secondary_phone", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-primary`} chip={softChip}>
          Primary residence address
        </Label>
        <input
          id={`${idPrefix}-primary`}
          className={fieldClass}
          value={party.primary_residence_address}
          onChange={(e) => set("primary_residence_address", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-owns`} chip={softChip}>
          Owns primary residence?
        </Label>
        <select
          id={`${idPrefix}-owns`}
          className={fieldClass}
          value={
            party.owns_primary_residence === null
              ? ""
              : party.owns_primary_residence
                ? "yes"
                : "no"
          }
          onChange={(e) =>
            set(
              "owns_primary_residence",
              e.target.value === "" ? null : e.target.value === "yes",
            )
          }
        >
          <option value="">Select…</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-years`} chip={softChip}>
          Years at primary residence
        </Label>
        <input
          id={`${idPrefix}-years`}
          className={fieldClass}
          value={party.years_at_primary_residence}
          onChange={(e) => set("years_at_primary_residence", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[0.9375rem] text-charcoal">
          <input
            type="checkbox"
            className="mt-1 min-h-[1.25rem] min-w-[1.25rem]"
            checked={party.mailing_same_as_primary}
            onChange={(e) => set("mailing_same_as_primary", e.target.checked)}
          />
          <span>Mailing address same as primary residence</span>
        </label>
      </div>
      {!party.mailing_same_as_primary ? (
        <div className="sm:col-span-2">
          <Label htmlFor={`${idPrefix}-mailing`} chip={softChip}>
            Mailing address
          </Label>
          <input
            id={`${idPrefix}-mailing`}
            className={fieldClass}
            value={party.mailing_address}
            onChange={(e) => set("mailing_address", e.target.value)}
          />
        </div>
      ) : null}
      <div>
        <Label htmlFor={`${idPrefix}-credit`} chip={softChip}>
          Estimated credit score
        </Label>
        <input
          id={`${idPrefix}-credit`}
          className={fieldClass}
          value={party.estimated_credit_score}
          onChange={(e) => set("estimated_credit_score", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-income`} chip={softChip}>
          Estimated annual income
        </Label>
        <input
          id={`${idPrefix}-income`}
          className={fieldClass}
          value={party.estimated_annual_income}
          onChange={(e) => set("estimated_annual_income", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-assets`} chip={softChip}>
          Estimated liquid assets
        </Label>
        <input
          id={`${idPrefix}-assets`}
          className={fieldClass}
          value={party.estimated_liquid_assets}
          onChange={(e) => set("estimated_liquid_assets", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-self`} chip={softChip}>
          Self-employed?
        </Label>
        <select
          id={`${idPrefix}-self`}
          className={fieldClass}
          value={
            party.employment.self_employed === null
              ? ""
              : party.employment.self_employed
                ? "yes"
                : "no"
          }
          onChange={(e) =>
            setEmp("self_employed", e.target.value === "" ? null : e.target.value === "yes")
          }
        >
          <option value="">Select…</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-employer`} chip={softChip}>
          Employer name
        </Label>
        <input
          id={`${idPrefix}-employer`}
          className={fieldClass}
          value={party.employment.employer_name}
          onChange={(e) => setEmp("employer_name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-title`} chip={softChip}>
          Position / title
        </Label>
        <input
          id={`${idPrefix}-title`}
          className={fieldClass}
          value={party.employment.position_title}
          onChange={(e) => setEmp("position_title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-emp-phone`} chip={softChip}>
          Employer phone
        </Label>
        <input
          id={`${idPrefix}-emp-phone`}
          className={fieldClass}
          value={party.employment.employer_phone}
          onChange={(e) => setEmp("employer_phone", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-emp-addr`} chip={softChip}>
          Employer address
        </Label>
        <input
          id={`${idPrefix}-emp-addr`}
          className={fieldClass}
          value={party.employment.employer_address}
          onChange={(e) => setEmp("employer_address", e.target.value)}
        />
      </div>
    </div>
  );
}
