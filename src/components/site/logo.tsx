import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label="Simola HOA home">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border-2 font-serif text-lg font-bold",
          variant === "light"
            ? "border-estate-gold bg-white/10 text-white"
            : "border-estate-gold bg-primary text-white"
        )}
      >
        S
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-lg font-bold tracking-tight",
            variant === "light" ? "text-white" : "text-foreground"
          )}
        >
          Simola
        </span>
        <span
          className={cn(
            "text-[0.65rem] font-medium uppercase tracking-[0.2em]",
            variant === "light" ? "text-estate-gold" : "text-estate-gold"
          )}
        >
          Homeowners Assoc.
        </span>
      </span>
    </Link>
  );
}
