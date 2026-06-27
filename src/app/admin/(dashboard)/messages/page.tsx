import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { MessagesTable } from "@/components/admin/messages-table";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact Messages", robots: { index: false } };

export default async function AdminMessagesPage() {
  const messages = await safeQuery(
    () => prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Contact Submissions" description="Messages submitted via the public contact form." />
      <MessagesTable messages={messages} />
    </div>
  );
}
