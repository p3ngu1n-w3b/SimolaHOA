import {
  Home,
  PhoneCall,
  AlertTriangle,
  ScrollText,
  UserCheck,
  HardHat,
  LifeBuoy,
  Bell,
  FileDown,
  HelpCircle,
  Mail,
  Library,
  type LucideIcon,
} from "lucide-react";

export const SITE = {
  name: "Simola HOA",
  fullName: "Simola Golf & Country Estate Homeowners' Association",
  shortName: "Simola Golf & Country Estate",
  tagline: "Estate living, beautifully managed.",
  description:
    "The official resident portal of the Simola Golf & Country Estate Homeowners' Association — emergency contacts, notices, rules, registrations, downloads and estate information, all in one place.",
  email: "office@simolahoa.co.za",
  phone: "+27 44 302 9700",
  whatsapp: "+27 82 000 0000",
  address: "Simola Estate, Old Cape Road, Knysna, 6571, South Africa",
  officeHours: [
    { day: "Monday – Friday", hours: "08:00 – 16:30" },
    { day: "Saturday", hours: "08:00 – 12:00" },
    { day: "Sunday & Public Holidays", hours: "Closed" },
  ],
};

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Home", href: "/", icon: Home, description: "Estate home & welcome" },
  { title: "Emergency Contacts", href: "/emergency-contacts", icon: PhoneCall, description: "One-touch emergency dialling" },
  { title: "Report an Issue", href: "/report-an-issue", icon: AlertTriangle, description: "Log a maintenance or security issue" },
  { title: "Rules & Guidelines", href: "/rules", icon: ScrollText, description: "Estate conduct & building rules" },
  { title: "Domestic Worker Registration", href: "/domestic-worker-registration", icon: UserCheck, description: "Register a domestic worker" },
  { title: "Contractor Registration", href: "/contractor-registration", icon: HardHat, description: "Register a contractor" },
  { title: "Self Help Centre", href: "/self-help", icon: LifeBuoy, description: "Guides for water, power, fibre & more" },
  { title: "Notices & Alerts", href: "/notices", icon: Bell, description: "Latest estate notices" },
  { title: "Forms & Downloads", href: "/forms", icon: FileDown, description: "Estate forms & documents" },
  { title: "FAQs", href: "/faqs", icon: HelpCircle, description: "Frequently asked questions" },
  { title: "Contact Us", href: "/contact", icon: Mail, description: "Get in touch with the office" },
  { title: "Document Library", href: "/documents", icon: Library, description: "Full estate document archive" },
];

export const QUICK_ACCESS = [
  { title: "Report an Issue", href: "/report-an-issue", icon: AlertTriangle, blurb: "Water, power, roads, security & more." },
  { title: "Emergency Contacts", href: "/emergency-contacts", icon: PhoneCall, blurb: "One-touch dialling for emergencies." },
  { title: "Rules & Guidelines", href: "/rules", icon: ScrollText, blurb: "Conduct, building & environmental rules." },
  { title: "Self Help Centre", href: "/self-help", icon: LifeBuoy, blurb: "How-to guides for estate services." },
  { title: "Domestic Worker", href: "/domestic-worker-registration", icon: UserCheck, blurb: "Register your domestic worker." },
  { title: "Contractor", href: "/contractor-registration", icon: HardHat, blurb: "Register contractors & deliveries." },
];

export const EMERGENCY_CATEGORIES = [
  "Estate Security",
  "Medical",
  "Fire Department",
  "Municipal Services",
  "Telecommunications",
  "HOA After Hours",
] as const;

export const ISSUE_CATEGORIES = [
  { value: "WATER_SEWERAGE", label: "Water & Sewerage" },
  { value: "ELECTRICITY_FAILURE", label: "Electricity Failure" },
  { value: "ROAD_DAMAGE", label: "Road Damage" },
  { value: "SECURITY_CONCERN", label: "Security Concern" },
  { value: "WILDLIFE_CONCERN", label: "Wildlife Concern" },
  { value: "COMMON_PROPERTY_MAINTENANCE", label: "Common Property Maintenance" },
  { value: "LANDSCAPING_ISSUE", label: "Landscaping Issue" },
  { value: "NOISE_COMPLAINT", label: "Noise Complaint" },
  { value: "RULE_VIOLATION", label: "Rule Violation" },
] as const;

export const NOTICE_CATEGORIES = [
  { value: "WATER_NOTICES", label: "Water Notices" },
  { value: "SECURITY_ALERTS", label: "Security Alerts" },
  { value: "ROAD_CLOSURES", label: "Road Closures" },
  { value: "MAINTENANCE_NOTICES", label: "Maintenance Notices" },
  { value: "AGM_NOTICES", label: "AGM Notices" },
  { value: "COMMUNITY_UPDATES", label: "Community Updates" },
] as const;

export const ISSUE_STATUSES = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const;

export const REGISTRATION_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export const CONTRACTOR_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "EXPIRED", label: "Expired" },
] as const;

export const BRANDING = {
  logo: "/branding/simola-logo.png",
  logoWidth: 1004,
  logoHeight: 710,
  banner: "/branding/simola-banner.png",
  bannerWidth: 1024,
  bannerHeight: 215,
  alt: "Simola Golf & Country Estate Homeowners' Association",
} as const;

// Placeholder imagery (replaceable via CMS). Uses Unsplash source.
export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80",
  lifestyle: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
  golf: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=1400&q=80",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
  security: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=80",
  estate: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=80",
  welcome: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
};
