"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { saveSetting } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SiteSettings = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  mapsEmbed?: string;
  announcement?: string;
};

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [pending, setPending] = React.useState(false);
  const [values, setValues] = React.useState<SiteSettings>(initial);

  const set = (k: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSave = async () => {
    setPending(true);
    try {
      const res = await saveSetting("site", values);
      res.ok ? toast.success(res.message) : toast.error(res.message);
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Office Email</Label>
            <Input id="email" value={values.email ?? ""} onChange={set("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telephone</Label>
            <Input id="phone" value={values.phone ?? ""} onChange={set("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp Number</Label>
            <Input id="whatsapp" value={values.whatsapp ?? ""} onChange={set("whatsapp")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={values.address ?? ""} onChange={set("address")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="announcement">Home Page Announcement</Label>
          <Input id="announcement" value={values.announcement ?? ""} onChange={set("announcement")} placeholder="Optional banner message" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mapsEmbed">Google Maps Embed URL</Label>
          <Textarea id="mapsEmbed" rows={2} value={values.mapsEmbed ?? ""} onChange={set("mapsEmbed")} placeholder="https://www.google.com/maps/embed?..." />
        </div>
        <Button onClick={onSave} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
}
