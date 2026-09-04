import type { Metadata } from "next";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { solutions } from "@/lib/marketing/solutions";

const s = solutions["rehab-fix-flip"];

export const metadata: Metadata = {
  title: s.name,
  description: s.description,
};

export default function Page() {
  return <SolutionPage slug="rehab-fix-flip" />;
}
