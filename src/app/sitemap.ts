import type { MetadataRoute } from "next";
import { NAV_ITEMS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const routes = ["/welcome", ...NAV_ITEMS.map((n) => n.href)];
  const unique = Array.from(new Set(routes));

  return unique.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
