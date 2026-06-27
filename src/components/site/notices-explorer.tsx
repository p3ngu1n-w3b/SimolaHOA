"use client";

import * as React from "react";
import Link from "next/link";
import { Pin, ArrowRight, CalendarDays } from "lucide-react";
import { SearchInput } from "@/components/site/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NOTICE_CATEGORIES } from "@/lib/constants";
import { formatDate, humanize, truncate } from "@/lib/utils";

type Notice = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  body: string;
  category: string;
  pinned: boolean;
  publishAt?: Date | string | null;
  createdAt: Date | string;
};

export function NoticesExplorer({ notices }: { notices: Notice[] }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState("All");

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return notices.filter((n) => {
      const matchCat = active === "All" || n.category === active;
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [notices, query, active]);

  const pinned = filtered.filter((n) => n.pinned);
  const rest = filtered.filter((n) => !n.pinned);

  const label = (v: string) => NOTICE_CATEGORIES.find((c) => c.value === v)?.label ?? humanize(v);

  const NoticeCard = ({ n }: { n: Notice }) => (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{label(n.category)}</Badge>
          {n.pinned && (
            <Badge variant="gold" className="gap-1">
              <Pin className="h-3 w-3" /> Pinned
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{n.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(n.publishAt || n.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        <p className="text-sm text-muted-foreground">{n.excerpt || truncate(n.body, 140)}</p>
        <Button asChild variant="link" className="w-fit px-0">
          <Link href={`/notices/${n.slug}`}>
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SearchInput value={query} onChange={setQuery} placeholder="Search notices…" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={active === "All" ? "default" : "outline"} onClick={() => setActive("All")}>
          All
        </Button>
        {NOTICE_CATEGORIES.map((c) => (
          <Button
            key={c.value}
            size="sm"
            variant={active === c.value ? "default" : "outline"}
            onClick={() => setActive(c.value)}
          >
            {c.label}
          </Button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          No notices match your search.
        </p>
      )}

      {pinned.length > 0 && (
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Pin className="h-5 w-5 text-estate-gold" /> Pinned Notices
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pinned.map((n) => <NoticeCard key={n.id} n={n} />)}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((n) => <NoticeCard key={n.id} n={n} />)}
        </div>
      )}
    </div>
  );
}
