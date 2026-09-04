/** Canonical marketing origin for sitemap, robots, and JSON-LD. */
/* PLACEHOLDER — replace with production domain when Vault confirms */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://www.vaultfinancial.example";

export const SITE_NAME = "Vault Financial Services";
