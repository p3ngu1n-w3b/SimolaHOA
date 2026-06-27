import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { DocumentExplorer } from "@/components/site/document-explorer";
import { getDocuments } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Forms & Downloads",
  description: "Download estate forms — new owner, domestic worker and contractor registration, and building applications.",
};

export default async function FormsPage() {
  const documents = await getDocuments("forms");
  return (
    <>
      <PageHeader
        eyebrow="Forms & downloads"
        title="Forms & Downloads"
        description="Download the forms you need — search, preview and grab the latest versions of every estate form."
      />
      <section className="container py-12">
        <DocumentExplorer documents={documents as never} />
      </section>
    </>
  );
}
