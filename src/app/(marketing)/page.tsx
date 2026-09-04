import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@/lib/seo/organization";

export const metadata: Metadata = {
  title: {
    absolute: "Vault Financial Services | Private Capital for Real Estate Investors",
  },
  description:
    "Institutional private capital for real estate investors. Fix & flip, bridge, ground-up construction, and DSCR lending with a gated lifecycle and borrower portal.",
  openGraph: {
    title: "Vault Financial Services | Private Capital for Real Estate Investors",
    description:
      "Institutional private capital for real estate investors. Fix & flip, bridge, ground-up, and DSCR with audited status from application through funding.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={getOrganizationJsonLd()} />
      <JsonLd data={getWebSiteJsonLd()} />
      <HomePage />
    </>
  );
}
