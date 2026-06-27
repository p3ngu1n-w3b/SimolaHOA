import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublishedNotices } from "@/lib/queries";
import { NOTICE_CATEGORIES } from "@/lib/constants";
import { formatDate, humanize } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function findNotice(slug: string) {
  const notices = await getPublishedNotices();
  return notices.find((n) => n.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notice = await findNotice(slug);
  if (!notice) return { title: "Notice not found" };
  return {
    title: notice.title,
    description: notice.excerpt || notice.body.slice(0, 150),
  };
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await findNotice(slug);
  if (!notice) notFound();

  const label =
    NOTICE_CATEGORIES.find((c) => c.value === notice.category)?.label ?? humanize(String(notice.category));

  return (
    <article className="container max-w-3xl py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link href="/notices">
          <ArrowLeft className="h-4 w-4" /> All notices
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{label}</Badge>
        {notice.pinned && (
          <Badge variant="gold" className="gap-1">
            <Pin className="h-3 w-3" /> Pinned
          </Badge>
        )}
      </div>

      <h1 className="mt-4 text-3xl font-bold md:text-4xl">{notice.title}</h1>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        {formatDate(notice.publishAt || notice.createdAt)}
        {notice.authorName && <span>· {notice.authorName}</span>}
      </p>

      <div className="gold-divider my-6 h-px w-full" />

      <div className="prose prose-neutral max-w-none whitespace-pre-line leading-relaxed text-foreground/90 dark:prose-invert">
        {notice.body}
      </div>
    </article>
  );
}
