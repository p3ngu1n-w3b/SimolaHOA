"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";

export function EmergencyFab() {
  return (
    <Link
      href="/emergency-contacts"
      aria-label="Emergency contacts"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 md:bottom-6 md:right-6"
    >
      <PhoneCall className="h-5 w-5 animate-pulse" />
      <span className="hidden sm:inline">Emergency</span>
    </Link>
  );
}
