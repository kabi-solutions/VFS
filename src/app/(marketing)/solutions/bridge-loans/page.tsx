import type { Metadata } from "next";
import { SolutionPage } from "@/components/marketing/SolutionPage";
import { solutions } from "@/lib/marketing/solutions";

const s = solutions["bridge-loans"];

export const metadata: Metadata = {
  title: s.name,
  description: s.description,
};

export default function Page() {
  return <SolutionPage slug="bridge-loans" />;
}
