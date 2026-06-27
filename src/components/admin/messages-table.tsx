"use client";

import * as React from "react";
import { Eye, Mail } from "lucide-react";
import { updateMessageStatus } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";
import { SearchInput } from "@/components/site/search-input";
import { StatusSelect } from "@/components/admin/status-select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: Date | string;
};

const STATUS = [
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "ARCHIVED", label: "Archived" },
];

export function MessagesTable({ messages }: { messages: Message[] }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Message | null>(null);

  const filtered = messages.filter((m) => {
    const q = query.toLowerCase();
    return !q || m.name.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const open = (m: Message) => {
    setSelected(m);
    if (m.status === "NEW") void updateMessageStatus(m.id, "READ");
  };

  return (
    <div className="space-y-4">
      <div className="sm:max-w-xs">
        <SearchInput value={query} onChange={setQuery} placeholder="Search messages…" />
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No messages.</TableCell></TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {m.status === "NEW" && <span className="h-2 w-2 rounded-full bg-estate-gold" />}
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(m.createdAt)}</TableCell>
                  <TableCell>
                    <StatusSelect value={m.status} options={STATUS} onUpdate={(s) => updateMessageStatus(m.id, s)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => open(m)} aria-label="View">
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
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <DialogDescription>
                  {selected.name} · {selected.email} {selected.phone ? `· ${selected.phone}` : ""}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-line text-sm">{selected.message}</p>
              <Button asChild variant="outline" className="w-fit">
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}>
                  <Mail className="h-4 w-4" /> Reply by email
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
