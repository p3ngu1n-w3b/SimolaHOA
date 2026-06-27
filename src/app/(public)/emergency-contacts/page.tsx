import type { Metadata } from "next";
import { PhoneCall, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/reveal";
import { getEmergencyContacts } from "@/lib/queries";
import { EMERGENCY_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emergency Contacts",
  description: "One-touch emergency contact numbers for Simola Estate — security, medical, fire, municipal and after-hours.",
};

export default async function EmergencyContactsPage() {
  const contacts = await getEmergencyContacts();
  const grouped = EMERGENCY_CATEGORIES.map((cat) => ({
    category: cat,
    items: contacts.filter((c) => c.category === cat),
  })).filter((g) => g.items.length);

  return (
    <>
      <PageHeader
        eyebrow="Emergency"
        title="Emergency Contacts"
        description="Tap any number below to call instantly from your mobile. In a life-threatening emergency, always call security and emergency services."
      >
        <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 text-sm">
          <ShieldAlert className="h-5 w-5 text-estate-gold" />
          Save the Security Control Room number to your phone now.
        </div>
      </PageHeader>

      <section className="container py-12">
        <div className="space-y-10">
          {grouped.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 0.04}>
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{group.category}</h2>
                  <span className="h-px flex-1 gold-divider" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((c) => (
                    <Card key={c.id} className="flex h-full flex-col">
                      <CardHeader>
                        <Badge variant="gold" className="w-fit">{c.category}</Badge>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        {c.description && <CardDescription>{c.description}</CardDescription>}
                      </CardHeader>
                      <CardContent className="mt-auto">
                        <Button asChild className="w-full" size="lg">
                          <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                            <PhoneCall className="h-5 w-5" /> {c.phone}
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
