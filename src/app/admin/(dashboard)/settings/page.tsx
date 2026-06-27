import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/prisma";
import { AdminPageTitle } from "@/components/admin/page-title";
import { SettingsForm } from "@/components/admin/settings-form";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function AdminSettingsPage() {
  const setting = await safeQuery(
    () => prisma.setting.findUnique({ where: { key: "site" } }),
    null
  );
  const initial = (setting?.value as Record<string, string>) ?? {
    email: SITE.email,
    phone: SITE.phone,
    whatsapp: SITE.whatsapp,
    address: SITE.address,
  };
  return (
    <div>
      <AdminPageTitle title="Settings" description="Configure site-wide contact details and content." />
      <SettingsForm initial={initial} />
    </div>
  );
}
