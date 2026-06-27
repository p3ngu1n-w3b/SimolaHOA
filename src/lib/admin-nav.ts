import {
  LayoutDashboard,
  Bell,
  FileText,
  HelpCircle,
  AlertTriangle,
  UserCheck,
  HardHat,
  Mail,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Notices", href: "/admin/notices", icon: Bell },
  { title: "Documents", href: "/admin/documents", icon: FileText },
  { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { title: "Issue Reports", href: "/admin/issues", icon: AlertTriangle },
  { title: "Domestic Workers", href: "/admin/domestic-workers", icon: UserCheck },
  { title: "Contractors", href: "/admin/contractors", icon: HardHat },
  { title: "Contact Messages", href: "/admin/messages", icon: Mail },
  { title: "User Management", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];
