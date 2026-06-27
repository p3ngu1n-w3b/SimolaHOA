"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { storeFiles } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import { noticeSchema, faqSchema } from "@/lib/validations";

async function ensureAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function logAction(userId: string | undefined, action: string, entity: string, entityId?: string, meta?: Record<string, unknown>) {
  try {
    await prisma.auditLog.create({
      data: { userId: userId ?? null, action, entity, entityId: entityId ?? null, meta: meta as never },
    });
  } catch {
    // non-critical
  }
}

type Result = { ok: boolean; message: string };

// ---------------------------------------------------------------- Notices
export async function createNotice(form: FormData): Promise<Result> {
  const user = await ensureAuth();
  const parsed = noticeSchema.safeParse({
    title: form.get("title"),
    excerpt: form.get("excerpt"),
    body: form.get("body"),
    category: form.get("category"),
    pinned: form.get("pinned") === "on" || form.get("pinned") === "true",
    published: form.get("published") === "on" || form.get("published") === "true",
    publishAt: form.get("publishAt") || "",
  });
  if (!parsed.success) return { ok: false, message: "Please complete all required fields." };

  const d = parsed.data;
  const slug = `${slugify(d.title)}-${Date.now().toString(36)}`;
  const notice = await prisma.notice.create({
    data: {
      title: d.title,
      slug,
      excerpt: d.excerpt || null,
      body: d.body,
      category: d.category,
      pinned: d.pinned,
      published: d.published,
      publishAt: d.publishAt ? new Date(d.publishAt) : new Date(),
      authorName: user.name || "Estate Office",
    },
  });
  await logAction(user.id, "create", "Notice", notice.id, { title: d.title });
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  return { ok: true, message: "Notice created." };
}

export async function toggleNotice(id: string, field: "pinned" | "published", value: boolean): Promise<Result> {
  const user = await ensureAuth();
  await prisma.notice.update({ where: { id }, data: { [field]: value } });
  await logAction(user.id, "update", "Notice", id, { [field]: value });
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  return { ok: true, message: "Notice updated." };
}

export async function deleteNotice(id: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.notice.delete({ where: { id } });
  await logAction(user.id, "delete", "Notice", id);
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  return { ok: true, message: "Notice deleted." };
}

// ---------------------------------------------------------------- FAQs
export async function createFaq(form: FormData): Promise<Result> {
  const user = await ensureAuth();
  const parsed = faqSchema.safeParse({
    question: form.get("question"),
    answer: form.get("answer"),
    categoryName: form.get("categoryName"),
    featured: form.get("featured") === "on" || form.get("featured") === "true",
    published: form.get("published") === "on" || form.get("published") === "true",
  });
  if (!parsed.success) return { ok: false, message: "Please complete all required fields." };

  const d = parsed.data;
  const category = await prisma.category.upsert({
    where: { slug: slugify(d.categoryName) },
    update: {},
    create: { name: d.categoryName, slug: slugify(d.categoryName), kind: "faq" },
  });
  const faq = await prisma.faq.create({
    data: { question: d.question, answer: d.answer, featured: d.featured, published: d.published, categoryId: category.id },
  });
  await logAction(user.id, "create", "Faq", faq.id);
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true, message: "FAQ created." };
}

export async function deleteFaq(id: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.faq.delete({ where: { id } });
  await logAction(user.id, "delete", "Faq", id);
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  return { ok: true, message: "FAQ deleted." };
}

// ---------------------------------------------------------------- Documents
export async function uploadDocument(form: FormData): Promise<Result> {
  const user = await ensureAuth();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "");
  const library = String(form.get("library") ?? "forms");
  const categoryName = String(form.get("categoryName") ?? "").trim();
  const featured = form.get("featured") === "on" || form.get("featured") === "true";
  const file = form.get("file");

  if (!title) return { ok: false, message: "Title is required." };
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Please choose a file to upload." };

  let stored;
  try {
    [stored] = await storeFiles([file]);
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
  if (!stored) return { ok: false, message: "Upload failed." };

  let categoryId: string | null = null;
  if (categoryName) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(categoryName) },
      update: {},
      create: { name: categoryName, slug: slugify(categoryName), kind: "document" },
    });
    categoryId = category.id;
  }

  const doc = await prisma.document.create({
    data: {
      title,
      description: description || null,
      fileUrl: stored.url,
      fileName: stored.fileName,
      fileSize: stored.size,
      mimeType: stored.mimeType,
      library,
      featured,
      categoryId,
    },
  });
  await logAction(user.id, "create", "Document", doc.id, { title });
  revalidatePath("/admin/documents");
  revalidatePath("/forms");
  revalidatePath("/documents");
  return { ok: true, message: "Document uploaded." };
}

export async function deleteDocument(id: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.document.delete({ where: { id } });
  await logAction(user.id, "delete", "Document", id);
  revalidatePath("/admin/documents");
  revalidatePath("/forms");
  revalidatePath("/documents");
  return { ok: true, message: "Document deleted." };
}

// ---------------------------------------------------------------- Issues
export async function updateIssueStatus(id: string, status: string, adminNotes?: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.issueReport.update({
    where: { id },
    data: { status: status as never, ...(adminNotes !== undefined ? { adminNotes } : {}) },
  });
  await logAction(user.id, "update", "IssueReport", id, { status });
  revalidatePath("/admin/issues");
  return { ok: true, message: "Issue updated." };
}

// ---------------------------------------------------------------- Registrations
export async function updateDomesticWorkerStatus(id: string, status: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.domesticWorker.update({ where: { id }, data: { status: status as never } });
  await logAction(user.id, "update", "DomesticWorker", id, { status });
  revalidatePath("/admin/domestic-workers");
  return { ok: true, message: "Registration updated." };
}

export async function updateContractorStatus(id: string, status: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.contractor.update({ where: { id }, data: { status: status as never } });
  await logAction(user.id, "update", "Contractor", id, { status });
  revalidatePath("/admin/contractors");
  return { ok: true, message: "Contractor updated." };
}

// ---------------------------------------------------------------- Messages
export async function updateMessageStatus(id: string, status: string): Promise<Result> {
  const user = await ensureAuth();
  await prisma.contactMessage.update({ where: { id }, data: { status: status as never } });
  await logAction(user.id, "update", "ContactMessage", id, { status });
  revalidatePath("/admin/messages");
  return { ok: true, message: "Message updated." };
}

// ---------------------------------------------------------------- Users
export async function createUser(form: FormData): Promise<Result> {
  const user = await ensureAuth();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "VIEWER");

  if (!email || !password) return { ok: false, message: "Email and password are required." };
  if (password.length < 8) return { ok: false, message: "Password must be at least 8 characters." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { ok: false, message: "A user with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: { name: name || null, email, passwordHash, role: role as never },
  });
  await logAction(user.id, "create", "User", created.id, { email, role });
  revalidatePath("/admin/users");
  return { ok: true, message: "User created." };
}

export async function toggleUserActive(id: string, active: boolean): Promise<Result> {
  const user = await ensureAuth();
  await prisma.user.update({ where: { id }, data: { active } });
  await logAction(user.id, "update", "User", id, { active });
  revalidatePath("/admin/users");
  return { ok: true, message: "User updated." };
}

export async function deleteUser(id: string): Promise<Result> {
  const user = await ensureAuth();
  if (user.id === id) return { ok: false, message: "You cannot delete your own account." };
  await prisma.user.delete({ where: { id } });
  await logAction(user.id, "delete", "User", id);
  revalidatePath("/admin/users");
  return { ok: true, message: "User deleted." };
}

// ---------------------------------------------------------------- Settings
export async function saveSetting(key: string, value: unknown): Promise<Result> {
  const user = await ensureAuth();
  await prisma.setting.upsert({
    where: { key },
    update: { value: value as never },
    create: { key, value: value as never },
  });
  await logAction(user.id, "update", "Setting", key);
  revalidatePath("/admin/settings");
  return { ok: true, message: "Settings saved." };
}
