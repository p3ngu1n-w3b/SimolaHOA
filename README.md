# Simola Homeowners Association — Resident Portal

A modern, mobile-first resident portal and CMS for the **Simola Homeowners Association (HOA)**. It combines a premium public estate website with a secure admin portal for managing notices, documents, FAQs, issue reports and registrations.

Built to feel **luxurious, trustworthy and effortless** — even for older residents on a phone.

---

## ✨ Features

**Public website**
- Hero home page with welcome, emergency contacts, latest notices, quick access, download centre, FAQ preview & contact
- **Emergency Contacts** with one-touch call buttons + sticky emergency FAB
- **Report an Issue** system — photos, GPS capture, unique reference numbers, email notification & success page
- **Rules & Guidelines** — searchable, sectioned (conduct / building / environmental / architectural)
- **Domestic Worker** & **Contractor** registration with file uploads
- **Self Help Centre** knowledge base — accordion UI, categories, related articles, search
- **Notices & Alerts** — categories, pinned notices, search, scheduled publishing, detail pages
- **Forms & Downloads** + **Document Library** — search, preview, download tracking
- **FAQs** — featured questions, categories, search, accordion
- **Contact** — form, office hours, WhatsApp button, Google Maps placeholder
- Dark mode, SEO metadata, sitemap, robots.txt, web manifest, skeleton loaders, toasts, animations

**Admin portal** (`/admin`)
- Secure email/password login (NextAuth / Auth.js v5)
- Dashboard widgets: total reports, open issues, downloads, registrations, recent activity
- Manage Notices, Documents, FAQs, Issue Reports (status tracking), Domestic Workers, Contractors, Contact Messages, Users (roles) & Settings
- Audit logging of admin actions

---

## 🧱 Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router) + React 18 |
| Language | **TypeScript** |
| Styling | **TailwindCSS** + shadcn/ui (Radix primitives) |
| Forms | **React Hook Form** + **Zod** |
| Animation | **Framer Motion** |
| Icons | **Lucide** |
| Database | **PostgreSQL** + **Prisma ORM** |
| Auth | **NextAuth / Auth.js v5** (credentials) |
| State | **Zustand** (available for client state) |
| Uploads | Self-hosted file storage (`/public/uploads`) — UploadThing-style abstraction in `src/lib/upload.ts` |
| Notifications | Toasts via **Sonner**; email via optional SMTP (falls back to console) |

Brand palette: Primary Green `#1F5A45`, Secondary Gold `#C6A664`, Accent Gold `#D4AF37`. Headings in **Playfair Display**, body in **Inter**.

---

## 🚀 Getting Started (local)

### Prerequisites
- Node.js 20+ (22 recommended)
- A PostgreSQL database

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and set at least `DATABASE_URL` and `AUTH_SECRET` (generate with `openssl rand -base64 32`).

### 3. Set up the database
```bash
npm run db:push     # create tables from the Prisma schema
npm run db:seed     # seed categories, notices, FAQs, contacts, docs + admin user
```

### 4. Run the dev server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000).

**Admin login:** `admin@simolahoa.co.za` / `ChangeMe123!` (configurable via `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`). Go to [/admin](http://localhost:3000/admin).

> The public site is resilient: if the database is unavailable, pages gracefully fall back to built-in default content so the site never hard-fails.

---

## 🐳 Docker

A multi-stage production image and a Compose stack (app + Postgres) are included.

```bash
# Build & run the full stack (Postgres + app)
AUTH_SECRET="$(openssl rand -base64 32)" docker compose up --build
```

The container entrypoint automatically applies the schema (`prisma db push`) and ensures an admin user exists on first boot. App available on [http://localhost:3000](http://localhost:3000).

To seed full demo content inside Docker:
```bash
docker compose exec app node scripts/create-admin.mjs   # admin + settings only
```
(For the complete content seed, run `npm run db:seed` against the database from a dev environment.)

---

## ☁️ Deploy to Netlify

`netlify.toml` is preconfigured with the official Next.js runtime. Set these environment variables in the Netlify dashboard:

- `DATABASE_URL` — your managed Postgres connection string
- `AUTH_SECRET` — long random string
- `NEXT_PUBLIC_SITE_URL` — your production URL
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`

The build runs `prisma db push` to sync the schema. Run the seed once from your machine (pointed at the production DB) to create the admin user and demo content.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Generate Prisma client + production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint |
| `npm run db:push` | Push schema to the database |
| `npm run db:migrate` | Create a migration (dev) |
| `npm run db:seed` | Seed demo data + admin user |
| `npm run db:studio` | Open Prisma Studio |

---

## 🗂️ Project Structure

```
prisma/
  schema.prisma        # All models: User, Notice, Category, Document, Faq,
                       # KnowledgeArticle, IssueReport, DomesticWorker,
                       # Contractor, ContactMessage, EmergencyContact,
                       # Setting, AuditLog (+ Auth tables)
  seed.ts              # Demo data + admin user
scripts/
  create-admin.mjs     # Plain-Node admin bootstrap (Docker)
src/
  app/
    (public)/          # Public website (route group with shared layout)
    admin/             # Admin portal (login + dashboard route group)
    actions/           # Server actions (public forms, admin CRUD, auth)
    api/auth/          # NextAuth route handler
    sitemap.ts robots.ts manifest.ts
  components/
    ui/                # shadcn/ui component library
    site/              # Navbar, footer, explorers, page header, etc.
    admin/             # Admin tables, managers, widgets
    forms/             # Issue / registration / contact forms
  lib/                 # prisma, auth, validations, queries, content,
                       # upload, email, constants, utils
```

---

## 🔐 Database Models

`User`, `Account`, `Session`, `VerificationToken`, `Category`, `Notice`, `Document`, `Faq`, `KnowledgeArticle`, `IssueReport`, `DomesticWorker`, `Contractor`, `ContactMessage`, `EmergencyContact`, `Setting`, `AuditLog`.

---

## 🖼️ Images

Placeholder estate/lifestyle/nature/security/golf imagery is loaded from Unsplash (see `src/lib/constants.ts`) and can be replaced via the admin portal / CMS. Remote hosts are allow-listed in `next.config.mjs`.

---

## ♿ Accessibility & Performance

- Semantic HTML, ARIA labels, keyboard-friendly Radix components
- Respects `prefers-reduced-motion`
- Optimised fonts (`next/font`) and images (`next/image`)
- Mobile-first, fully responsive, WCAG-minded colour contrast

---

## 📝 Notes

- **Email:** configure `SMTP_*` env vars and install `nodemailer` to enable real delivery; otherwise notifications are logged to the server console.
- **Uploads:** stored on local disk by default (`/public/uploads`). For serverless/multi-instance deploys, swap `src/lib/upload.ts` for object storage (e.g. Netlify Blobs, S3, UploadThing).
- Change the seeded admin password immediately in any real deployment.

---

© Simola Homeowners Association.
