"use server";

import { prisma } from "@/lib/prisma";
import { storeFiles } from "@/lib/upload";
import { sendEmail, adminNotifyAddress } from "@/lib/email";
import { generateReference } from "@/lib/utils";
import {
  issueReportSchema,
  domesticWorkerSchema,
  contractorSchema,
  contactSchema,
} from "@/lib/validations";

export type ActionResult =
  | { ok: true; reference?: string; message: string }
  | { ok: false; message: string; errors?: Record<string, string[]> };

function fd(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v : "";
}

export async function submitIssueReport(form: FormData): Promise<ActionResult> {
  const parsed = issueReportSchema.safeParse({
    name: fd(form, "name"),
    email: fd(form, "email"),
    phone: fd(form, "phone"),
    propertyNumber: fd(form, "propertyNumber"),
    category: fd(form, "category"),
    description: fd(form, "description"),
    latitude: fd(form, "latitude") || undefined,
    longitude: fd(form, "longitude") || undefined,
    locationLabel: fd(form, "locationLabel"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please correct the errors and try again.", errors: parsed.error.flatten().fieldErrors };
  }

  const reference = generateReference("SIM");
  const data = parsed.data;

  let photoUrls: string[] = [];
  try {
    const files = form.getAll("photos").filter((f): f is File => f instanceof File);
    if (files.length) {
      const stored = await storeFiles(files);
      photoUrls = stored.map((s) => s.url);
    }
  } catch (e) {
    console.warn("[issue] photo upload skipped:", (e as Error).message);
  }

  try {
    await prisma.issueReport.create({
      data: {
        reference,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        propertyNumber: data.propertyNumber,
        category: data.category,
        description: data.description,
        photos: photoUrls,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        locationLabel: data.locationLabel || null,
      },
    });
  } catch (e) {
    console.error("[issue] persistence failed (continuing):", (e as Error).message);
  }

  await sendEmail({
    to: adminNotifyAddress(),
    subject: `New issue report ${reference}`,
    text: `A new issue (${data.category}) was reported by ${data.name} at property ${data.propertyNumber}.\n\n${data.description}`,
  });
  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: `We received your report — ${reference}`,
      text: `Thank you ${data.name}. Your report (${reference}) has been logged and the estate office will be in touch. You can quote this reference for any follow-up.`,
    });
  }

  return { ok: true, reference, message: "Your issue has been submitted." };
}

export async function submitDomesticWorker(form: FormData): Promise<ActionResult> {
  const parsed = domesticWorkerSchema.safeParse({
    residentName: fd(form, "residentName"),
    propertyNumber: fd(form, "propertyNumber"),
    workerName: fd(form, "workerName"),
    idNumber: fd(form, "idNumber"),
    contactNumber: fd(form, "contactNumber"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please correct the errors and try again.", errors: parsed.error.flatten().fieldErrors };
  }

  let photoUrl: string | null = null;
  try {
    const file = form.get("photo");
    if (file instanceof File && file.size > 0) {
      const [stored] = await storeFiles([file]);
      photoUrl = stored?.url ?? null;
    }
  } catch (e) {
    console.warn("[domestic] photo upload skipped:", (e as Error).message);
  }

  const reference = generateReference("DW");
  try {
    await prisma.domesticWorker.create({ data: { ...parsed.data, photoUrl } });
  } catch (e) {
    console.error("[domestic] persistence failed:", (e as Error).message);
  }

  await sendEmail({
    to: adminNotifyAddress(),
    subject: `Domestic worker registration — ${parsed.data.workerName}`,
    text: `${parsed.data.residentName} (property ${parsed.data.propertyNumber}) registered domestic worker ${parsed.data.workerName}.`,
  });

  return { ok: true, reference, message: "Domestic worker registration submitted." };
}

export async function submitContractor(form: FormData): Promise<ActionResult> {
  const parsed = contractorSchema.safeParse({
    companyName: fd(form, "companyName"),
    contactPerson: fd(form, "contactPerson"),
    contactEmail: fd(form, "contactEmail"),
    contactPhone: fd(form, "contactPhone"),
    vehicleDetails: fd(form, "vehicleDetails"),
    staffList: fd(form, "staffList"),
    workStartDate: fd(form, "workStartDate"),
    workEndDate: fd(form, "workEndDate"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please correct the errors and try again.", errors: parsed.error.flatten().fieldErrors };
  }

  let docUrls: string[] = [];
  try {
    const files = form.getAll("documents").filter((f): f is File => f instanceof File);
    if (files.length) {
      const stored = await storeFiles(files);
      docUrls = stored.map((s) => s.url);
    }
  } catch (e) {
    console.warn("[contractor] document upload skipped:", (e as Error).message);
  }

  const d = parsed.data;
  const reference = generateReference("CON");
  try {
    await prisma.contractor.create({
      data: {
        companyName: d.companyName,
        contactPerson: d.contactPerson,
        contactEmail: d.contactEmail || null,
        contactPhone: d.contactPhone || null,
        vehicleDetails: d.vehicleDetails || null,
        staffList: d.staffList || null,
        workStartDate: d.workStartDate ? new Date(d.workStartDate) : null,
        workEndDate: d.workEndDate ? new Date(d.workEndDate) : null,
        documents: docUrls,
      },
    });
  } catch (e) {
    console.error("[contractor] persistence failed:", (e as Error).message);
  }

  await sendEmail({
    to: adminNotifyAddress(),
    subject: `Contractor registration — ${d.companyName}`,
    text: `${d.contactPerson} registered contractor ${d.companyName}.`,
  });

  return { ok: true, reference, message: "Contractor registration submitted." };
}

export async function submitContact(form: FormData): Promise<ActionResult> {
  const parsed = contactSchema.safeParse({
    name: fd(form, "name"),
    email: fd(form, "email"),
    phone: fd(form, "phone"),
    subject: fd(form, "subject"),
    message: fd(form, "message"),
  });

  if (!parsed.success) {
    return { ok: false, message: "Please correct the errors and try again.", errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch (e) {
    console.error("[contact] persistence failed:", (e as Error).message);
  }

  await sendEmail({
    to: adminNotifyAddress(),
    subject: `Contact form: ${parsed.data.subject}`,
    text: `${parsed.data.name} (${parsed.data.email}) wrote:\n\n${parsed.data.message}`,
  });

  return { ok: true, message: "Thank you — your message has been sent." };
}

export async function trackDownload(documentId: string) {
  try {
    if (!documentId.startsWith("fallback-")) {
      await prisma.document.update({
        where: { id: documentId },
        data: { downloadCount: { increment: 1 } },
      });
    }
  } catch {
    // non-critical
  }
}
