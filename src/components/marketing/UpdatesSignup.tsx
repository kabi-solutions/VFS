"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

/** Mock capture only — wire to CRM / Supabase later */
export function UpdatesSignup({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const dark = tone === "dark";

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p
        className={`rounded-full px-5 py-4 text-[0.9375rem] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${
          dark ? "bg-white text-ink" : "bg-white text-ink"
        }`}
      >
        You&apos;re on the list. We&apos;ll send updates — not noise.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <label htmlFor="updates-email" className="sr-only">
          Email
        </label>
        <input
          id="updates-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-steel"
        />
        <Button type="submit" className="shrink-0 !px-5 !py-2.5 text-[0.9375rem]">
          Sign me up
        </Button>
      </div>
      <div
        className={`mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] ${
          dark ? "text-white/60" : "text-steel"
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="text-green" aria-hidden>
            ✓
          </span>
          We won&apos;t spam you
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="text-green" aria-hidden>
            ✓
          </span>
          Unsubscribe any time
        </span>
      </div>
    </form>
  );
}
