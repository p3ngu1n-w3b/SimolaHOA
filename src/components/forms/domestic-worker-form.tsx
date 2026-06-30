"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Upload, X, Send, CheckCircle2 } from "lucide-react";
import { domesticWorkerSchema, type DomesticWorkerInput } from "@/lib/validations";
import { submitNetlifyForm } from "@/lib/submit-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function DomesticWorkerForm() {
  const [pending, setPending] = React.useState(false);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [done, setDone] = React.useState<string | null>(null);

  const form = useForm<DomesticWorkerInput>({
    resolver: zodResolver(domesticWorkerSchema),
    defaultValues: { residentName: "", propertyNumber: "", workerName: "", idNumber: "", contactNumber: "" },
  });

  const onSubmit = async (values: DomesticWorkerInput) => {
    setPending(true);
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => fd.append(k, String(v)));
      if (photo) fd.append("photo", photo);
      const ok = await submitNetlifyForm("domestic-worker-registration", fd);
      if (ok) {
        toast.success("Domestic worker registration submitted.");
        setDone("");
        form.reset();
        setPhoto(null);
      } else {
        toast.error("Could not submit. Please try again or email the office.");
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
        <h3 className="text-xl font-bold">Registration Submitted</h3>
        <p className="mt-2 text-muted-foreground">
          The estate office will review and confirm the registration.
        </p>
        {done && <Badge variant="gold" className="mt-4 text-base">{done}</Badge>}
        <div className="mt-6">
          <Button variant="outline" onClick={() => setDone(null)}>Register another worker</Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField control={form.control} name="residentName" render={({ field }) => (
            <FormItem>
              <FormLabel>Resident Name *</FormLabel>
              <FormControl><Input placeholder="Resident full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="propertyNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Property Number *</FormLabel>
              <FormControl><Input placeholder="e.g. 142" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="workerName" render={({ field }) => (
            <FormItem>
              <FormLabel>Domestic Worker Name *</FormLabel>
              <FormControl><Input placeholder="Worker full name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="idNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number *</FormLabel>
              <FormControl><Input placeholder="ID / passport number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="contactNumber" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Contact Number *</FormLabel>
              <FormControl><Input placeholder="+27 ..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="space-y-2">
          <FormLabel>Photo Upload</FormLabel>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground transition-colors hover:border-estate-gold">
            <Upload className="h-6 w-6 text-estate-gold" />
            <span>{photo ? photo.name : "Tap to add a photo of the worker"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          </label>
          {photo && (
            <button type="button" onClick={() => setPhoto(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
              <X className="h-3.5 w-3.5" /> Remove photo
            </button>
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
