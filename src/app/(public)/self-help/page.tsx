import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { SelfHelpExplorer } from "@/components/site/self-help-explorer";
import { getKnowledgeArticles } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Self Help Centre",
  description: "Helpful guides for water, electricity, fibre, security, waste and biolytic systems at Simola Estate.",
};

export default async function SelfHelpPage() {
  const articles = await getKnowledgeArticles();
  return (
    <>
      <PageHeader
        eyebrow="Knowledge base"
        title="Self Help Centre"
        description="Step-by-step guides for everyday estate services — find answers fast and resolve common issues yourself."
      />
      <section className="container py-12">
        <SelfHelpExplorer articles={articles} />
      </section>
    </>
  );
}
