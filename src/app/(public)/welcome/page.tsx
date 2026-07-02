import type { Metadata } from "next";
import Image from "next/image";
import { Quote, Eye, Building2, Clock, Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/site/reveal";
import { WELCOME } from "@/lib/content";
import { SITE, IMAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Chairman's welcome, vision, purpose and office information for the Simola Homeowners Association.",
};

export default function WelcomePage() {
  return (
    <>
      <PageHeader
        showBrand
        eyebrow="Welcome to Simola"
        title="A warm welcome to our estate"
        description="Discover the vision, purpose and people behind the Simola Homeowners Association."
      />

      <section className="container py-14">
        <Reveal>
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-[1.4fr_1fr]">
              <CardContent className="p-8 md:p-10">
                <Quote className="mb-4 h-10 w-10 text-estate-gold" />
                <h2 className="text-2xl font-bold">Chairman's Welcome</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{WELCOME.chairman.message}</p>
                <div className="mt-6">
                  <p className="font-serif text-lg font-semibold">{WELCOME.chairman.name}</p>
                  <p className="text-sm text-estate-gold">{WELCOME.chairman.title}</p>
                </div>
              </CardContent>
              <div className="relative min-h-[260px]">
                <Image src={IMAGES.estate} alt="Simola Estate" fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
              </div>
            </div>
          </Card>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <Eye className="h-8 w-8 text-primary" />
                <CardTitle>HOA Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{WELCOME.vision}</CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <Building2 className="h-8 w-8 text-primary" />
                <CardTitle>Estate Purpose</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{WELCOME.purpose}</CardContent>
            </Card>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <CardHeader>
                <Clock className="h-8 w-8 text-primary" />
                <CardTitle>Estate Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {WELCOME.officeHours.map((o) => (
                    <li key={o.day} className="flex justify-between py-2.5 text-sm">
                      <span className="font-medium">{o.day}</span>
                      <span className="text-muted-foreground">{o.hours}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-estate-gold" />
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-primary">{SITE.phone}</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-estate-gold" />
                    <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-estate-gold" />
                    {SITE.address}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary" />
                <CardTitle>Estate Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
                  <div>
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-estate-gold" />
                    Estate map placeholder
                    <p className="mt-1 text-xs">The official estate map will be published here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
