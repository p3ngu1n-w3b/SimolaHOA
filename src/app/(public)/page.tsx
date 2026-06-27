import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PhoneCall,
  Bell,
  FileDown,
  HelpCircle,
  MapPin,
  Mail,
  Clock,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/site/reveal";
import { IMAGES, QUICK_ACCESS, SITE, NOTICE_CATEGORIES } from "@/lib/constants";
import { getLatestNotices, getEmergencyContacts, getDocuments, getFaqs } from "@/lib/queries";
import { formatDate, humanize, truncate } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [notices, emergency, forms, faqs] = await Promise.all([
    getLatestNotices(3),
    getEmergencyContacts(),
    getDocuments("forms"),
    getFaqs(),
  ]);

  const topEmergency = ["Estate Security", "Medical", "Fire Department"]
    .map((cat) => emergency.find((e) => e.category === cat))
    .filter(Boolean) as typeof emergency;
  const featuredFaqs = faqs.filter((f) => f.featured).slice(0, 4);
  const featuredForms = forms.slice(0, 4);

  return (
    <>
      {/* 1. Hero Banner */}
      <section className="relative isolate overflow-hidden">
        <Image
          src={IMAGES.hero}
          alt="Simola Estate at golden hour"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2c20]/90 via-[#143b2c]/75 to-[#1f5a45]/40" />
        <div className="container relative z-10 flex min-h-[78vh] flex-col justify-center py-20 text-white">
          <Reveal>
            <Badge variant="gold" className="mb-5 w-fit bg-estate-gold/20 text-estate-gold">
              {SITE.tagline}
            </Badge>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight md:text-6xl">
              Welcome to the Simola Homeowners Association
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">
              Your single destination for estate notices, emergency contacts, rules, registrations
              and support — crafted for gracious, secure estate living on the Garden Route.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href="/report-an-issue">
                  Report an Issue <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/emergency-contacts">
                  <PhoneCall className="h-4 w-4" /> Emergency Contacts
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Welcome Message */}
      <section className="container py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
              A warm welcome
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">Estate living, beautifully managed</h2>
            <p className="mt-4 text-muted-foreground">
              Nestled in the hills above Knysna, Simola is a sanctuary of natural beauty, security and
              community. This resident portal brings everything you need into one elegant, easy-to-use
              place — whether you're reporting a fault at 2am or downloading a building application.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "24/7 Security" },
                { icon: Leaf, label: "Natural Beauty" },
                { icon: MapPin, label: "Garden Route" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-2 rounded-lg border bg-card p-3">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </div>
            <Button asChild variant="link" className="mt-4 px-0">
              <Link href="/welcome">
                Read the Chairman's welcome <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image src={IMAGES.welcome} alt="Estate lifestyle" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Emergency Contacts */}
      <section className="bg-secondary/60 py-16">
        <div className="container">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
                  In an emergency
                </p>
                <h2 className="text-3xl font-bold">Emergency Contacts</h2>
              </div>
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/emergency-contacts">View all</Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topEmergency.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.05}>
                <Card className="h-full">
                  <CardHeader>
                    <Badge variant="gold" className="w-fit">{c.category}</Badge>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="default" className="w-full">
                      <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                        <PhoneCall className="h-4 w-4" /> {c.phone}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Latest Notices */}
      <section className="container py-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
                Stay informed
              </p>
              <h2 className="text-3xl font-bold">Latest Notices</h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/notices">All notices</Link>
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {notices.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.05}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {NOTICE_CATEGORIES.find((c) => c.value === n.category)?.label ?? humanize(String(n.category))}
                    </Badge>
                    {n.pinned && <Badge variant="gold">Pinned</Badge>}
                  </div>
                  <CardTitle className="text-lg">{n.title}</CardTitle>
                  <CardDescription>{formatDate(n.publishAt || n.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <p className="text-sm text-muted-foreground">{n.excerpt || truncate(n.body, 120)}</p>
                  <Button asChild variant="link" className="w-fit px-0">
                    <Link href={`/notices/${n.slug}`}>
                      Read more <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Quick Access Cards */}
      <section className="bg-secondary/60 py-16">
        <div className="container">
          <Reveal>
            <div className="mb-8 text-center">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
                Everything in one place
              </p>
              <h2 className="text-3xl font-bold">Quick Access</h2>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_ACCESS.map((q, i) => (
              <Reveal key={q.href} delay={i * 0.04}>
                <Link href={q.href} className="group block h-full">
                  <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-estate-gold group-hover:shadow-lg">
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                        <q.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{q.title}</CardTitle>
                      <CardDescription>{q.blurb}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Download Centre */}
      <section className="container py-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
                Forms & downloads
              </p>
              <h2 className="text-3xl font-bold">Download Centre</h2>
            </div>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/forms">View all</Link>
            </Button>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredForms.map((d, i) => (
            <Reveal key={d.id} delay={i * 0.04}>
              <Card className="flex h-full flex-col">
                <CardHeader>
                  <FileDown className="mb-2 h-8 w-8 text-estate-gold" />
                  <CardTitle className="text-base">{d.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{d.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild size="sm" variant="secondary" className="w-full">
                    <Link href="/forms">
                      <FileDown className="h-4 w-4" /> Download
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 7. FAQ Preview */}
      <section className="bg-secondary/60 py-16">
        <div className="container max-w-3xl">
          <Reveal>
            <div className="mb-8 text-center">
              <HelpCircle className="mx-auto mb-3 h-8 w-8 text-estate-gold" />
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-2 text-muted-foreground">A few of the questions residents ask most.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible className="rounded-xl border bg-card px-5">
              {featuredFaqs.map((f) => (
                <AccordionItem key={f.id} value={f.id}>
                  <AccordionTrigger>{f.question}</AccordionTrigger>
                  <AccordionContent>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link href="/faqs">View all FAQs</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Contact Information */}
      <section className="container py-16">
        <div className="grid gap-8 rounded-2xl border bg-card p-8 md:grid-cols-2 md:p-12">
          <Reveal>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-estate-gold">
              We're here to help
            </p>
            <h2 className="text-3xl font-bold">Contact the Estate Office</h2>
            <p className="mt-3 text-muted-foreground">
              Our team is available during office hours for all estate-related enquiries.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">
                Get in touch <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="h-5 w-5 text-primary" />
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href={`mailto:${SITE.email}`} className="hover:text-primary">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" />
                <span>
                  {SITE.officeHours.map((o) => (
                    <span key={o.day} className="block text-sm">
                      <strong>{o.day}:</strong> {o.hours}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
