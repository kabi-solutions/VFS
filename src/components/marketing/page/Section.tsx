import type { ReactNode } from "react";

export function Section({
  children,
  tone = "white",
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  tone?: "white" | "paper" | "mist" | "ink";
  className?: string;
  narrow?: boolean;
}) {
  const tones = {
    white: "bg-white",
    paper: "bg-paper",
    mist: "bg-green-mist",
    ink: "bg-ink text-white",
  } as const;

  return (
    <section className={`${tones[tone]} ${className}`}>
      <div
        className={`mx-auto px-6 py-[var(--spacing-section)] lg:px-8 ${
          narrow ? "max-w-[880px]" : "max-w-[1080px]"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
