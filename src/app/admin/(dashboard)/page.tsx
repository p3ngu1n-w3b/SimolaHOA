import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  FolderOpen,
  Download,
  UserCheck,
  Bell,
  HardHat,
  Mail,
  Activity,
  ArrowRight,
} from "lucide-react";
import { prisma, safeQuery } from "@/lib/prisma";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, humanize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function AdminDashboardPage() {
  const [
    totalIssues,
    openIssues,
    downloads,
    domesticCount,
    contractorCount,
    notices,
    newMessages,
    recent,
  ] = await Promise.all([
    safeQuery(() => prisma.issueReport.count(), 0),
    safeQuery(() => prisma.issueReport.count({ where: { status: { in: ["SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS"] } } }), 0),
    safeQuery(() => prisma.document.aggregate({ _sum: { downloadCount: true } }), { _sum: { downloadCount: 0 } }),
    safeQuery(() => prisma.domesticWorker.count(), 0),
    safeQuery(() => prisma.contractor.count(), 0),
    safeQuery(() => prisma.notice.count({ where: { published: true } }), 0),
    safeQuery(() => prisma.contactMessage.count({ where: { status: "NEW" } }), 0),
    safeQuery(
      () => prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { user: true } }),
      []
    ),
  ]);

  const registrations = domesticCount + contractorCount;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">An overview of estate activity and submissions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Reports" value={totalIssues} icon={AlertTriangle} href="/admin/issues" accent="primary" />
        <StatCard label="Open Issues" value={openIssues} icon={FolderOpen} href="/admin/issues" accent="amber" />
        <StatCard label="Downloads" value={downloads._sum.downloadCount ?? 0} icon={Download} href="/admin/documents" accent="gold" />
        <StatCard label="Registrations" value={registrations} icon={UserCheck} href="/admin/domestic-workers" accent="emerald" />
        <StatCard label="New Messages" value={newMessages} icon={Mail} href="/admin/messages" accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-estate-gold" /> Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No activity yet. Actions you take in the admin portal will appear here.
              </p>
            ) : (
              <ul className="divide-y">
                {recent.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Badge variant={log.action === "delete" ? "destructive" : log.action === "create" ? "success" : "secondary"}>
                        {humanize(log.action)}
                      </Badge>
                      <span>
                        <strong>{humanize(log.entity)}</strong>
                        <span className="text-muted-foreground"> by {log.user?.name || log.user?.email || "system"}</span>
                      </span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Publish a notice", href: "/admin/notices", icon: Bell },
              { label: "Upload a document", href: "/admin/documents", icon: FolderOpen },
              { label: "Review issue reports", href: "/admin/issues", icon: AlertTriangle },
              { label: "Manage contractors", href: "/admin/contractors", icon: HardHat },
            ].map((a) => (
              <Button key={a.href} asChild variant="outline" className="w-full justify-between">
                <Link href={a.href}>
                  <span className="flex items-center gap-2">
                    <a.icon className="h-4 w-4 text-estate-gold" /> {a.label}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ))}
            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              Published notices: <strong className="text-foreground">{notices}</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
