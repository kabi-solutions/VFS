import { Button } from "@/components/ui/Button";
import {
  CTA_DISCLAIMER,
  CTA_PRIMARY,
  CTA_SECONDARY,
  CTA_TERTIARY,
} from "@/lib/config/ctas";

type CtaGroupProps = {
  primaryHref?: string;
  primaryLabel?: string;
  showSecondary?: boolean;
  showTertiary?: boolean;
  tertiary?: boolean;
  className?: string;
  align?: "left" | "center";
  showDisclaimer?: boolean;
};

export function CtaGroup({
  primaryHref = CTA_PRIMARY.href,
  primaryLabel = CTA_PRIMARY.label,
  showSecondary = true,
  showTertiary = false,
  tertiary,
  className = "",
  align = "left",
  showDisclaimer = false,
}: CtaGroupProps) {
  const includeTertiary = tertiary ?? showTertiary;

  return (
    <div className={className}>
      <div
        className={`flex flex-wrap items-center gap-3 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <Button href={primaryHref} shine>
          {primaryLabel}
        </Button>
        {showSecondary ? (
          <Button href={CTA_SECONDARY.href} variant="secondary">
            {CTA_SECONDARY.label}
          </Button>
        ) : null}
        {includeTertiary ? (
          <Button href={CTA_TERTIARY.href} variant="ghost">
            {CTA_TERTIARY.label}
          </Button>
        ) : null}
      </div>
      {showDisclaimer ? (
        <p
          className={`mt-3 text-[0.8125rem] text-steel ${
            align === "center" ? "text-center" : ""
          }`}
        >
          {CTA_DISCLAIMER}
        </p>
      ) : null}
    </div>
  );
}
