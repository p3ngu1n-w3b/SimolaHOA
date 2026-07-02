"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { SearchInput } from "@/components/site/search-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Faq = {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
  category?: { name: string } | null;
};

export function FaqExplorer({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<string>("All");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => f.category?.name && set.add(f.category.name));
    return ["All", ...Array.from(set)];
  }, [faqs]);

  const featured = faqs.filter((f) => f.featured).slice(0, 4);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return faqs.filter((f) => {
      const matchCat = active === "All" || f.category?.name === active;
      const matchQ =
        !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [faqs, query, active]);

  return (
    <div className="space-y-8">
      {featured.length > 0 && !query && active === "All" && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-estate-gold" />
            <h2 className="text-xl font-bold">Featured Questions</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((f) => (
              <div key={f.id} className="rounded-xl border bg-card p-5">
                <p className="font-medium">{f.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search frequently asked questions…" />
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={active === c ? "default" : "outline"}
              onClick={() => setActive(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          No questions match your search.
        </p>
      ) : (
        <Accordion type="single" collapsible className="rounded-xl border bg-card px-5">
          {filtered.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger>
                <span className="flex items-center gap-2 text-left">
                  {f.question}
                  {f.category?.name && (
                    <Badge variant="secondary" className={cn("ml-2 hidden sm:inline-flex")}>
                      {f.category.name}
                    </Badge>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent>{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
