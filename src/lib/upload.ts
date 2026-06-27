import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_MB = Number(process.env.MAX_UPLOAD_MB || 10);
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export type StoredFile = {
  url: string;
  fileName: string;
  size: number;
  mimeType: string;
};

/**
 * Persist an uploaded File to local disk under /public/uploads and return a
 * public URL. This is the self-hosted alternative to UploadThing and keeps the
 * app deployable via Docker without third-party services. In serverless
 * environments, swap this implementation for blob storage.
 */
export async function storeFile(file: File): Promise<StoredFile> {
  if (file.size > MAX_MB * 1024 * 1024) {
    throw new Error(`File exceeds the ${MAX_MB}MB limit.`);
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    throw new Error("Unsupported file type.");
  }

  const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
  const absDir = path.join(process.cwd(), uploadDir);
  await mkdir(absDir, { recursive: true });

  const ext = path.extname(file.name) || mimeExt(file.type);
  const safeBase = path
    .basename(file.name, path.extname(file.name))
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const fileName = `${safeBase || "file"}-${randomUUID().slice(0, 8)}${ext}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(absDir, fileName), bytes);

  const publicBase = uploadDir.replace(/^public/, "");
  return {
    url: `${publicBase}/${fileName}`.replace(/\/+/g, "/"),
    fileName: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
  };
}

export async function storeFiles(files: File[]): Promise<StoredFile[]> {
  const valid = files.filter((f) => f && f.size > 0);
  return Promise.all(valid.map((f) => storeFile(f)));
}

function mimeExt(mime: string) {
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}
