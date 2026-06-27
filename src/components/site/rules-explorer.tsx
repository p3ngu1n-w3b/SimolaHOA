"use client";

import * as React from "react";
import { FileText, Download, ScrollText } from "lucide-react";
import type { RuleSection } from "@/lib/content";
import { SearchInput } from "@/components/site/search-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RulesExplorer({ sections }: { sections: RuleSection[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return sections;
    const q = query.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (i) => i.title.toLowerCase().includes(q) || i.body.toLowerCase().includes(q)
        ),
      }))
      .filter((s) => s.items.length || s.group.toLowerCase().includes(q));
  }, [sections, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-8">
        <SearchInput value={query} onChange={setQuery} placeholder="Search rules & guidelines…" />

        {filtered.length === 0 && (
          <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            No rules match “{query}”.
          </p>
        )}

        {filtered.map((section) => (
          <Card key={section.slug} id={section.slug} className="scroll-mt-24">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-estate-gold" />
                <h2 className="text-xl font-bold">{section.group}</h2>
                <Badge variant="secondary" className="ml-auto">{section.items.length}</Badge>
              </div>
              <Accordion type="multiple" className="w-full">
                {section.items.map((item, idx) => (
                  <AccordionItem key={idx} value={`${section.slug}-${idx}`}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>{item.body}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-sm font-semibold">Jump to section</p>
            <nav className="space-y-1 text-sm">
              {sections.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {s.group}
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardContent className="space-y-3 p-5 text-sm">
            <div className="flex items-center gap-2 font-medium">
              <FileText className="h-4 w-4 text-estate-gold" /> Official documents
            </div>
            <p className="text-muted-foreground">Download the complete rule documents as PDFs.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <a href="/documents">
                <Download className="h-4 w-4" /> Document Library
              </a>
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
