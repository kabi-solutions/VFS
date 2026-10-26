"use client";

import {
  CONSTRUCTION_LEVEL_LABELS,
  needsContractorPackage,
  type ConstructionLevel,
  type ContractorPackage,
} from "@/lib/apply/package";
import { fieldClass, hintClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  contractor: ContractorPackage;
  onChange: (next: ContractorPackage) => void;
};

const LEVELS = Object.keys(CONSTRUCTION_LEVEL_LABELS) as ConstructionLevel[];

export function ContractorFields({ contractor, onChange }: Props) {
  function set<K extends keyof ContractorPackage>(key: K, value: ContractorPackage[K]) {
    onChange({ ...contractor, [key]: value });
  }

  function toggleLevel(level: ConstructionLevel) {
    const has = contractor.planned_project_levels.includes(level);
    set(
      "planned_project_levels",
      has
        ? contractor.planned_project_levels.filter((l) => l !== level)
        : [...contractor.planned_project_levels, level],
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-[0.9375rem] leading-relaxed text-steel">
        Owner Builder / General Contractor Profile (Vault F-008) and CFSI rehab contractor package
        when rehab financing applies. Choose one role — owner-builder and hired GC are mutually
        exclusive. Upload supporting docs on the Documents step.
      </p>

      <div>
        <label className={labelClass}>Role for this project</label>
        <select
          className={fieldClass}
          value={contractor.role}
          onChange={(e) => set("role", e.target.value as ContractorPackage["role"])}
        >
          <option value="">Select…</option>
          <option value="owner_builder">Owner-builder (borrower / sponsor acting as builder)</option>
          <option value="general_contractor">General contractor (hired GC)</option>
        </select>
        <p className={hintClass}>
          Owner-builder completes profile + project levels. GC completes business profile, W-9, and
          driver&apos;s license docs.
        </p>
      </div>

      {contractor.role === "owner_builder" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Owner-builder name</label>
            <input
              className={fieldClass}
              value={contractor.owner_builder_name}
              onChange={(e) => set("owner_builder_name", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Street address</label>
            <input
              className={fieldClass}
              value={contractor.owner_builder_street}
              onChange={(e) => set("owner_builder_street", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>City, state, ZIP</label>
            <input
              className={fieldClass}
              value={contractor.owner_builder_city_state_zip}
              onChange={(e) => set("owner_builder_city_state_zip", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <p className={labelClass}>Types of projects planned in the next 24 months</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {LEVELS.map((level) => (
                <label key={level} className="flex items-start gap-2 text-[0.9375rem] text-charcoal">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={contractor.planned_project_levels.includes(level)}
                    onChange={() => toggleLevel(level)}
                  />
                  <span>{CONSTRUCTION_LEVEL_LABELS[level]}</span>
                </label>
              ))}
            </div>
            {contractor.planned_project_levels.includes("5") ? (
              <p className={`${hintClass} text-green`}>
                Level 5 is ground-up construction. Loan type auto-switches to Ground-Up
                Construction (New Construction kept if already selected).
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {contractor.role === "general_contractor" ? (
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
            <input className={fieldClass} value={contractor.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input className={fieldClass} value={contractor.state} onChange={(e) => set("state", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>ZIP</label>
            <input className={fieldClass} value={contractor.zip} onChange={(e) => set("zip", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Business type</label>
            <select
              className={fieldClass}
              value={contractor.business_type}
              onChange={(e) => set("business_type", e.target.value as ContractorPackage["business_type"])}
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
            <input className={fieldClass} value={contractor.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={fieldClass} type="email" value={contractor.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>TIN / SSN</label>
            <input className={fieldClass} value={contractor.tin_ssn} onChange={(e) => set("tin_ssn", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Years in business</label>
            <input className={fieldClass} value={contractor.years_in_business} onChange={(e) => set("years_in_business", e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-3 rounded-[1.5rem] border border-line px-4 py-4">
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
        </div>
      ) : null}

      {contractor.role ? (
        <>
          <div className="space-y-3 rounded-[1.5rem] border border-line px-4 py-4">
            <p className="text-[0.9375rem] font-semibold text-ink">Completed / active projects</p>
            {contractor.completed_projects.map((project, i) => (
              <div key={i} className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ["year", "Year"],
                    ["status", "Status"],
                    ["project_address", "Project address"],
                    ["project_cost", "Project cost"],
                    ["project_scope", "Project scope"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className={key === "project_address" ? "sm:col-span-2" : undefined}>
                    <label className={labelClass}>{label}</label>
                    <input
                      className={fieldClass}
                      value={project[key]}
                      onChange={(e) => {
                        const completed_projects = contractor.completed_projects.map((proj, idx) =>
                          idx === i ? { ...proj, [key]: e.target.value } : proj,
                        );
                        set("completed_projects", completed_projects);
                      }}
                      placeholder={key === "status" ? "Completed / Active" : undefined}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-start gap-3 sm:col-span-2 text-[0.9375rem] text-charcoal">
              <input
                type="checkbox"
                className="mt-1"
                checked={contractor.no_contractor_license}
                onChange={(e) => set("no_contractor_license", e.target.checked)}
              />
              <span>I do not have a contractor&apos;s license</span>
            </label>
            {!contractor.no_contractor_license ? (
              <>
                {(
                  [
                    ["license_state", "License state"],
                    ["license_number", "License number"],
                    ["license_type", "License type"],
                    ["license_status", "License status"],
                    ["license_issue_date", "License issue date"],
                    ["license_expiration_date", "License expiration"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input
                      className={fieldClass}
                      value={contractor[key]}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  </div>
                ))}
              </>
            ) : null}
            <div>
              <label className={labelClass}>Have employees? (workers&apos; comp)</label>
              <select
                className={fieldClass}
                value={
                  contractor.has_employees === null ? "" : contractor.has_employees ? "yes" : "no"
                }
                onChange={(e) =>
                  set("has_employees", e.target.value === "" ? null : e.target.value === "yes")
                }
              >
                <option value="">Select…</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Project name (CFSI submission)</label>
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

          <label className="flex items-start gap-3 rounded-[1.5rem] bg-green-mist px-4 py-4 text-[0.9375rem] text-charcoal">
            <input
              type="checkbox"
              className="mt-1"
              checked={contractor.release_authorized}
              onChange={(e) => set("release_authorized", e.target.checked)}
            />
            <span>
              I authorize release of contractor / owner-builder information for credit and vendor
              verification on this file.
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
        </>
      ) : null}
    </div>
  );
}

export { needsContractorPackage };
