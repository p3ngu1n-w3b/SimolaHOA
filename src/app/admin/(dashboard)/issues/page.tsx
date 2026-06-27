import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { IssuesTable } from "@/components/admin/issues-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Issue Reports", robots: { index: false } };

export default async function AdminIssuesPage() {
  const issues = await safeQuery(
    () => prisma.issueReport.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Issue Reports" description="Review, track and resolve resident-submitted issues." />
      <IssuesTable issues={issues} />
    </div>
  );
}
