import type { Metadata } from "next";
import { HardHat } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ContractorForm } from "@/components/forms/contractor-form";

export const metadata: Metadata = {
  title: "Contractor Registration",
  description: "Register a contractor for work on Simola Estate, including staff and vehicle details.",
};

export default function ContractorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Building & Access"
        title="Contractor Registration"
        description="Register your company before commencing work on the estate. All contractors must be approved and comply with the estate building rules."
      />
      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardContent className="p-6 md:p-8">
              <ContractorForm />
            </CardContent>
          </Card>
          <aside>
            <Card className="bg-secondary/40">
              <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <HardHat className="h-4 w-4 text-estate-gold" /> Before you start
                </div>
                <p>Construction hours: Mon–Fri 07:00–17:00, Sat 08:00–13:00. No work on Sundays or public holidays.</p>
                <p>A refundable building deposit and site hoarding are required before site handover.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
