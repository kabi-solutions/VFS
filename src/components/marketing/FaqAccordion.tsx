"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div className="mt-2 divide-y divide-line">
      {items.map((item, index) => {
        const open = openId === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-[1.0625rem] font-semibold tracking-[-0.02em] text-ink">
                  {item.question}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    open ? "bg-green text-white" : "bg-paper text-steel"
                  }`}
                  aria-hidden
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-5"
            >
              <p className="body-md max-w-xl pr-10">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
