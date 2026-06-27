"use client";

import * as React from "react";
import { Plus, Loader2, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { uploadDocument, deleteDocument } from "@/app/actions/admin";
import { formatBytes, formatDate } from "@/lib/utils";
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

type Doc = {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  library: string;
  downloadCount: number;
  createdAt: Date | string;
  category?: { name: string } | null;
};

export function DocumentManager({ documents }: { documents: Doc[] }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const onUpload = async (formData: FormData) => {
    setPending(true);
    try {
      const res = await uploadDocument(formData);
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
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={onUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="library">Library</Label>
                  <Select name="library" defaultValue="forms">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forms">Forms &amp; Downloads</SelectItem>
                      <SelectItem value="library">Document Library</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category</Label>
                  <Input id="categoryName" name="categoryName" placeholder="e.g. Governance" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" accept="image/*,application/pdf,.doc,.docx" required />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch name="featured" value="true" /> Featured
              </label>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Upload
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Library</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-center">Downloads</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No documents uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-estate-gold" />
                      <div>
                        <p className="font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(d.createdAt)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{d.library === "forms" ? "Forms" : "Library"}</Badge>
                  </TableCell>
                  <TableCell>{d.category?.name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{formatBytes(d.fileSize)}</TableCell>
                  <TableCell className="text-center">{d.downloadCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" aria-label="Open">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <ConfirmDelete onConfirm={() => deleteDocument(d.id)} description="This document will be permanently removed." />
                    </div>
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
