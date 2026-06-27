import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AdminMobileNav } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminTopbar({ user }: { user: { name?: string | null; email?: string | null; role?: string } }) {
  const initials = (user.name || user.email || "A").slice(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <AdminMobileNav />
        <div>
          <p className="text-sm font-semibold leading-none">Admin Portal</p>
          <p className="text-xs text-muted-foreground">{user.role ?? "Administrator"}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium leading-none">{user.name || "Administrator"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" size="sm" type="submit">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
