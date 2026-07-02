"use client";

import * as React from "react";
import { Droplet, Zap, Wifi, ShieldCheck, Trash2, Recycle, BookOpen } from "lucide-react";
import { SearchInput } from "@/components/site/search-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Article = {
  id: string;
  title: string;
  summary?: string | null;
  body: string;
  tags?: string[];
  category?: { name: string } | null;
};

const ICONS: Record<string, typeof Droplet> = {
  Water: Droplet,
  Electricity: Zap,
  Fibre: Wifi,
  Security: ShieldCheck,
  Waste: Trash2,
  "Biolytic Systems": Recycle,
};

export function SelfHelpExplorer({ articles }: { articles: Article[] }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState("All");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.category?.name && set.add(a.category.name));
    return ["All", ...Array.from(set)];
  }, [articles]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return articles.filter((a) => {
      const matchCat = active === "All" || a.category?.name === active;
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        (a.summary ?? "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [articles, query, active]);

  const related = React.useMemo(() => {
    if (active === "All") return [];
    return articles.filter((a) => a.category?.name === active).slice(0, 5);
  }, [articles, active]);

  return (
    <div className="space-y-6">
      <SearchInput value={query} onChange={setQuery} placeholder="Search the self help centre…" />

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const Icon = ICONS[c] ?? BookOpen;
          return (
            <Button
              key={c}
              size="sm"
              variant={active === c ? "default" : "outline"}
              onClick={() => setActive(c)}
              className="gap-1.5"
            >
              {c !== "All" && <Icon className="h-4 w-4" />}
              {c}
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <div>
          {filtered.length === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              No guides match your search.
            </p>
          ) : (
            <Accordion type="single" collapsible className="rounded-xl border bg-card px-5">
              {filtered.map((a) => (
                <AccordionItem key={a.id} value={a.id}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2 text-left">
                      {a.category?.name && (
                        <Badge variant="secondary" className="hidden sm:inline-flex">
                          {a.category.name}
                        </Badge>
                      )}
                      {a.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {a.summary && <p className="mb-2 font-medium text-foreground">{a.summary}</p>}
                    <p>{a.body}</p>
                    {a.tags && a.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {a.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 text-sm font-semibold">
                {active === "All" ? "Browse categories" : `Related in ${active}`}
              </p>
              {related.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {related.map((r) => (
                    <li key={r.id} className="text-muted-foreground">• {r.title}</li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1 text-sm">
                  {categories.filter((c) => c !== "All").map((c) => (
                    <li key={c}>
                      <button
                        onClick={() => setActive(c)}
                        className="block w-full rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {c}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
