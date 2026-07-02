import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { RulesExplorer } from "@/components/site/rules-explorer";
import { RULES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Rules & Guidelines",
  description: "Search the Simola Estate conduct rules, building rules, environmental rules and architectural guidelines.",
};

export default function RulesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Estate governance"
        title="Rules & Guidelines"
        description="Search and browse the estate's conduct, building, environmental and architectural rules. Official PDFs are available in the Document Library."
      />
      <section className="container py-12">
        <RulesExplorer sections={RULES} />
      </section>
    </>
  );
}
