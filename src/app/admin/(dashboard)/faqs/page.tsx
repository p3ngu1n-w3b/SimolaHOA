import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { FaqManager } from "@/components/admin/faq-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage FAQs", robots: { index: false } };

export default async function AdminFaqsPage() {
  const faqs = await safeQuery(
    () => prisma.faq.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="Manage FAQs" description="Create and manage frequently asked questions." />
      <FaqManager faqs={faqs} />
    </div>
  );
}
