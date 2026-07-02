"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const PRIMARY = NAV_ITEMS.filter((i) =>
  ["/", "/emergency-contacts", "/report-an-issue", "/rules", "/notices", "/contact"].includes(i.href)
);
const MORE = NAV_ITEMS.filter((i) => !PRIMARY.includes(i));

const DESKTOP_LABELS: Record<string, string> = {
  "/emergency-contacts": "Emergency",
  "/report-an-issue": "Report Issue",
  "/rules": "Rules",
  "/notices": "Notices",
  "/contact": "Contact",
};

function NavLink({
  href,
  label,
  active,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
        className
      )}
    >
      {label}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-estate-gold"
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const moreActive = MORE.some((item) => pathname === item.href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="h-0.5 gold-divider opacity-80" />

      <div className="container flex h-16 items-center gap-4 lg:grid lg:h-[4.5rem] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-8">
        <Logo className="shrink-0 lg:justify-self-start" />

        <nav
          className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-muted/40 p-1 lg:flex lg:justify-self-center"
          aria-label="Primary"
        >
          {PRIMARY.map((item) => {
            const active = pathname === item.href;
            const label = DESKTOP_LABELS[item.href] ?? item.title;
            return (
              <NavLink key={item.href} href={item.href} label={label} active={active} />
            );
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  moreActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                More
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                {moreActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-estate-gold"
                  />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 p-2">
              <DropdownMenuLabel className="px-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                More resources
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {MORE.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="items-start">
                  <Link
                    href={item.href}
                    className={cn(
                      "w-full cursor-pointer flex-col items-start gap-0.5 rounded-md px-2 py-2.5 text-left",
                      pathname === item.href && "bg-primary/8 text-primary"
                    )}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <item.icon className="h-4 w-4 text-estate-gold" />
                      {item.title}
                    </span>
                    {item.description && (
                      <span className="pl-6 text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:justify-self-end lg:gap-2.5">
          <Button asChild variant="gold" size="sm" className="hidden shadow-sm sm:inline-flex lg:h-9 lg:px-4">
            <Link href="/emergency-contacts">
              <PhoneCall className="h-4 w-4" /> Emergency
            </Link>
          </Button>
          <div className="hidden h-6 w-px bg-border lg:block" aria-hidden />
          <ThemeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-2 py-3" aria-label="Mobile">
                {NAV_ITEMS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-5 w-5 text-estate-gold" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
