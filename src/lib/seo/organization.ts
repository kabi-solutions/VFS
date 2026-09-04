import { SITE_NAME, SITE_URL } from "@/lib/seo/site";

/** Organization + WebSite JSON-LD for the marketing homepage. */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: "Vault Financial Services LLC",
    url: SITE_URL,
    /* PLACEHOLDER — confirm logo URL and contact points with Vault */
    logo: `${SITE_URL}/brand/vault-logo.png`,
    description:
      "Institutional private capital for real estate investors — fix and flip, bridge, ground-up construction, and DSCR lending.",
    areaServed: "US",
    knowsAbout: [
      "Private money lending",
      "Hard money loans",
      "Bridge loans",
      "Fix and flip financing",
      "Ground-up construction lending",
      "DSCR loans",
      "Non-QM investment credit",
    ],
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Private real estate credit for investors — apply digitally, track status in the borrower portal.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
