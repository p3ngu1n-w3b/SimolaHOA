"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, X, Send, CheckCircle2 } from "lucide-react";
import { contractorSchema, type ContractorInput } from "@/lib/validations";
import { submitContractor } from "@/app/actions/public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

export function ContractorForm() {
  const [pending, setPending] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [done, setDone] = React.useState<string | null>(null);

  const form = useForm<ContractorInput>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      vehicleDetails: "",
      staffList: "",
      workStartDate: "",
      workEndDate: "",
    },
  });

  const onSubmit = async (values: ContractorInput) => {
    setPending(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, String(v ?? "")));
      files.forEach((f) => fd.append("documents", f));
      const res = await submitContractor(fd);
      if (res.ok) {
        toast.success(res.message);
        setDone(res.reference ?? "");
        form.reset();
        setFiles([]);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  if (done !== null) {
    return (
      <div className="rounded-lg border bg-emerald-50 p-8 text-center dark:bg-emerald-950/30">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
        <h3 className="text-xl font-bold">Contractor Registered</h3>
        <p className="mt-2 text-muted-foreground">The estate office will review and approve the registration.</p>
        {done && <Badge variant="gold" className="mt-4 text-base">{done}</Badge>}
        <div className="mt-6">
          <Button variant="outline" onClick={() => setDone(null)}>Register another contractor</Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField control={form.control} name="companyName" render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl><Input placeholder="Company / business name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="contactPerson" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Person *</FormLabel>
              <FormControl><Input placeholder="Site contact" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="contactEmail" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl><Input type="email" placeholder="contact@company.co.za" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="contactPhone" render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Phone</FormLabel>
              <FormControl><Input placeholder="+27 ..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="workStartDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Work Start Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="workEndDate" render={({ field }) => (
            <FormItem>
              <FormLabel>Work End Date</FormLabel>
              <FormControl><Input type="date" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="vehicleDetails" render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Details</FormLabel>
            <FormControl><Input placeholder="Make, model & registration of vehicles" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="staffList" render={({ field }) => (
          <FormItem>
            <FormLabel>Staff List</FormLabel>
            <FormControl><Textarea rows={4} placeholder="List staff names and ID numbers, one per line" {...field} /></FormControl>
            <FormDescription>One name &amp; ID per line.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        <div className="space-y-2">
          <FormLabel>Upload Documents</FormLabel>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-estate-gold">
            <Upload className="h-6 w-6 text-estate-gold" />
            <span>Company registration, insurance, ID copies (PDF or image)</span>
            <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files ?? [])].slice(0, 8))} />
          </label>
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-xs">
                  <span className="max-w-[160px] truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))} aria-label="Remove">
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit Registration
        </Button>
      </form>
    </Form>
  );
}
