import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { DomesticWorkerForm } from "@/components/forms/domestic-worker-form";

export const metadata: Metadata = {
  title: "Domestic Worker Registration",
  description: "Register a domestic worker for access to Simola Estate.",
};

export default function DomesticWorkerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access & Security"
        title="Domestic Worker Registration"
        description="Register your domestic worker so the security team can grant safe, verified access to the estate."
      />
      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardContent className="p-6 md:p-8">
              <DomesticWorkerForm />
            </CardContent>
          </Card>
          <aside>
            <Card className="bg-secondary/40">
              <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-estate-gold" /> Why register?
                </div>
                <p>Registration allows the security team to verify and grant access, keeping the estate safe for everyone.</p>
                <p>Bring the worker's original ID to the office to finalise biometric enrolment.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
