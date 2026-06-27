import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { ContractorsTable } from "@/components/admin/contractors-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contractors", robots: { index: false } };

export default async function AdminContractorsPage() {
  const contractors = await safeQuery(
    () => prisma.contractor.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Contractor Registrations" description="Manage contractors, search and approve work permissions." />
      <ContractorsTable contractors={contractors} />
    </div>
  );
}
