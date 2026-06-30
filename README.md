# Simola Homeowners Association — Mobile App (PWA)

The official **installable mobile app** for the **Simola Homeowners Association (HOA)**. It is a fast, modern, mobile-first **Progressive Web App (PWA)** that gives residents quick access to estate information, important documents and contact details — and lets them submit a few simple forms that are emailed straight to the office.

> **This is an informational app — not a portal or management system.**
> There is **no database, no login, no user accounts, no admin dashboard and no CMS.** All content is maintained by the developers directly in the codebase. Form submissions are delivered **via email** through Netlify Forms.

---

## ✨ What residents can do

- Open the website on their phone and **install it to the home screen** (works like a native app).
- Launch it **full-screen**, with a splash screen and app icon.
- Access key information **offline** (pages they've visited are cached).
- Find **emergency contacts** with one-touch calling.
- Read **notices & alerts**, **rules & guidelines**, **FAQs** and the **self-help centre**.
- **Download documents** (forms, rules, guidelines, constitution, minutes).
- Submit three simple forms — **Report an Issue**, **Domestic Worker Registration**, **Contractor Registration** — plus a **Contact** form. Every submission is emailed to the office.

## 📱 PWA features

- **Web App Manifest** (`app/manifest.ts` → `/manifest.webmanifest`) with name, icons, theme colour, shortcuts and standalone display.
- **App icons** (192/512 + maskable) and **Apple touch icon**.
- **iOS splash screens** for common device sizes.
- **Service worker** (`public/sw.js`) — precaches the app shell, serves visited pages offline (network-first), caches static assets (stale-while-revalidate) and shows an **offline fallback page**.
- **Custom install prompt** that captures `beforeinstallprompt` on Android/Chrome and shows **“Add to Home Screen” instructions** for both iOS (Safari) and Android (Chrome).
- **Mobile splash / status bar** meta for iOS standalone mode.

## 🧱 Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router), fully statically pre-rendered |
| Language | **TypeScript** |
| Styling | **TailwindCSS** + shadcn/ui (Radix primitives) |
| Forms | **React Hook Form** + **Zod** (client validation) → **Netlify Forms** (email) |
| Animation | **Framer Motion** |
| Icons | **Lucide** |
| PWA | Hand-rolled service worker + Web App Manifest |

**No** Prisma, PostgreSQL, Supabase, Firebase, authentication, sessions, user management or API auth — by design.

Brand: Primary Green `#1F5A45`, Secondary Gold `#C6A664`, Accent Gold `#D4AF37`. Headings in **Playfair Display**, body in **Inter**.

---

## 📨 How the forms work (Netlify Forms)

All forms submit directly to **Netlify Forms**, which captures the submission and **emails it** — no server code, no database.

- A static skeleton of every form lives in [`public/__forms.html`](public/__forms.html) so Netlify can detect the forms at build time.
- The React components validate input, then `POST` a `FormData` payload to `/__forms.html` (see `src/lib/submit-form.ts`).
- File uploads (issue photos, contractor documents, worker photo) are supported — one file per field, 8 MB max each.

**To receive submissions by email** (one-time setup in the Netlify dashboard):
1. Deploy the site (forms are auto-detected on the first deploy).
2. Go to **Site configuration → Forms → Form notifications**.
3. Add an **email notification** pointing to the office inbox for each form (`contact`, `report-an-issue`, `domestic-worker-registration`, `contractor-registration`).

Spam is filtered automatically (Akismet + honeypot field).

---

## 🚀 Getting started (local)

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). No environment variables are required for local development.

> Netlify Forms only process submissions on a deployed Netlify site, so form **delivery** is verified after deploy. Locally, the forms validate and show success/empty-state UI.

### Useful scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (fully static) |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint |
| `npm run generate:icons` | Regenerate PWA icons + iOS splash screens (uses `sharp`) |
| `npm run generate:docs` | Regenerate placeholder document PDFs |

---

## ☁️ Deploy to Netlify

`netlify.toml` is preconfigured with the official Next.js runtime.

1. Connect the repository in Netlify (or `npx netlify deploy`).
2. Set `NEXT_PUBLIC_SITE_URL` to your production URL (used for SEO/sitemap).
3. After the first deploy, configure **Form notifications** (see above) so submissions are emailed.

That's the entire setup — no database to provision, no secrets to manage.

---

## 🗂️ Updating content

All content is static and edited by developers:

| Content | Where |
| --- | --- |
| Emergency contacts, notices, FAQs, self-help articles, rules, document list, welcome text | `src/lib/content.ts` |
| Navigation, site details (phone, email, WhatsApp, address, hours) | `src/lib/constants.ts` |
| Downloadable documents | drop the real PDFs into `public/docs/` (filenames match `content.ts`) |
| Images | placeholder Unsplash URLs in `src/lib/constants.ts` (swap for hosted images) |

---

## 🗂️ Project structure

```
public/
  __forms.html          # Netlify Forms detection skeleton (all forms)
  sw.js                 # Service worker (offline + caching)
  icons/                # App icons + iOS splash screens
  docs/                 # Downloadable PDFs (placeholders)
scripts/
  generate-icons.mjs    # Build PWA icons & splash screens
  generate-docs.mjs     # Build placeholder PDFs
src/
  app/
    (public)/           # All informational pages + forms (static)
    offline/            # Offline fallback page
    layout.tsx          # PWA metadata (manifest, icons, splash) + SW register
    manifest.ts sitemap.ts robots.ts
  components/
    ui/                 # shadcn/ui components
    site/               # Navbar, footer, explorers, emergency FAB, etc.
    forms/              # Issue / registration / contact forms (Netlify Forms)
    pwa/                # Service worker registration + install prompt
  lib/                  # content, constants, queries (static), validations,
                        # submit-form, utils
```

---

## ♿ Accessibility & performance

- Fully static pages → fast first load and great offline behaviour.
- Semantic HTML, ARIA labels, keyboard-friendly Radix components, `prefers-reduced-motion` support.
- Optimised fonts (`next/font`) and images (`next/image`).
- Mobile-first, responsive, WCAG-minded colour contrast, dark mode.

---

© Simola Homeowners Association.
