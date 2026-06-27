import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { Logo } from "@/components/site/logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-primary text-white">
      <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo variant="light" />
          <p className="max-w-xs text-sm text-white/70">{SITE.description}</p>
          <div className="gold-divider h-px w-24" />
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg text-estate-gold">Quick Links</h3>
          <ul className="grid grid-cols-1 gap-2 text-sm text-white/80">
            {NAV_ITEMS.slice(0, 8).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-estate-gold">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg text-estate-gold">More</h3>
          <ul className="grid grid-cols-1 gap-2 text-sm text-white/80">
            {NAV_ITEMS.slice(8).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-estate-gold">
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="transition-colors hover:text-estate-gold">
                Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-lg text-estate-gold">Contact</h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-estate-gold" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-estate-gold" />
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-estate-gold">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-estate-gold" />
              <a href={`mailto:${SITE.email}`} className="hover:text-estate-gold">
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-estate-gold" />
              <span>Mon–Fri 08:00–16:30</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <p>Built for residents — beautifully managed estate living.</p>
        </div>
      </div>
    </footer>
  );
}
