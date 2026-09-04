import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "on-dark" | "green-on-dark";

const variants: Record<Variant, string> = {
  primary: "bg-green text-white hover:bg-green-hover",
  secondary:
    "bg-transparent text-charcoal shadow-[inset_0_0_0_1px_var(--line-strong)] hover:bg-white",
  ghost: "bg-transparent text-charcoal hover:bg-black/[0.04]",
  "on-dark": "bg-white text-ink hover:bg-paper",
  "green-on-dark": "bg-green text-white hover:bg-green-hover",
};

type Common = {
  children: ReactNode;
  variant?: Variant;
  /** Left-to-right shine sweep — use on primary Apply CTAs */
  shine?: boolean;
  className?: string;
};

type ButtonAsButton = Common &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = Common & {
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

export function Button({
  children,
  variant = "primary",
  shine = false,
  className = "",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 py-3 text-[1.0625rem] font-medium tracking-[-0.016em] transition-colors duration-150 disabled:opacity-50",
    variants[variant],
    shine ? "btn-shine" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = <span>{children}</span>;

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
