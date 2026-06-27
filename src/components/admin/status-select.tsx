"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusSelect({
  value,
  options,
  onUpdate,
}: {
  value: string;
  options: { value: string; label: string }[];
  onUpdate: (status: string) => Promise<{ ok: boolean; message: string }>;
}) {
  const [pending, setPending] = React.useState(false);
  const [current, setCurrent] = React.useState(value);

  const handle = async (next: string) => {
    setPending(true);
    setCurrent(next);
    try {
      const res = await onUpdate(next);
      res.ok ? toast.success(res.message) : toast.error(res.message);
      if (!res.ok) setCurrent(value);
    } catch {
      toast.error("Update failed.");
      setCurrent(value);
    } finally {
      setPending(false);
    }
  };

  return (
    <Select value={current} onValueChange={handle} disabled={pending}>
      <SelectTrigger className="h-9 w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
