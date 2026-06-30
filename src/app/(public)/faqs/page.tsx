import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { FaqExplorer } from "@/components/site/faq-explorer";
import { getFaqs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to frequently asked questions about security, building, pets, refuse and access at Simola Estate.",
};

export default function FaqsPage() {
  const faqs = getFaqs();
  return (
    <>
      <PageHeader
        eyebrow="Help & answers"
        title="Frequently Asked Questions"
        description="Find quick answers about security, building, pets, refuse and estate access."
      />
      <section className="container max-w-4xl py-12">
        <FaqExplorer faqs={faqs} />
      </section>
    </>
  );
}
