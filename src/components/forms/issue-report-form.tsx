"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Loader2, Upload, X, Send } from "lucide-react";
import { issueReportSchema, type IssueReportInput } from "@/lib/validations";
import { ISSUE_CATEGORIES } from "@/lib/constants";
import { submitNetlifyForm } from "@/lib/submit-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function IssueReportForm() {
  const router = useRouter();
  const [files, setFiles] = React.useState<File[]>([]);
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = React.useState(false);
  const [pending, setPending] = React.useState(false);

  const form = useForm<IssueReportInput>({
    resolver: zodResolver(issueReportSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyNumber: "",
      category: undefined,
      description: "",
      locationLabel: "",
    },
  });

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        form.setValue("locationLabel", `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        setLocating(false);
        toast.success("Location captured.");
      },
      () => {
        setLocating(false);
        toast.error("Could not get your location. You can enter it manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...selected].slice(0, 3));
  };

  const onSubmit = async (values: IssueReportInput) => {
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("name", values.name);
      fd.append("email", values.email ?? "");
      fd.append("phone", values.phone ?? "");
      fd.append("propertyNumber", values.propertyNumber);
      fd.append("category", values.category);
      fd.append("description", values.description);
      const locationLabel =
        values.locationLabel || (coords ? `${coords.lat}, ${coords.lng}` : "");
      fd.append("location", locationLabel);
      // Netlify Forms accepts one file per input field.
      if (files[0]) fd.append("photo", files[0]);
      if (files[1]) fd.append("photo_2", files[1]);
      if (files[2]) fd.append("photo_3", files[2]);

      const ok = await submitNetlifyForm("report-an-issue", fd);
      if (ok) {
        toast.success("Your issue has been submitted.");
        router.push("/report-an-issue/success");
      } else {
        toast.error("Could not submit your report. Please try again or call the office.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Resident" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="propertyNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Number *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 142" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormDescription>We'll send your reference here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+27 ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Category *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ISSUE_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Describe the issue, including location and any relevant detail…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* GPS Location */}
        <FormField
          control={form.control}
          name="locationLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <FormControl>
                  <Input placeholder="Describe the location or use GPS" {...field} />
                </FormControl>
                <Button type="button" variant="outline" onClick={captureLocation} disabled={locating}>
                  {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                  Use GPS
                </Button>
              </div>
              {coords && (
                <FormDescription>
                  Captured: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Photo upload */}
        <div className="space-y-2">
          <FormLabel>Upload Photos</FormLabel>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-estate-gold">
            <Upload className="h-6 w-6 text-estate-gold" />
            <span>Tap to add photos (up to 3, 8MB each)</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
          </label>
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-xs">
                  <span className="max-w-[160px] truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove file"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
