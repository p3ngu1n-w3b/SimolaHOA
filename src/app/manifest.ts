import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.fullName,
    short_name: SITE.name,
    description: SITE.description,
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1F5A45",
    theme_color: "#1F5A45",
    categories: ["lifestyle", "utilities"],
    dir: "ltr",
    lang: "en",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Emergency Contacts", short_name: "Emergency", url: "/emergency-contacts" },
      { name: "Report an Issue", short_name: "Report", url: "/report-an-issue" },
      { name: "Notices", short_name: "Notices", url: "/notices" },
    ],
  };
}
