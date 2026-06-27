import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center estate-gradient px-4 text-center text-white">
      <Compass className="mb-4 h-14 w-14 text-estate-gold" />
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-estate-gold">404</p>
      <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-white/80">
        The page you are looking for may have moved or no longer exists.
      </p>
      <Button asChild variant="gold" className="mt-8">
        <Link href="/">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </Button>
    </div>
  );
}
