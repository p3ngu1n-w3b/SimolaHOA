"use client";

import * as React from "react";
import { FileText, Download, Eye, Star } from "lucide-react";
import { SearchInput } from "@/components/site/search-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatBytes } from "@/lib/utils";

type Doc = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  featured: boolean;
  downloadCount: number;
  category?: { name: string } | null;
};

export function DocumentExplorer({ documents }: { documents: Doc[] }) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState("All");
  const [preview, setPreview] = React.useState<Doc | null>(null);

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => d.category?.name && set.add(d.category.name));
    return ["All", ...Array.from(set)];
  }, [documents]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return documents.filter((d) => {
      const matchCat = active === "All" || d.category?.name === active;
      const matchQ =
        !q || d.title.toLowerCase().includes(q) || (d.description ?? "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [documents, query, active]);

  return (
    <div className="space-y-6">
      <SearchInput value={query} onChange={setQuery} placeholder="Search documents…" />
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <Button key={c} size="sm" variant={active === c ? "default" : "outline"} onClick={() => setActive(c)}>
            {c}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
          No documents match your search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} className="flex h-full flex-col">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-estate-gold/15 text-estate-gold">
                    <FileText className="h-6 w-6" />
                  </div>
                  {d.featured && (
                    <Badge variant="gold" className="gap-1">
                      <Star className="h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold leading-snug">{d.title}</h3>
                {d.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {d.category?.name && <Badge variant="secondary">{d.category.name}</Badge>}
                  <span>{formatBytes(d.fileSize)}</span>
                </div>
                <div className="mt-4 flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setPreview(d)}>
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <a href={d.fileUrl} download={d.fileName} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" /> Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>{preview?.description}</DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="space-y-4">
              {preview.mimeType.startsWith("image/") ? (
                <img src={preview.fileUrl} alt={preview.title} className="max-h-[60vh] w-full rounded-md object-contain" />
              ) : preview.mimeType === "application/pdf" && preview.fileUrl !== "#" ? (
                <iframe src={preview.fileUrl} title={preview.title} className="h-[60vh] w-full rounded-md border" />
              ) : (
                <div className="flex h-48 flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/30 text-center text-sm text-muted-foreground">
                  <FileText className="mb-2 h-8 w-8 text-estate-gold" />
                  Preview not available for this file.
                  <span className="text-xs">Download to view the full document.</span>
                </div>
              )}
              <Button asChild className="w-full">
                <a href={preview.fileUrl} download={preview.fileName} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" /> Download {preview.fileName}
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
