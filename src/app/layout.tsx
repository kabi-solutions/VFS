import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vault Financial Services LLC",
    template: "%s | Vault Financial Services",
  },
  description:
    "Institutional private capital for real estate investors — fix & flip, bridge, ground-up construction, and DSCR lending.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Vault Financial Services LLC",
    description:
      "Institutional private capital for real estate investors — fix & flip, bridge, ground-up construction, and DSCR lending.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault Financial Services LLC",
    description:
      "Institutional private capital for real estate investors — fix & flip, bridge, ground-up construction, and DSCR lending.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-charcoal antialiased">{children}</body>
    </html>
  );
}
