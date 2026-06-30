// Static content access layer.
//
// This site has NO database, NO CMS and NO admin. All content lives in
// `src/lib/content.ts` and is updated manually by the developers. These helper
// functions simply normalise that static content into the shapes the pages
// consume, so every page can be statically pre-rendered (great for offline /
// PWA caching).

import {
  EMERGENCY_CONTACTS,
  FAQS,
  KNOWLEDGE,
  NOTICES,
  DOCUMENTS,
} from "@/lib/content";
import { slugify } from "@/lib/utils";

export type EmergencyContactItem = {
  id: string;
  category: string;
  name: string;
  phone: string;
  description: string;
  order: number;
};

export type NoticeItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: string;
  pinned: boolean;
  publishAt: string | null;
  createdAt: string;
  authorName: string | null;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  featured: boolean;
  category: { name: string } | null;
};

export type KnowledgeItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string;
  tags: string[];
  category: { name: string } | null;
};

export type DocumentItem = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  featured: boolean;
  downloadCount: number;
  category: { name: string } | null;
};

export function getEmergencyContacts(): EmergencyContactItem[] {
  return EMERGENCY_CONTACTS.map((c, i) => ({ id: `ec-${i}`, ...c }));
}

export function getPublishedNotices(): NoticeItem[] {
  return NOTICES.map((n, i) => ({
    id: `n-${i}`,
    slug: slugify(n.title),
    title: n.title,
    excerpt: n.excerpt ?? null,
    body: n.body,
    category: n.category,
    pinned: n.pinned,
    publishAt: null,
    createdAt: new Date().toISOString(),
    authorName: "Estate Office",
  }));
}

export function getLatestNotices(limit = 3): NoticeItem[] {
  const all = getPublishedNotices();
  const pinned = all.filter((n) => n.pinned);
  const rest = all.filter((n) => !n.pinned);
  return [...pinned, ...rest].slice(0, limit);
}

export function getNoticeBySlug(slug: string): NoticeItem | undefined {
  return getPublishedNotices().find((n) => n.slug === slug);
}

export function getFaqs(): FaqItem[] {
  return FAQS.map((f, i) => ({
    id: `faq-${i}`,
    question: f.question,
    answer: f.answer,
    featured: f.featured ?? false,
    category: { name: f.category },
  }));
}

export function getKnowledgeArticles(): KnowledgeItem[] {
  return KNOWLEDGE.map((k, i) => ({
    id: `kb-${i}`,
    title: k.title,
    slug: slugify(k.title),
    summary: k.summary ?? null,
    body: k.body,
    tags: k.tags ?? [],
    category: { name: k.category },
  }));
}

export function getDocuments(library?: "forms" | "library"): DocumentItem[] {
  return DOCUMENTS.filter((d) => (library ? d.library === library : true)).map((d, i) => ({
    id: `doc-${i}`,
    title: d.title,
    description: d.description ?? null,
    fileUrl: `/docs/${d.fileName}`,
    fileName: d.fileName,
    fileSize: 245760,
    mimeType: "application/pdf",
    featured: d.featured,
    downloadCount: 0,
    category: { name: d.categorySlug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) },
  }));
}
