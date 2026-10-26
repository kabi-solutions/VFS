import type { MetadataRoute } from "next";
import { starterStates } from "@/lib/marketing/states";
import { solutionList } from "@/lib/marketing/solutions";
import { experienceList, strategyList } from "@/lib/config/strategies";
import { SITE_URL } from "@/lib/seo/site";

const staticRoutes = [
  "/",
  "/apply",
  "/contact",
  "/login",
  "/locations",
  "/company/about",
  "/company/leadership",
  "/company/press",
  "/company/careers",
  "/company/community-impact",
  "/capital-partners",
  "/capital-partners/deployment",
  "/capital-partners/apply",
  "/resources",
  "/resources/glossary",
  "/resources/faqs",
  "/resources/case-studies",
  "/resources/tools",
  "/resources/tools/dscr",
  "/resources/tools/fix-flip",
  "/resources/tools/bridge-cash-to-close",
  "/resources/tools/draw-schedule",
  "/screener",
  "/strategies",
  "/resources/guides/how-hard-money-works",
  "/resources/guides/fix-flip-financing-101",
  "/resources/guides/dscr-explained",
  "/trust/licensing",
  "/trust/security",
  "/trust/legal",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/apply" ? 0.9 : 0.7,
  }));

  const solutionEntries: MetadataRoute.Sitemap = solutionList.map((s) => ({
    url: `${SITE_URL}${s.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const stateEntries: MetadataRoute.Sitemap = starterStates.map((state) => ({
    url: `${SITE_URL}/locations/${state.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const strategyEntries: MetadataRoute.Sitemap = [
    ...strategyList.map((s) => ({
      url: `${SITE_URL}/strategies/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...experienceList.map((e) => ({
      url: `${SITE_URL}/strategies/experience/${e.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
  ];

  return [...staticEntries, ...solutionEntries, ...stateEntries, ...strategyEntries];
}
