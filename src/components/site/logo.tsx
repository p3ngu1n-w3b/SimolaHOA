import Image from "next/image";
import Link from "next/link";
import { BRANDING } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  const framed = variant === "light";

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label={`${BRANDING.alt} home`}
    >
      <span
        className={cn(
          "inline-flex items-center",
          framed && "rounded-lg bg-white p-2 shadow-sm"
        )}
      >
        <Image
          src={BRANDING.logo}
          alt={BRANDING.alt}
          width={BRANDING.logoWidth}
          height={BRANDING.logoHeight}
          priority
          className="h-10 w-auto max-w-[min(100%,10rem)] sm:h-11 lg:h-12"
        />
      </span>
    </Link>
  );
}

export function BrandBanner({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "on-dark";
}) {
  return (
    <></>
  );
}

export function BrandMark({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "on-dark";
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full",
        variant === "on-dark" && "rounded-xl bg-white/95 p-3 shadow-lg ring-1 ring-white/20",
        className
      )}
    >
      <Image
        src={BRANDING.logo}
        alt={BRANDING.alt}
        width={BRANDING.logoWidth}
        height={BRANDING.logoHeight}
        className="h-24 w-auto max-w-[min(100%,18rem)] sm:h-28"
      />
    </div>
  );
}
