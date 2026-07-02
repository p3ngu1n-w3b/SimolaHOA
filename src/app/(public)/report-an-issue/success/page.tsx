import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Report Submitted",
  description: "Your issue report has been submitted to the Simola HOA office.",
};

export default function IssueSuccessPage() {
  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="p-8 md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold">Report Submitted</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for helping us look after the estate. Your report has been emailed to the
            estate office and a team member will be in touch.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/report-an-issue">Submit Another</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
