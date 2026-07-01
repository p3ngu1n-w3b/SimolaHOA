import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/pwa/sw-register";
import { SITE } from "@/lib/constants";

const splash = (file: string, w: number, h: number, ratio: number) => ({
  url: `/icons/${file}`,
  media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.fullName} | Resident Portal`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Simola",
    "HOA",
    "Homeowners Association",
    "estate",
    "Knysna",
    "estate notices",
    "estate rules",
    "emergency contacts",
  ],
  authors: [{ name: SITE.fullName }],
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "black-translucent",
    startupImage: [
      splash("splash-1170x2532.png", 390, 844, 3),
      splash("splash-1284x2778.png", 428, 926, 3),
      splash("splash-1125x2436.png", 375, 812, 3),
      splash("splash-828x1792.png", 414, 896, 2),
      splash("splash-750x1334.png", 375, 667, 2),
      splash("splash-1242x2208.png", 414, 736, 3),
      splash("splash-1536x2048.png", 768, 1024, 2),
    ],
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: `${SITE.fullName} | Resident Portal`,
    description: SITE.description,
    siteName: SITE.fullName,
    url: siteUrl,
    images: [
      {
        url: "/branding/simola-banner.png",
        width: 1024,
        height: 215,
        alt: SITE.fullName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.fullName,
    description: SITE.description,
    images: ["/branding/simola-banner.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1F5A45" },
    { media: "(prefers-color-scheme: dark)", color: "#15402f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster richColors closeButton />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
