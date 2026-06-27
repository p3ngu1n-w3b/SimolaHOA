import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { NoticeManager } from "@/components/admin/notice-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage Notices", robots: { index: false } };

export default async function AdminNoticesPage() {
  const notices = await safeQuery(
    () => prisma.notice.findMany({ orderBy: [{ pinned: "desc" }, { createdAt: "desc" }] }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Manage Notices" description="Create, pin, publish and remove estate notices." />
      <NoticeManager notices={notices} />
    </div>
  );
}
