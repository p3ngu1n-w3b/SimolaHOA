import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  EMERGENCY_CONTACTS,
  FAQS,
  KNOWLEDGE,
  NOTICES,
  DOCUMENTS,
  DOCUMENT_CATEGORIES,
} from "../src/lib/content";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function main() {
  console.log("🌱 Seeding Simola HOA database…");

  // -- Admin user --------------------------------------------------------
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@simolahoa.co.za").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", active: true },
    create: { email, name: "Estate Administrator", passwordHash, role: "ADMIN" },
  });
  console.log(`  ✓ Admin user: ${email}`);

  // -- Emergency contacts ------------------------------------------------
  await prisma.emergencyContact.deleteMany();
  await prisma.emergencyContact.createMany({ data: EMERGENCY_CONTACTS });
  console.log(`  ✓ ${EMERGENCY_CONTACTS.length} emergency contacts`);

  // -- Categories --------------------------------------------------------
  const docCategories: Record<string, string> = {};
  for (const c of DOCUMENT_CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { name: c.name, slug: c.slug, kind: c.kind },
    });
    docCategories[c.slug] = cat.id;
  }

  // -- Notices -----------------------------------------------------------
  for (const n of NOTICES) {
    const slug = slugify(n.title);
    await prisma.notice.upsert({
      where: { slug },
      update: {},
      create: {
        title: n.title,
        slug,
        excerpt: n.excerpt,
        body: n.body,
        category: n.category as never,
        pinned: n.pinned,
        published: true,
        publishAt: new Date(),
        authorName: "Estate Office",
      },
    });
  }
  console.log(`  ✓ ${NOTICES.length} notices`);

  // -- FAQ categories + FAQs --------------------------------------------
  for (const f of FAQS) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(f.category) },
      update: {},
      create: { name: f.category, slug: slugify(f.category), kind: "faq" },
    });
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({
        data: { question: f.question, answer: f.answer, featured: f.featured ?? false, categoryId: category.id },
      });
    }
  }
  console.log(`  ✓ ${FAQS.length} FAQs`);

  // -- Knowledge base ----------------------------------------------------
  for (const k of KNOWLEDGE) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(k.category) },
      update: {},
      create: { name: k.category, slug: slugify(k.category), kind: "knowledge" },
    });
    const slug = slugify(k.title);
    await prisma.knowledgeArticle.upsert({
      where: { slug },
      update: {},
      create: { title: k.title, slug, summary: k.summary, body: k.body, tags: k.tags ?? [], categoryId: category.id },
    });
  }
  console.log(`  ✓ ${KNOWLEDGE.length} knowledge articles`);

  // -- Documents ---------------------------------------------------------
  for (const d of DOCUMENTS) {
    const existing = await prisma.document.findFirst({ where: { title: d.title } });
    if (!existing) {
      await prisma.document.create({
        data: {
          title: d.title,
          description: d.description,
          fileUrl: `/sample-docs/${d.fileName}`,
          fileName: d.fileName,
          fileSize: 245760,
          mimeType: "application/pdf",
          library: d.library,
          featured: d.featured,
          categoryId: docCategories[d.categorySlug] ?? null,
        },
      });
    }
  }
  console.log(`  ✓ ${DOCUMENTS.length} documents`);

  // -- Default settings --------------------------------------------------
  await prisma.setting.upsert({
    where: { key: "site" },
    update: {},
    create: {
      key: "site",
      value: {
        email: "office@simolahoa.co.za",
        phone: "+27 44 302 9700",
        whatsapp: "+27 82 000 0000",
        address: "Simola Estate, Old Cape Road, Knysna, 6571, South Africa",
      },
    },
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
