import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center estate-gradient px-4 text-center text-white">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <WifiOff className="h-8 w-8 text-estate-gold" />
      </div>
      <h1 className="text-3xl font-bold">You're offline</h1>
      <p className="mt-3 max-w-md text-white/80">
        It looks like you've lost your connection. Pages you've already visited remain available —
        reconnect to load the latest estate information, notices and forms.
      </p>
      <Button asChild variant="gold" className="mt-8">
        <Link href="/">
          <Home className="h-4 w-4" /> Go to Home
        </Link>
      </Button>
    </div>
  );
}
