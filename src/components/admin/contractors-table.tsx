"use client";

import * as React from "react";
import { Eye } from "lucide-react";
import { updateContractorStatus } from "@/app/actions/admin";
import { CONTRACTOR_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SearchInput } from "@/components/site/search-input";
import { StatusSelect } from "@/components/admin/status-select";
import { Button } from "@/components/ui/button";
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

type Contractor = {
  id: string;
  companyName: string;
  contactPerson: string;
  contactEmail: string | null;
  contactPhone: string | null;
  vehicleDetails: string | null;
  staffList: string | null;
  workStartDate: Date | string | null;
  workEndDate: Date | string | null;
  documents: string[];
  status: string;
  createdAt: Date | string;
};

export function ContractorsTable({ contractors }: { contractors: Contractor[] }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Contractor | null>(null);

  const filtered = contractors.filter((c) => {
    const q = query.toLowerCase();
    return !q || c.companyName.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="sm:max-w-xs">
        <SearchInput value={query} onChange={setQuery} placeholder="Search contractors…" />
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Work Dates</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No contractors found.</TableCell></TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.companyName}</TableCell>
                  <TableCell>
                    <div>{c.contactPerson}</div>
                    <div className="text-xs text-muted-foreground">{c.contactPhone || c.contactEmail}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.workStartDate ? formatDate(c.workStartDate) : "—"}
                    {c.workEndDate ? ` → ${formatDate(c.workEndDate)}` : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect value={c.status} options={CONTRACTOR_STATUSES as never} onUpdate={(s) => updateContractorStatus(c.id, s)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setSelected(c)} aria-label="View">
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
                <DialogTitle>{selected.companyName}</DialogTitle>
                <DialogDescription>Registered {formatDate(selected.createdAt)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Contact:</span> {selected.contactPerson}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {selected.contactPhone || "—"}</div>
                  <div><span className="text-muted-foreground">Email:</span> {selected.contactEmail || "—"}</div>
                  <div><span className="text-muted-foreground">Vehicle:</span> {selected.vehicleDetails || "—"}</div>
                </div>
                {selected.staffList && (
                  <div>
                    <p className="text-muted-foreground">Staff list</p>
                    <p className="mt-1 whitespace-pre-line">{selected.staffList}</p>
                  </div>
                )}
                {selected.documents.length > 0 && (
                  <div>
                    <p className="text-muted-foreground">Documents</p>
                    <ul className="mt-1 space-y-1">
                      {selected.documents.map((d, i) => (
                        <li key={i}>
                          <a href={d} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                            Document {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
