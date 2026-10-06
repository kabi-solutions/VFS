"use client";

import type { BorrowerParty } from "@/lib/apply/package";
import { errorClass, fieldClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  idPrefix: string;
  party: BorrowerParty;
  onChange: (next: BorrowerParty) => void;
  hardRequired?: boolean;
  errors?: Partial<Record<"first_name" | "last_name" | "email" | "cell_phone", string>>;
};

export function PartyFields({ idPrefix, party, onChange, hardRequired, errors }: Props) {
  function set<K extends keyof BorrowerParty>(key: K, value: BorrowerParty[K]) {
    onChange({ ...party, [key]: value });
  }

  function setEmp<K extends keyof BorrowerParty["employment"]>(
    key: K,
    value: BorrowerParty["employment"][K],
  ) {
    onChange({ ...party, employment: { ...party.employment, [key]: value } });
  }

  const soft = hardRequired ? "" : " (optional for submit)";

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-first`} className={labelClass}>
          First name{hardRequired ? "" : soft}
        </label>
        <input
          id={`${idPrefix}-first`}
          className={fieldClass}
          value={party.first_name}
          onChange={(e) => set("first_name", e.target.value)}
          autoComplete="given-name"
        />
        {errors?.first_name ? <p className={errorClass}>{errors.first_name}</p> : null}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-middle`} className={labelClass}>
          Middle name <span className="font-normal text-steel">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-middle`}
          className={fieldClass}
          value={party.middle_name}
          onChange={(e) => set("middle_name", e.target.value)}
          autoComplete="additional-name"
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-last`} className={labelClass}>
          Last name{hardRequired ? "" : soft}
        </label>
        <input
          id={`${idPrefix}-last`}
          className={fieldClass}
          value={party.last_name}
          onChange={(e) => set("last_name", e.target.value)}
          autoComplete="family-name"
        />
        {errors?.last_name ? <p className={errorClass}>{errors.last_name}</p> : null}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-marital`} className={labelClass}>
          Marital status{soft}
        </label>
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
        <label htmlFor={`${idPrefix}-email`} className={labelClass}>
          Email{hardRequired ? "" : soft}
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          className={fieldClass}
          value={party.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
        />
        {errors?.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
          Cell phone{hardRequired ? "" : soft}
        </label>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          className={fieldClass}
          value={party.cell_phone}
          onChange={(e) => set("cell_phone", e.target.value)}
          autoComplete="tel"
        />
        {errors?.cell_phone ? <p className={errorClass}>{errors.cell_phone}</p> : null}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-primary`} className={labelClass}>
          Primary residence address{soft}
        </label>
        <input
          id={`${idPrefix}-primary`}
          className={fieldClass}
          value={party.primary_residence_address}
          onChange={(e) => set("primary_residence_address", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-owns`} className={labelClass}>
          Owns primary residence?{soft}
        </label>
        <select
          id={`${idPrefix}-owns`}
          className={fieldClass}
          value={party.owns_primary_residence === null ? "" : party.owns_primary_residence ? "yes" : "no"}
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
        <label htmlFor={`${idPrefix}-years`} className={labelClass}>
          Years at primary residence{soft}
        </label>
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
            className="mt-1"
            checked={party.mailing_same_as_primary}
            onChange={(e) => set("mailing_same_as_primary", e.target.checked)}
          />
          <span>Mailing address same as primary residence</span>
        </label>
      </div>
      {!party.mailing_same_as_primary ? (
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-mailing`} className={labelClass}>
            Mailing address{soft}
          </label>
          <input
            id={`${idPrefix}-mailing`}
            className={fieldClass}
            value={party.mailing_address}
            onChange={(e) => set("mailing_address", e.target.value)}
          />
        </div>
      ) : null}
      <div>
        <label htmlFor={`${idPrefix}-credit`} className={labelClass}>
          Estimated credit score{soft}
        </label>
        <input
          id={`${idPrefix}-credit`}
          className={fieldClass}
          value={party.estimated_credit_score}
          onChange={(e) => set("estimated_credit_score", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-income`} className={labelClass}>
          Estimated annual income{soft}
        </label>
        <input
          id={`${idPrefix}-income`}
          className={fieldClass}
          value={party.estimated_annual_income}
          onChange={(e) => set("estimated_annual_income", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-assets`} className={labelClass}>
          Estimated liquid assets{soft}
        </label>
        <input
          id={`${idPrefix}-assets`}
          className={fieldClass}
          value={party.estimated_liquid_assets}
          onChange={(e) => set("estimated_liquid_assets", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-self`} className={labelClass}>
          Self-employed?{soft}
        </label>
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
        <label htmlFor={`${idPrefix}-employer`} className={labelClass}>
          Employer name{soft}
        </label>
        <input
          id={`${idPrefix}-employer`}
          className={fieldClass}
          value={party.employment.employer_name}
          onChange={(e) => setEmp("employer_name", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-title`} className={labelClass}>
          Position / title{soft}
        </label>
        <input
          id={`${idPrefix}-title`}
          className={fieldClass}
          value={party.employment.position_title}
          onChange={(e) => setEmp("position_title", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`${idPrefix}-emp-phone`} className={labelClass}>
          Employer phone{soft}
        </label>
        <input
          id={`${idPrefix}-emp-phone`}
          className={fieldClass}
          value={party.employment.employer_phone}
          onChange={(e) => setEmp("employer_phone", e.target.value)}
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-emp-addr`} className={labelClass}>
          Employer address{soft}
        </label>
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
