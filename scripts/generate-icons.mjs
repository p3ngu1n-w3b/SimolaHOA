// Generates PWA app icons + iOS splash screens from a simple vector source.
// Run with: npm run generate:icons  (requires `sharp`, a devDependency)
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "icons");
const GREEN = "#1F5A45";
const GREEN_DARK = "#15402F";
const GOLD = "#C6A664";

function iconSvg(size, { maskable = false } = {}) {
  // Maskable icons need a safe zone: keep the glyph within the inner ~80%.
  const pad = maskable ? size * 0.16 : size * 0.08;
  const ring = (size - pad * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const font = ring * 1.05;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${GREEN_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${maskable ? 0 : size * 0.2}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${ring}" fill="none" stroke="${GOLD}" stroke-width="${size * 0.03}"/>
  <text x="${cx}" y="${cy + font * 0.36}" font-family="Georgia, 'Times New Roman', serif" font-size="${font}" font-weight="700" fill="#ffffff" text-anchor="middle">S</text>
</svg>`;
}

function splashSvg(w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.14;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${GREEN}"/>
      <stop offset="1" stop-color="${GREEN_DARK}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy - r * 0.4}" r="${r}" fill="none" stroke="${GOLD}" stroke-width="${r * 0.08}"/>
  <text x="${cx}" y="${cy - r * 0.4 + r * 0.38}" font-family="Georgia, serif" font-size="${r}" font-weight="700" fill="#ffffff" text-anchor="middle">S</text>
  <text x="${cx}" y="${cy + r * 1.3}" font-family="Georgia, serif" font-size="${Math.min(w, h) * 0.05}" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="6">SIMOLA</text>
  <text x="${cx}" y="${cy + r * 1.9}" font-family="Arial, sans-serif" font-size="${Math.min(w, h) * 0.022}" fill="${GOLD}" text-anchor="middle" letter-spacing="6">HOMEOWNERS ASSOCIATION</text>
</svg>`;
}

async function png(svg, file) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, file));
  console.log("  ✓", file);
}

// iOS splash device sizes (portrait, device pixels)
const SPLASHES = [
  [1170, 2532], // iPhone 12/13/14 Pro
  [1284, 2778], // iPhone Pro Max
  [1125, 2436], // iPhone X/XS/11 Pro
  [828, 1792], // iPhone XR/11
  [750, 1334], // iPhone SE/8
  [1242, 2208], // iPhone 8 Plus
  [1536, 2048], // iPad
];

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log("Generating app icons…");
  await png(iconSvg(192), "icon-192.png");
  await png(iconSvg(512), "icon-512.png");
  await png(iconSvg(512, { maskable: true }), "icon-maskable-512.png");
  await png(iconSvg(180), "apple-touch-icon.png");
  await png(iconSvg(32), "favicon-32.png");

  console.log("Generating iOS splash screens…");
  for (const [w, h] of SPLASHES) {
    await png(splashSvg(w, h), `splash-${w}x${h}.png`);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
