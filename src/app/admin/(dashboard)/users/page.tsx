import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { AdminPageTitle } from "@/components/admin/page-title";
import { UserManager } from "@/components/admin/user-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "User Management", robots: { index: false } };

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await safeQuery(
    () =>
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),
    []
  );
  return (
    <div>
      <AdminPageTitle title="User Management" description="Manage administrator accounts and access." />
      <UserManager users={users} currentUserId={session?.user?.id} />
    </div>
  );
}
