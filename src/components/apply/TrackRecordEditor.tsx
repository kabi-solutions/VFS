"use client";

import { useState } from "react";
import {
  emptyTrackRow,
  type TrackRecordRow,
} from "@/lib/apply/package";
import { parseTrackRecordFile } from "@/lib/apply/excel";
import { fieldClass, hintClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  rows: TrackRecordRow[];
  onChange: (rows: TrackRecordRow[]) => void;
};

export function TrackRecordEditor({ rows, onChange }: Props) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);

  function updateRow(index: number, patch: Partial<TrackRecordRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploadError(null);
    setUploadNote(null);
    try {
      const parsed = await parseTrackRecordFile(file);
      onChange(parsed);
      setUploadNote(`Imported ${parsed.length} track-record row(s) from ${file.name}.`);
    } catch {
      setUploadError("Could not parse that Excel file. Check column headers and try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[0.9375rem] leading-relaxed text-steel">
          Projects from the last 24 months. Soft-required for private money, bridge, fix &amp; flip,
          ground up, new construction, and DSCR packages. Enter rows below or upload an Excel
          schedule.
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

      {rows.map((row, index) => (
        <div
          key={index}
          className="space-y-4 rounded-[1.5rem] border border-line px-4 py-5 sm:px-5"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.9375rem] font-semibold text-ink">Project {index + 1}</p>
            {rows.length > 1 ? (
              <button
                type="button"
                className="text-[0.8125rem] font-medium text-steel hover:text-ink"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={fieldClass}
                value={row.status}
                onChange={(e) =>
                  updateRow(index, { status: e.target.value as TrackRecordRow["status"] })
                }
              >
                <option value="">Select…</option>
                <option value="current">Current</option>
                <option value="active">Active</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Project type</label>
              <select
                className={fieldClass}
                value={row.project_type}
                onChange={(e) =>
                  updateRow(index, {
                    project_type: e.target.value as TrackRecordRow["project_type"],
                  })
                }
              >
                <option value="">Select…</option>
                <option value="fix_flip">Fix &amp; Flip</option>
                <option value="fix_hold">Fix &amp; Hold</option>
                <option value="ground_up">Ground Up</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Titled owner</label>
              <input
                className={fieldClass}
                value={row.titled_owner}
                onChange={(e) => updateRow(index, { titled_owner: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Property address</label>
              <input
                className={fieldClass}
                value={row.property_address}
                onChange={(e) => updateRow(index, { property_address: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                className={fieldClass}
                value={row.city}
                onChange={(e) => updateRow(index, { city: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                className={fieldClass}
                value={row.state}
                onChange={(e) => updateRow(index, { state: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>ZIP</label>
              <input
                className={fieldClass}
                value={row.zip}
                onChange={(e) => updateRow(index, { zip: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Purchase date</label>
              <input
                className={fieldClass}
                value={row.purchase_date}
                onChange={(e) => updateRow(index, { purchase_date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Purchase price</label>
              <input
                className={fieldClass}
                value={row.purchase_price}
                onChange={(e) => updateRow(index, { purchase_price: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Renovation costs / rehab cost</label>
              <input
                className={fieldClass}
                value={row.renovation_costs}
                onChange={(e) => updateRow(index, { renovation_costs: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Disposition date</label>
              <input
                className={fieldClass}
                value={row.disposition_date}
                onChange={(e) => updateRow(index, { disposition_date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Disposition price</label>
              <input
                className={fieldClass}
                value={row.disposition_price}
                onChange={(e) => updateRow(index, { disposition_price: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="text-[0.9375rem] font-medium text-green hover:text-ink"
        onClick={() => onChange([...rows, emptyTrackRow()])}
      >
        + Add project
      </button>
    </div>
  );
}
