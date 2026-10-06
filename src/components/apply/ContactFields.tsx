"use client";

import type { ContactBlock } from "@/lib/apply/package";
import { fieldClass, labelClass } from "@/components/apply/fieldStyles";

type Props = {
  idPrefix: string;
  title: string;
  contact: ContactBlock;
  onChange: (next: ContactBlock) => void;
  withRelationship?: boolean;
};

export function ContactFields({ idPrefix, title, contact, onChange, withRelationship }: Props) {
  function set<K extends keyof ContactBlock>(key: K, value: ContactBlock[K]) {
    onChange({ ...contact, [key]: value });
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-[1rem] font-semibold text-ink">{title}</legend>
      <p className="text-[0.8125rem] text-steel">Optional for submit — collected for package completeness.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${idPrefix}-name`}
            className={fieldClass}
            value={contact.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-company`} className={labelClass}>
            Company
          </label>
          <input
            id={`${idPrefix}-company`}
            className={fieldClass}
            value={contact.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${idPrefix}-phone`}
            className={fieldClass}
            value={contact.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            className={fieldClass}
            value={contact.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        {withRelationship ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${idPrefix}-rel`} className={labelClass}>
              Relationship
            </label>
            <input
              id={`${idPrefix}-rel`}
              className={fieldClass}
              value={contact.relationship ?? ""}
              onChange={(e) => set("relationship", e.target.value)}
            />
          </div>
        ) : null}
      </div>
    </fieldset>
  );
}
