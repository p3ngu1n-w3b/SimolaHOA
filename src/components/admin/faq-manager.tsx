"use client";

import * as React from "react";
import { Plus, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { createFaq, deleteFaq } from "@/app/actions/admin";
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
import { ConfirmDelete } from "@/components/admin/confirm-delete";

type Faq = {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
  published: boolean;
  category?: { name: string } | null;
};

export function FaqManager({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const onCreate = async (formData: FormData) => {
    setPending(true);
    try {
      const res = await createFaq(formData);
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
              <Plus className="h-4 w-4" /> New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create FAQ</DialogTitle>
            </DialogHeader>
            <form ref={formRef} action={onCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input id="question" name="question" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea id="answer" name="answer" rows={4} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category</Label>
                <Input id="categoryName" name="categoryName" placeholder="e.g. Security, Pets, Access" required />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch name="featured" value="true" /> Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch name="published" value="true" defaultChecked /> Published
                </label>
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create FAQ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No FAQs yet.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="max-w-md font-medium">{f.question}</TableCell>
                  <TableCell>
                    {f.category?.name && <Badge variant="secondary">{f.category.name}</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    {f.featured && <Star className="mx-auto h-4 w-4 text-estate-gold" />}
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDelete onConfirm={() => deleteFaq(f.id)} description="This FAQ will be permanently removed." />
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
