import Link from "next/link";
import { CheckCircle2, Home, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function IssueSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="p-8 md:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="text-2xl font-bold">Report Submitted</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for helping us look after the estate. The office has been notified and will be
            in touch.
          </p>

          {ref && (
            <div className="mt-6 rounded-lg border bg-muted/40 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Your reference number</p>
              <Badge variant="gold" className="mt-2 text-base">
                <ClipboardCheck className="mr-1.5 h-4 w-4" /> {ref}
              </Badge>
              <p className="mt-2 text-xs text-muted-foreground">
                Please quote this reference for any follow-up.
              </p>
            </div>
          )}

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
