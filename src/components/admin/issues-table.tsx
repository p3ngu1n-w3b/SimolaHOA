"use client";

import * as React from "react";
import { Eye, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateIssueStatus } from "@/app/actions/admin";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/lib/constants";
import { formatDateTime, humanize } from "@/lib/utils";
import { SearchInput } from "@/components/site/search-input";
import { StatusSelect } from "@/components/admin/status-select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Issue = {
  id: string;
  reference: string;
  name: string;
  email: string | null;
  phone: string | null;
  propertyNumber: string;
  category: string;
  description: string;
  status: string;
  photos: string[];
  latitude: number | null;
  longitude: number | null;
  locationLabel: string | null;
  adminNotes: string | null;
  createdAt: Date | string;
};

const statusVariant: Record<string, "secondary" | "warning" | "success" | "default"> = {
  SUBMITTED: "secondary",
  ACKNOWLEDGED: "default",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "secondary",
};

export function IssuesTable({ issues }: { issues: Issue[] }) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("ALL");
  const [selected, setSelected] = React.useState<Issue | null>(null);
  const [notes, setNotes] = React.useState("");
  const [savingNotes, setSavingNotes] = React.useState(false);

  const filtered = issues.filter((i) => {
    const q = query.toLowerCase();
    const matchQ = !q || i.reference.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.propertyNumber.toLowerCase().includes(q);
    const matchStatus = filter === "ALL" || i.status === filter;
    return matchQ && matchStatus;
  });

  const openDetail = (issue: Issue) => {
    setSelected(issue);
    setNotes(issue.adminNotes ?? "");
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSavingNotes(true);
    try {
      const res = await updateIssueStatus(selected.id, selected.status, notes);
      res.ok ? toast.success("Notes saved.") : toast.error(res.message);
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-xs">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by ref, name, property…" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={filter === "ALL" ? "default" : "outline"} onClick={() => setFilter("ALL")}>All</Button>
          {ISSUE_STATUSES.map((s) => (
            <Button key={s.value} size="sm" variant={filter === s.value ? "default" : "outline"} onClick={() => setFilter(s.value)}>
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Reported by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No issue reports found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-xs font-medium">{i.reference}</TableCell>
                  <TableCell>{ISSUE_CATEGORIES.find((c) => c.value === i.category)?.label ?? humanize(i.category)}</TableCell>
                  <TableCell>{i.propertyNumber}</TableCell>
                  <TableCell>{i.name}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(i.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect
                      value={i.status}
                      options={ISSUE_STATUSES as never}
                      onUpdate={(status) => updateIssueStatus(i.id, status)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openDetail(i)} aria-label="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.reference}
                  <Badge variant={statusVariant[selected.status] ?? "secondary"}>{humanize(selected.status)}</Badge>
                </DialogTitle>
                <DialogDescription>
                  {ISSUE_CATEGORIES.find((c) => c.value === selected.category)?.label} · {formatDateTime(selected.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Name:</span> {selected.name}</div>
                  <div><span className="text-muted-foreground">Property:</span> {selected.propertyNumber}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.email || "—"}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selected.phone || "—"}</div>
                </div>
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="mt-1 whitespace-pre-line">{selected.description}</p>
                </div>
                {(selected.latitude || selected.locationLabel) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-estate-gold" />
                    {selected.locationLabel || `${selected.latitude}, ${selected.longitude}`}
                    {selected.latitude && (
                      <a
                        className="text-primary underline"
                        href={`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Map
                      </a>
                    )}
                  </div>
                )}
                {selected.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selected.photos.map((p, idx) => (
                      <a key={idx} href={p} target="_blank" rel="noopener noreferrer">
                        <img src={p} alt={`Photo ${idx + 1}`} className="h-20 w-20 rounded-md border object-cover" />
                      </a>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="notes">Admin notes</Label>
                  <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <Button size="sm" onClick={saveNotes} disabled={savingNotes}>
                    {savingNotes && <Loader2 className="h-4 w-4 animate-spin" />} Save Notes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
