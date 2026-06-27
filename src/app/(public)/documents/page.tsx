import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { DocumentExplorer } from "@/components/site/document-explorer";
import { getDocuments } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Document Library",
  description: "The complete Simola Estate document archive — governance, rules, guidelines and meeting minutes.",
};

export default async function DocumentLibraryPage() {
  const forms = await getDocuments("forms");
  const library = await getDocuments("library");
  const documents = [...library, ...forms];
  return (
    <>
      <PageHeader
        eyebrow="Archive"
        title="Document Library"
        description="Browse and download the full archive of estate documents — constitution, rules, guidelines, minutes and more."
      />
      <section className="container py-12">
        <DocumentExplorer documents={documents as never} />
      </section>
    </>
  );
}
