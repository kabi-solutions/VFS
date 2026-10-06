"use client";

import { useState } from "react";
import { emptySreoRow, type SreoPropertyRow } from "@/lib/apply/package";
import { parseSreoFile } from "@/lib/apply/excel";
import { fieldClass, hintClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  rows: SreoPropertyRow[];
  onChange: (rows: SreoPropertyRow[]) => void;
};

const CORE_FIELDS: Array<[keyof SreoPropertyRow, string]> = [
  ["street_number", "Street number"],
  ["street_name", "Street name"],
  ["unit_count", "Unit count"],
  ["unit_apt", "Unit / apt #"],
  ["city", "City"],
  ["state", "State"],
  ["zip", "ZIP"],
  ["property_type", "Property type"],
  ["units_occupied", "Units occupied"],
  ["lease_start", "Lease start"],
  ["lease_end", "Lease end"],
  ["purchase_date", "Purchase date"],
  ["purchase_price", "Purchase price"],
  ["capital_improvements", "Capital improvements"],
  ["estimated_as_is_value", "Estimated as-is value"],
  ["total_debt_payoff", "Total debt payoff"],
  ["monthly_gross_rent", "Monthly gross rent"],
  ["other_monthly_income", "Other monthly income"],
  ["annual_property_mgmt_fee", "Annual property mgmt fee"],
  ["annual_taxes", "Annual taxes"],
  ["annual_insurance", "Annual insurance"],
  ["annual_hoa", "Annual HOA"],
  ["annual_capex", "Annual CapEx"],
  ["annual_vacancy_cost", "Annual vacancy cost"],
  ["other_annual_owner_expenses", "Other annual owner expenses"],
  ["annual_utilities", "Annual utilities"],
  ["annual_repair_maintenance", "Annual repair & maintenance"],
];

export function SreoEditor({ rows, onChange }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(0);

  function updateRow(index: number, key: keyof SreoPropertyRow, value: string) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploadError(null);
    setUploadNote(null);
    try {
      const parsed = await parseSreoFile(file);
      onChange(parsed);
      setExpanded(0);
      setUploadNote(`Imported ${parsed.length} SREO property row(s) from ${file.name}.`);
    } catch {
      setUploadError("Could not parse that Excel file. Check column headers and try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.9375rem] leading-relaxed text-steel">
          Schedule of Real Estate Owned. Soft-required for private money, bridge, fix &amp; flip,
          ground up, new construction, DSCR, and any cross-collateralized file. Enter rows or upload
          Excel.
        </p>
        <label className="mt-4 inline-flex cursor-pointer">
          <span className="rounded-[var(--radius-control)] bg-white px-5 py-2.5 text-[0.9375rem] font-medium text-charcoal shadow-[inset_0_0_0_1px_var(--line-strong)]">
            Upload Excel
          </span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            className="sr-only"
            onChange={(e) => {
              void onUpload(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </label>
        {uploadNote ? <p className={`${hintClass} text-green`}>{uploadNote}</p> : null}
        {uploadError ? <p className="mt-2 text-[0.875rem] text-red-600">{uploadError}</p> : null}
      </div>

      {rows.map((row, index) => {
        const open = expanded === index;
        const summary =
          [row.street_number, row.street_name, row.city, row.state].filter(Boolean).join(" ") ||
          `Property ${index + 1}`;
        return (
          <div key={index} className="rounded-[1.5rem] border border-line">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
              <button
                type="button"
                className="text-left text-[0.9375rem] font-semibold text-ink"
                onClick={() => setExpanded(open ? -1 : index)}
              >
                {summary}
              </button>
              <div className="flex items-center gap-3">
                {rows.length > 1 ? (
                  <button
                    type="button"
                    className="text-[0.8125rem] font-medium text-steel hover:text-ink"
                    onClick={() => onChange(rows.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                ) : null}
                <button
                  type="button"
                  className="text-[0.8125rem] font-medium text-green"
                  onClick={() => setExpanded(open ? -1 : index)}
                >
                  {open ? "Collapse" : "Edit"}
                </button>
              </div>
            </div>
            {open ? (
              <div className="grid gap-4 border-t border-line px-4 py-5 sm:grid-cols-2 sm:px-5">
                {CORE_FIELDS.map(([key, label]) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input
                      className={fieldClass}
                      value={row[key]}
                      onChange={(e) => updateRow(index, key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        className="text-[0.9375rem] font-medium text-green hover:text-ink"
        onClick={() => {
          onChange([...rows, emptySreoRow()]);
          setExpanded(rows.length);
        }}
      >
        + Add property
      </button>
    </div>
  );
}
