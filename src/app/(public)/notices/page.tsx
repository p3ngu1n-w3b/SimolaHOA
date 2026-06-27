import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { NoticesExplorer } from "@/components/site/notices-explorer";
import { getPublishedNotices } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notices & Alerts",
  description: "The latest notices and alerts from the Simola Homeowners Association — water, security, roads, maintenance, AGM and community updates.",
};

export default async function NoticesPage() {
  const notices = await getPublishedNotices();
  return (
    <>
      <PageHeader
        eyebrow="Stay informed"
        title="Notices & Alerts"
        description="Important estate communications. Pinned notices appear first. Filter by category or search to find what you need."
      />
      <section className="container py-12">
        <NoticesExplorer notices={notices as never} />
      </section>
    </>
  );
}
