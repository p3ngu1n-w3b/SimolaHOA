"use client";

import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createNotice, deleteNotice, toggleNotice } from "@/app/actions/admin";
import { NOTICE_CATEGORIES } from "@/lib/constants";
import { formatDate, humanize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Notice = {
  id: string;
  title: string;
  category: string;
  pinned: boolean;
  published: boolean;
  publishAt: Date | string | null;
  createdAt: Date | string;
};

export function NoticeManager({ notices }: { notices: Notice[] }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const onCreate = async (formData: FormData) => {
    setPending(true);
    try {
      const res = await createNotice(formData);
      if (res.ok) {
        toast.success(res.message);
        setOpen(false);
        formRef.current?.reset();
      } else {
        toast.error(res.message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" /> New Notice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Notice</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={onCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="COMMUNITY_UPDATES">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTICE_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input id="excerpt" name="excerpt" placeholder="Short summary (optional)" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <Textarea id="body" name="body" rows={5} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publishAt">Publish date</Label>
                <Input id="publishAt" name="publishAt" type="datetime-local" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch name="pinned" value="true" /> Pinned
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch name="published" value="true" defaultChecked /> Published
                </label>
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Notice
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Pinned</TableHead>
              <TableHead className="text-center">Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No notices yet. Create your first notice above.
                </TableCell>
              </TableRow>
            ) : (
              notices.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {NOTICE_CATEGORIES.find((c) => c.value === n.category)?.label ?? humanize(n.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(n.publishAt || n.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={n.pinned}
                      onCheckedChange={(v) => toggleNotice(n.id, "pinned", v).then((r) => r.ok ? toast.success(r.message) : toast.error(r.message))}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={n.published}
                      onCheckedChange={(v) => toggleNotice(n.id, "published", v).then((r) => r.ok ? toast.success(r.message) : toast.error(r.message))}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDelete onConfirm={() => deleteNotice(n.id)} description="This notice will be permanently removed." />
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
