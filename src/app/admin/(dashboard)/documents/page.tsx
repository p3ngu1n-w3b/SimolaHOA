import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { DocumentManager } from "@/components/admin/document-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage Documents", robots: { index: false } };

export default async function AdminDocumentsPage() {
  const documents = await safeQuery(
    () => prisma.document.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Manage Documents" description="Upload and manage forms and library documents." />
      <DocumentManager documents={documents} />
    </div>
  );
}
