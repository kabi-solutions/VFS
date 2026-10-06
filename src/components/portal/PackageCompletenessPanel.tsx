"use client";

import {
  displayName,
  getPackageCompleteness,
  type ApplicationPackage,
} from "@/lib/apply/package";
import { docTypeLabels } from "@/lib/mock/status-labels";
import type { LoanApplication } from "@/lib/types/database";

type Props = {
  app: LoanApplication;
  docTypes?: string[];
};

function summaryBits(pkg: ApplicationPackage | null): Array<{ label: string; value: string }> {
  if (!pkg) return [{ label: "Package", value: "Not submitted yet" }];
  const bits: Array<{ label: string; value: string }> = [
    {
      label: "Borrower",
      value: displayName(pkg.borrower) || "—",
    },
    {
      label: "Co-borrower",
      value: pkg.has_co_borrower
        ? displayName(pkg.co_borrower ?? { first_name: "", middle_name: "", last_name: "" }) ||
          "Listed"
        : "None",
    },
    {
      label: "Business purpose",
      value: pkg.business_purpose_attested ? "Attested" : "Missing",
    },
    {
      label: "Vesting",
      value:
        pkg.vesting.vesting_in === "entity"
          ? pkg.vesting.entity_name || "Entity"
          : pkg.vesting.vesting_in === "individual"
            ? "Individual"
            : "—",
    },
    {
      label: "Track record rows",
      value: String(pkg.track_record.filter((r) => r.property_address.trim()).length),
    },
    {
      label: "SREO rows",
      value: String(
        pkg.sreo.filter((r) => r.street_name.trim() || r.street_number.trim()).length,
      ),
    },
  ];
  if (pkg.contractor?.business_entity_name) {
    bits.push({ label: "Contractor", value: pkg.contractor.business_entity_name });
  }
  return bits;
}

export function PackageCompletenessPanel({ app, docTypes = [] }: Props) {
  const completeness = getPackageCompleteness(app.package, app.loan_type, docTypes);
  const missing = completeness.missing;
  const grouped = missing.reduce<Record<string, typeof missing>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});
  const bits = summaryBits(app.package);

  return (
    <section className="mt-10 rounded-2xl bg-white p-5 ring-1 ring-black/[0.04] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[1.125rem] font-semibold tracking-[-0.02em] text-ink">
            Package completeness
          </h2>
          <p className="mt-2 max-w-[40rem] text-[0.9375rem] leading-relaxed text-steel">
            Soft checklist for follow-up. Files can submit without every item; missing pieces stay
            visible here until the package is complete.
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1.5 text-[0.8125rem] font-semibold ${
            app.package_complete || missing.length === 0
              ? "bg-green-soft text-green"
              : "bg-paper text-charcoal"
          }`}
        >
          {app.package_complete || missing.length === 0
            ? "Complete"
            : `${missing.length} missing · ~${completeness.percent}%`}
        </span>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bits.map((bit) => (
          <div key={bit.label} className="rounded-xl bg-paper/80 px-3 py-3">
            <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-steel">
              {bit.label}
            </dt>
            <dd className="mt-1 text-[0.9375rem] font-medium text-ink">{bit.value}</dd>
          </div>
        ))}
      </dl>

      {missing.length === 0 ? (
        <p className="mt-6 text-[0.9375rem] text-green">
          No outstanding soft-required package items for this loan type.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {Object.entries(grouped).map(([section, items]) => (
            <div key={section}>
              <p className="text-[0.875rem] font-semibold text-ink">{section}</p>
              <ul className="mt-2 space-y-1.5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-2 text-[0.9375rem] text-charcoal">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-steel/50" aria-hidden />
                    <span>
                      {item.id.startsWith("doc.")
                        ? docTypeLabels[item.id.replace("doc.", "")] ?? item.label
                        : item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
