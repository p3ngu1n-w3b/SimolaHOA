import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { IssueReportForm } from "@/components/forms/issue-report-form";
import { ISSUE_CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Report an Issue",
  description: "Log a maintenance, security or community issue at Simola Estate. Attach photos and your GPS location for a faster response.",
};

export default function ReportIssuePage() {
  return (
    <>
      <PageHeader
        eyebrow="Maintenance & Security"
        title="Report an Issue"
        description="Help us keep the estate running beautifully. Submit a report and you'll receive a unique reference number to track progress."
      />

      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardContent className="p-6 md:p-8">
              <IssueReportForm />
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-6 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Info className="h-4 w-4 text-estate-gold" /> What you can report
                </div>
                <ul className="space-y-1.5 text-muted-foreground">
                  {ISSUE_CATEGORIES.map((c) => (
                    <li key={c.value} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-estate-gold" />
                      {c.label}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-destructive/40 bg-destructive/5">
              <CardContent className="p-6 text-sm">
                <p className="font-semibold text-destructive">Is this an emergency?</p>
                <p className="mt-1 text-muted-foreground">
                  For security or medical emergencies, call the Control Room immediately rather than
                  using this form.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
