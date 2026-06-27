import { z } from "zod";

const phoneRegex = /^[+0-9()\s-]{6,20}$/;

export const issueReportSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  propertyNumber: z.string().min(1, "Property number is required").max(40),
  category: z.enum([
    "WATER_SEWERAGE",
    "ELECTRICITY_FAILURE",
    "ROAD_DAMAGE",
    "SECURITY_CONCERN",
    "WILDLIFE_CONCERN",
    "COMMON_PROPERTY_MAINTENANCE",
    "LANDSCAPING_ISSUE",
    "NOISE_COMPLAINT",
    "RULE_VIOLATION",
  ]),
  description: z.string().min(10, "Please describe the issue (at least 10 characters)").max(4000),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  locationLabel: z.string().max(200).optional().or(z.literal("")),
});
export type IssueReportInput = z.infer<typeof issueReportSchema>;

export const domesticWorkerSchema = z.object({
  residentName: z.string().min(2, "Resident name is required").max(120),
  propertyNumber: z.string().min(1, "Property number is required").max(40),
  workerName: z.string().min(2, "Worker name is required").max(120),
  idNumber: z.string().min(4, "ID number is required").max(40),
  contactNumber: z.string().regex(phoneRegex, "Enter a valid contact number"),
});
export type DomesticWorkerInput = z.infer<typeof domesticWorkerSchema>;

export const contractorSchema = z.object({
  companyName: z.string().min(2, "Company name is required").max(160),
  contactPerson: z.string().min(2, "Contact person is required").max(120),
  contactEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  contactPhone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  vehicleDetails: z.string().max(400).optional().or(z.literal("")),
  staffList: z.string().max(2000).optional().or(z.literal("")),
  workStartDate: z.string().optional().or(z.literal("")),
  workEndDate: z.string().optional().or(z.literal("")),
});
export type ContractorInput = z.infer<typeof contractorSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(120),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number").optional().or(z.literal("")),
  subject: z.string().min(2, "Subject is required").max(160),
  message: z.string().min(10, "Please enter a message (at least 10 characters)").max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// Admin content schemas
export const noticeSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(10),
  category: z.enum([
    "WATER_NOTICES",
    "SECURITY_ALERTS",
    "ROAD_CLOSURES",
    "MAINTENANCE_NOTICES",
    "AGM_NOTICES",
    "COMMUNITY_UPDATES",
  ]),
  pinned: z.boolean().default(false),
  published: z.boolean().default(true),
  publishAt: z.string().optional().or(z.literal("")),
});
export type NoticeInput = z.infer<typeof noticeSchema>;

export const faqSchema = z.object({
  question: z.string().min(3).max(300),
  answer: z.string().min(3),
  categoryName: z.string().min(1).max(80),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});
export type FaqInput = z.infer<typeof faqSchema>;
