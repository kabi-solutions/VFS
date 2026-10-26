"use client";

import { useState } from "react";
import {
  CONSTRUCTION_LEVEL_LABELS,
  emptyConstructionBudgetLine,
  type ConstructionBudgetPackage,
  type ConstructionLevel,
  type FinishLevel,
} from "@/lib/apply/package";
import { parseConstructionBudgetFile } from "@/lib/apply/excel";
import { fieldClass, hintClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  budget: ConstructionBudgetPackage;
  onChange: (next: ConstructionBudgetPackage) => void;
};

const LEVELS = Object.keys(CONSTRUCTION_LEVEL_LABELS) as ConstructionLevel[];

export function ConstructionBudgetEditor({ budget, onChange }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [showAllLines, setShowAllLines] = useState(false);

  function set<K extends keyof ConstructionBudgetPackage>(
    key: K,
    value: ConstructionBudgetPackage[K],
  ) {
    onChange({ ...budget, [key]: value });
  }

  function updateLine(
    index: number,
    patch: Partial<ConstructionBudgetPackage["line_items"][number]>,
  ) {
    onChange({
      ...budget,
      line_items: budget.line_items.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    });
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploadError(null);
    setUploadNote(null);
    try {
      const parsed = await parseConstructionBudgetFile(file);
      onChange({
        ...budget,
        ...parsed.meta,
        line_items: parsed.line_items.length ? parsed.line_items : budget.line_items,
      });
      setUploadNote(
        `Imported ${parsed.line_items.filter((l) => l.budget_amount.trim()).length} budget line(s) from ${file.name}.`,
      );
    } catch {
      setUploadError(
        "Could not parse that Construction Budget Template. Use the Vault Excel template or a sheet with Line Item / Budget Amount columns.",
      );
    }
  }

  const visibleLines = showAllLines ? budget.line_items : budget.line_items.slice(0, 12);
  const filledCount = budget.line_items.filter((l) => {
    const n = Number(String(l.budget_amount).replace(/,/g, ""));
    return !Number.isNaN(n) && n > 0;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.9375rem] leading-relaxed text-steel">
          Vault Construction Budget Template (F-028). Soft-required for rehab financing, fix &amp;
          flip, ground up, and new construction. Enter line items below or upload the Excel
          template.
        </p>
        <label className="mt-4 inline-flex cursor-pointer">
          <span className="rounded-[var(--radius-control)] bg-white px-5 py-2.5 text-[0.9375rem] font-medium text-charcoal shadow-[inset_0_0_0_1px_var(--line-strong)]">
            Upload Construction Budget Excel
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Construction level</label>
          <select
            className={fieldClass}
            value={budget.construction_level}
            onChange={(e) => set("construction_level", e.target.value as ConstructionLevel | "")}
          >
            <option value="">Select…</option>
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {CONSTRUCTION_LEVEL_LABELS[level]}
              </option>
            ))}
          </select>
          {budget.construction_level === "5" ? (
            <p className={`${hintClass} text-green`}>
              Level 5 is ground-up construction. Loan type auto-switches to Ground-Up
              Construction (New Construction kept if already selected).
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass}>Finish level</label>
          <select
            className={fieldClass}
            value={budget.finish_level}
            onChange={(e) => set("finish_level", e.target.value as FinishLevel | "")}
          >
            <option value="">Select…</option>
            <option value="basic">Basic</option>
            <option value="mid_range">Mid range</option>
            <option value="high_end">High end</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Project duration (months)</label>
          <input
            className={fieldClass}
            value={budget.project_duration_months}
            onChange={(e) => set("project_duration_months", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Permits required?</label>
          <select
            className={fieldClass}
            value={budget.permits_required === null ? "" : budget.permits_required ? "yes" : "no"}
            onChange={(e) =>
              set("permits_required", e.target.value === "" ? null : e.target.value === "yes")
            }
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {budget.permits_required ? (
          <>
            <div>
              <label className={labelClass}>Permits already issued?</label>
              <select
                className={fieldClass}
                value={budget.permits_issued === null ? "" : budget.permits_issued ? "yes" : "no"}
                onChange={(e) =>
                  set("permits_issued", e.target.value === "" ? null : e.target.value === "yes")
                }
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            {budget.permits_issued === false ? (
              <div>
                <label className={labelClass}>Months to obtain permits</label>
                <input
                  className={fieldClass}
                  value={budget.permits_obtain_months}
                  onChange={(e) => set("permits_obtain_months", e.target.value)}
                />
              </div>
            ) : null}
          </>
        ) : null}
        <div>
          <label className={labelClass}>Adding square footage?</label>
          <select
            className={fieldClass}
            value={
              budget.adding_square_footage === null
                ? ""
                : budget.adding_square_footage
                  ? "yes"
                  : "no"
            }
            onChange={(e) =>
              set("adding_square_footage", e.target.value === "" ? null : e.target.value === "yes")
            }
          >
            <option value="">Select…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {budget.adding_square_footage ? (
          <div>
            <label className={labelClass}>Expansion type</label>
            <input
              className={fieldClass}
              value={budget.expansion_type}
              onChange={(e) => set("expansion_type", e.target.value)}
              placeholder="e.g. rear addition, ADU"
            />
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <label className={labelClass}>Renovation description / scope</label>
          <textarea
            className={`${fieldClass} resize-y`}
            rows={4}
            value={budget.renovation_description}
            onChange={(e) => set("renovation_description", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.9375rem] font-semibold text-ink">
            Budget line items · {filledCount} with amounts
          </p>
          <button
            type="button"
            className="text-[0.8125rem] font-medium text-green hover:text-ink"
            onClick={() => setShowAllLines((v) => !v)}
          >
            {showAllLines ? "Show fewer lines" : `Show all ${budget.line_items.length} lines`}
          </button>
        </div>
        {visibleLines.map((line, index) => (
          <div
            key={`${line.line_item}-${index}`}
            className="grid gap-3 rounded-[1.25rem] border border-line px-3 py-3 sm:grid-cols-[minmax(0,1.4fr)_8rem_minmax(0,1fr)]"
          >
            <div>
              <label className={labelClass}>Line item</label>
              <input
                className={fieldClass}
                value={line.line_item}
                onChange={(e) => updateLine(index, { line_item: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Amount</label>
              <input
                className={fieldClass}
                inputMode="decimal"
                value={line.budget_amount}
                onChange={(e) => updateLine(index, { budget_amount: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                className={fieldClass}
                value={line.description}
                onChange={(e) => updateLine(index, { description: e.target.value })}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="text-[0.9375rem] font-medium text-green hover:text-ink"
          onClick={() =>
            onChange({
              ...budget,
              line_items: [...budget.line_items, emptyConstructionBudgetLine("Open")],
            })
          }
        >
          + Add custom line
        </button>
      </div>
    </div>
  );
}
