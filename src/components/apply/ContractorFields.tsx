"use client";

import type { ContractorPackage } from "@/lib/apply/package";
import { fieldClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  contractor: ContractorPackage;
  onChange: (next: ContractorPackage) => void;
};

export function ContractorFields({ contractor, onChange }: Props) {
  function set<K extends keyof ContractorPackage>(key: K, value: ContractorPackage[K]) {
    onChange({ ...contractor, [key]: value });
  }

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        CFSI rehab / contractor package — soft-required when requesting rehab financing, or for fix
        &amp; flip, ground up, and new construction. Upload supporting docs on the Documents step.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Business entity name</label>
          <input
            className={fieldClass}
            value={contractor.business_entity_name}
            onChange={(e) => set("business_entity_name", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Street address</label>
          <input
            className={fieldClass}
            value={contractor.street_address}
            onChange={(e) => set("street_address", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input
            className={fieldClass}
            value={contractor.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>State</label>
          <input
            className={fieldClass}
            value={contractor.state}
            onChange={(e) => set("state", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>ZIP</label>
          <input
            className={fieldClass}
            value={contractor.zip}
            onChange={(e) => set("zip", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Business type</label>
          <select
            className={fieldClass}
            value={contractor.business_type}
            onChange={(e) =>
              set("business_type", e.target.value as ContractorPackage["business_type"])
            }
          >
            <option value="">Select…</option>
            <option value="sole_proprietor">Sole proprietor</option>
            <option value="partnership">Partnership</option>
            <option value="corporation">Corporation</option>
            <option value="limited_liability">Limited liability</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            className={fieldClass}
            value={contractor.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            className={fieldClass}
            type="email"
            value={contractor.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>TIN / SSN</label>
          <input
            className={fieldClass}
            value={contractor.tin_ssn}
            onChange={(e) => set("tin_ssn", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Years in business</label>
          <input
            className={fieldClass}
            value={contractor.years_in_business}
            onChange={(e) => set("years_in_business", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License state</label>
          <input
            className={fieldClass}
            value={contractor.license_state}
            onChange={(e) => set("license_state", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License number</label>
          <input
            className={fieldClass}
            value={contractor.license_number}
            onChange={(e) => set("license_number", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License type</label>
          <input
            className={fieldClass}
            value={contractor.license_type}
            onChange={(e) => set("license_type", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License status</label>
          <input
            className={fieldClass}
            value={contractor.license_status}
            onChange={(e) => set("license_status", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License issue date</label>
          <input
            className={fieldClass}
            value={contractor.license_issue_date}
            onChange={(e) => set("license_issue_date", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>License expiration</label>
          <input
            className={fieldClass}
            value={contractor.license_expiration_date}
            onChange={(e) => set("license_expiration_date", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Project name</label>
          <input
            className={fieldClass}
            value={contractor.project_name}
            onChange={(e) => set("project_name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Secondary contact name</label>
          <input
            className={fieldClass}
            value={contractor.project_secondary_contact_name}
            onChange={(e) => set("project_secondary_contact_name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Secondary contact email</label>
          <input
            className={fieldClass}
            value={contractor.project_secondary_contact_email}
            onChange={(e) => set("project_secondary_contact_email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Secondary contact phone</label>
          <input
            className={fieldClass}
            value={contractor.project_secondary_contact_phone}
            onChange={(e) => set("project_secondary_contact_phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Final budget</label>
          <input
            className={fieldClass}
            value={contractor.final_budget}
            onChange={(e) => set("final_budget", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-[1.5rem] border border-line px-4 py-4">
        <p className="text-[0.9375rem] font-semibold text-ink">Owners</p>
        {contractor.owners.map((owner, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Owner name</label>
              <input
                className={fieldClass}
                value={owner.name}
                onChange={(e) => {
                  const owners = contractor.owners.map((o, idx) =>
                    idx === i ? { ...o, name: e.target.value } : o,
                  );
                  set("owners", owners);
                }}
              />
            </div>
            <div>
              <label className={labelClass}>Ownership %</label>
              <input
                className={fieldClass}
                value={owner.ownership_percent}
                onChange={(e) => {
                  const owners = contractor.owners.map((o, idx) =>
                    idx === i ? { ...o, ownership_percent: e.target.value } : o,
                  );
                  set("owners", owners);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 rounded-[1.5rem] bg-green-mist px-4 py-4 text-[0.9375rem] text-charcoal">
        <input
          type="checkbox"
          className="mt-1"
          checked={contractor.release_authorized}
          onChange={(e) => set("release_authorized", e.target.checked)}
        />
        <span>
          I authorize release of contractor information for credit / vendor verification on this
          file.
        </span>
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Print name</label>
          <input
            className={fieldClass}
            value={contractor.release_print_name}
            onChange={(e) => set("release_print_name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={fieldClass}
            value={contractor.release_title}
            onChange={(e) => set("release_title", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input
            className={fieldClass}
            value={contractor.release_date}
            onChange={(e) => set("release_date", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export function needsContractorPackage(
  loanType: string,
  requestingRehab: boolean | null,
): boolean {
  return (
    requestingRehab === true ||
    loanType === "rehab_fix_flip" ||
    loanType === "ground_up" ||
    loanType === "new_construction"
  );
}
