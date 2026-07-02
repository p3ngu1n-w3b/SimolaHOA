import type { Metadata } from "next";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact the Simola Homeowners Association estate office — phone, email, WhatsApp and office hours.",
};

export default function ContactPage() {
  const waNumber = SITE.whatsapp.replace(/[^0-9]/g, "");
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Reach the estate office during business hours. For emergencies, use the emergency contacts page."
      />
      <section className="container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estate Office</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-estate-gold" /> {SITE.address}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-estate-gold" />
                  <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-primary">{SITE.phone}</a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-estate-gold" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a>
                </p>
                <Button asChild variant="gold" className="w-full">
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-estate-gold" /> Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y text-sm">
                  {SITE.officeHours.map((o) => (
                    <li key={o.day} className="flex justify-between py-2">
                      <span className="font-medium">{o.day}</span>
                      <span className="text-muted-foreground">{o.hours}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="flex aspect-[21/9] items-center justify-center border-2 border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
            <div>
              <MapPin className="mx-auto mb-2 h-8 w-8 text-estate-gold" />
              Google Maps placeholder
              <p className="mt-1 text-xs">Embed the estate location map here via the admin portal.</p>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
