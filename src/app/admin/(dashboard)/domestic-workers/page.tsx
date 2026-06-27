import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { DomesticWorkersTable } from "@/components/admin/domestic-workers-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Domestic Workers", robots: { index: false } };

export default async function AdminDomesticWorkersPage() {
  const workers = await safeQuery(
    () => prisma.domesticWorker.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Domestic Worker Registrations" description="Review and approve domestic worker registrations." />
      <DomesticWorkersTable workers={workers} />
    </div>
  );
}
