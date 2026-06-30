// Generates simple, valid placeholder PDF documents so the Document Library /
// Forms pages have working downloads out of the box. Developers replace these
// with the real estate documents (same filenames) when ready.
// Run with: npm run generate:docs
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "docs");

const DOCS = [
  ["new-owner-form.pdf", "New Owner / Resident Form"],
  ["domestic-worker-registration.pdf", "Domestic Worker Registration Form"],
  ["contractor-registration.pdf", "Contractor Registration Form"],
  ["drc-building-application.pdf", "Building Plan Submission (DRC)"],
  ["estate-conduct-rules.pdf", "Estate Conduct Rules"],
  ["architectural-guidelines.pdf", "Architectural Guidelines"],
  ["hoa-constitution.pdf", "HOA Constitution"],
  ["agm-minutes.pdf", "AGM Minutes"],
];

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(title) {
  const lines = [
    `BT /F1 22 Tf 72 760 Td (${esc("Simola Homeowners Association")} ) Tj ET`,
    `BT /F1 16 Tf 72 720 Td (${esc(title)}) Tj ET`,
    `BT /F1 11 Tf 72 690 Td (${esc("Placeholder document. The estate office will provide the final version.")}) Tj ET`,
  ].join("\n");
  const content = `${lines}`;

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((off) => {
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const [file, title] of DOCS) {
    await writeFile(path.join(OUT, file), buildPdf(title));
    console.log("  ✓", file);
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
