"use client";

import type { DeclarationAnswers } from "@/lib/apply/package";
import { fieldClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  declarations: DeclarationAnswers;
  onChange: (next: DeclarationAnswers) => void;
};

const QUESTIONS: Array<[keyof DeclarationAnswers, string]> = [
  ["outstanding_judgments", "Are there any outstanding judgments against you?"],
  ["bankrupt_last_7_years", "Have you been declared bankrupt within the last seven (7) years?"],
  [
    "foreclosure_history",
    "Have you or any entity of which you were/are a principal been in foreclosure?",
  ],
  ["party_to_lawsuit", "Are you a party to a lawsuit?"],
  [
    "delinquent_federal_debt",
    "Are you presently delinquent on any federal debt or other loan / financial obligation?",
  ],
  ["felony_conviction", "Have you ever been convicted of a felony?"],
  [
    "civil_union_or_non_borrowing_spouse",
    "Are you in a civil union / domestic partnership, or do you have a non-borrowing spouse / DBA?",
  ],
  ["us_citizen", "Are you a US citizen?"],
  ["permanent_resident_alien", "Are you a permanent resident alien?"],
  [
    "intend_occupy_primary",
    "Do you intend to occupy the property as your primary residence? (Investor loans require No)",
  ],
];

export function DeclarationsFields({ declarations, onChange }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        Declarations from the Loan Submission Package questionnaire. Soft-required for package
        completeness; submit is still allowed with gaps.
      </p>
      {QUESTIONS.map(([key, label]) => (
        <div key={key}>
          <label className={labelClass}>{label}</label>
          <select
            className={fieldClass}
            value={
              declarations[key] === null ? "" : declarations[key] ? "yes" : "no"
            }
            onChange={(e) =>
              onChange({
                ...declarations,
                [key]: e.target.value === "" ? null : e.target.value === "yes",
              })
            }
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      ))}
    </div>
  );
}
