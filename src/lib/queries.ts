import { prisma, safeQuery } from "@/lib/prisma";
import {
  EMERGENCY_CONTACTS,
  FAQS,
  KNOWLEDGE,
  NOTICES,
  DOCUMENTS,
} from "@/lib/content";

// These queries gracefully fall back to static default content when the DB is
// unavailable, so the public site and `next build` never hard-fail.

export async function getEmergencyContacts() {
  const rows = await safeQuery(
    () => prisma.emergencyContact.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    []
  );
  if (rows.length) return rows;
  return EMERGENCY_CONTACTS.map((c, i) => ({ id: `fallback-${i}`, ...c, createdAt: new Date(), updatedAt: new Date() }));
}

export async function getPublishedNotices(opts?: { category?: string; query?: string }) {
  const now = new Date();
  const rows = await safeQuery(
    () =>
      prisma.notice.findMany({
        where: {
          published: true,
          OR: [{ publishAt: null }, { publishAt: { lte: now } }],
          ...(opts?.category ? { category: opts.category as never } : {}),
          ...(opts?.query
            ? { OR: [{ title: { contains: opts.query, mode: "insensitive" } }, { body: { contains: opts.query, mode: "insensitive" } }] }
            : {}),
        },
        orderBy: [{ pinned: "desc" }, { publishAt: "desc" }, { createdAt: "desc" }],
      }),
    []
  );
  if (rows.length) return rows;
  return NOTICES.filter((n) => {
    if (opts?.category && n.category !== opts.category) return false;
    if (opts?.query) {
      const q = opts.query.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
    }
    return true;
  }).map((n, i) => ({
    id: `fallback-${i}`,
    slug: n.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: n.title,
    excerpt: n.excerpt,
    body: n.body,
    category: n.category as never,
    pinned: n.pinned,
    published: true,
    publishAt: new Date(),
    expiresAt: null,
    imageUrl: null,
    authorName: "Estate Office",
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getLatestNotices(limit = 3) {
  const all = await getPublishedNotices();
  return all.slice(0, limit);
}

export async function getFaqs() {
  const rows = await safeQuery(
    () => prisma.faq.findMany({ where: { published: true }, include: { category: true }, orderBy: [{ order: "asc" }] }),
    []
  );
  if (rows.length) return rows;
  return FAQS.map((f, i) => ({
    id: `fallback-${i}`,
    question: f.question,
    answer: f.answer,
    featured: f.featured ?? false,
    published: true,
    order: i,
    categoryId: null,
    category: { id: f.category, name: f.category, slug: f.category.toLowerCase(), description: null, kind: "faq", icon: null, order: 0, createdAt: new Date(), updatedAt: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getKnowledgeArticles() {
  const rows = await safeQuery(
    () => prisma.knowledgeArticle.findMany({ where: { published: true }, include: { category: true }, orderBy: [{ order: "asc" }] }),
    []
  );
  if (rows.length) return rows;
  return KNOWLEDGE.map((k, i) => ({
    id: `fallback-${i}`,
    title: k.title,
    slug: k.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    summary: k.summary,
    body: k.body,
    tags: k.tags ?? [],
    published: true,
    order: i,
    categoryId: null,
    category: { id: k.category, name: k.category, slug: k.category.toLowerCase(), description: null, kind: "knowledge", icon: null, order: 0, createdAt: new Date(), updatedAt: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function getDocuments(library?: "forms" | "library") {
  const rows = await safeQuery(
    () =>
      prisma.document.findMany({
        where: { published: true, ...(library ? { library } : {}) },
        include: { category: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      }),
    []
  );
  if (rows.length) return rows;
  return DOCUMENTS.filter((d) => (library ? d.library === library : true)).map((d, i) => ({
    id: `fallback-${i}`,
    title: d.title,
    description: d.description,
    fileUrl: "#",
    fileName: d.fileName,
    fileSize: 240000,
    mimeType: "application/pdf",
    library: d.library,
    featured: d.featured,
    published: true,
    downloadCount: 0,
    categoryId: null,
    category: { id: d.categorySlug, name: d.categorySlug, slug: d.categorySlug, description: null, kind: "document", icon: null, order: 0, createdAt: new Date(), updatedAt: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}
