"use client";

import * as React from "react";
import { updateDomesticWorkerStatus } from "@/app/actions/admin";
import { REGISTRATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { SearchInput } from "@/components/site/search-input";
import { StatusSelect } from "@/components/admin/status-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Worker = {
  id: string;
  residentName: string;
  propertyNumber: string;
  workerName: string;
  idNumber: string;
  contactNumber: string;
  photoUrl: string | null;
  status: string;
  createdAt: Date | string;
};

export function DomesticWorkersTable({ workers }: { workers: Worker[] }) {
  const [query, setQuery] = React.useState("");
  const filtered = workers.filter((w) => {
    const q = query.toLowerCase();
    return !q || w.workerName.toLowerCase().includes(q) || w.residentName.toLowerCase().includes(q) || w.propertyNumber.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="sm:max-w-xs">
        <SearchInput value={query} onChange={setQuery} placeholder="Search registrations…" />
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worker</TableHead>
              <TableHead>ID Number</TableHead>
              <TableHead>Resident</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No registrations found.</TableCell></TableRow>
            ) : (
              filtered.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {w.photoUrl ? (
                        <img src={w.photoUrl} alt={w.workerName} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs">{w.workerName.slice(0, 2).toUpperCase()}</span>
                      )}
                      <span className="font-medium">{w.workerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{w.idNumber}</TableCell>
                  <TableCell>{w.residentName}</TableCell>
                  <TableCell>{w.propertyNumber}</TableCell>
                  <TableCell>{w.contactNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(w.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect value={w.status} options={REGISTRATION_STATUSES as never} onUpdate={(s) => updateDomesticWorkerStatus(w.id, s)} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
