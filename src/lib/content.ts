// Default estate content. Used by the seed script AND as a graceful fallback
// for public pages when the database is unavailable (e.g. during build).

export const WELCOME = {
  chairman: {
    name: "Johan van der Merwe",
    title: "Chairman, Simola HOA",
    message:
      "On behalf of the Board of Trustees, it is my privilege to welcome you to Simola Estate. Our community is built on a shared commitment to security, environmental stewardship, and the kind of gracious estate living that makes Simola one of the Garden Route's most sought-after addresses. This portal is your single point of contact for everything estate-related — please make full use of it, and never hesitate to reach out to the office.",
  },
  vision:
    "To be the most admired residential estate on the Garden Route — a secure, beautifully maintained sanctuary where families thrive in harmony with the natural environment.",
  purpose:
    "The Simola Homeowners Association exists to protect property values, uphold the architectural and environmental integrity of the estate, ensure resident safety, and foster a warm, well-run community for every homeowner and resident.",
  officeHours: [
    { day: "Monday – Friday", hours: "08:00 – 16:30" },
    { day: "Saturday", hours: "08:00 – 12:00" },
    { day: "Sunday & Public Holidays", hours: "Closed" },
  ],
};

export const EMERGENCY_CONTACTS = [
  { category: "Estate Security", name: "Simola Security Control Room", phone: "+27 44 302 9711", description: "24/7 manned control room — first point of contact for any security concern.", order: 1 },
  { category: "Estate Security", name: "Roving Patrol Officer", phone: "+27 82 555 0110", description: "On-site mobile patrol response.", order: 2 },
  { category: "Medical", name: "ER24 Emergency", phone: "084 124", description: "National medical emergency response.", order: 1 },
  { category: "Medical", name: "Knysna Provincial Hospital", phone: "+27 44 302 8400", description: "Nearest hospital casualty unit.", order: 2 },
  { category: "Fire Department", name: "Knysna Fire & Rescue", phone: "+27 44 302 8911", description: "Fire and rescue services.", order: 1 },
  { category: "Fire Department", name: "Working on Fire (Wildfire)", phone: "+27 44 805 5071", description: "Wildfire / veld fire reporting.", order: 2 },
  { category: "Municipal Services", name: "Knysna Municipality (24h)", phone: "+27 44 302 6300", description: "Water, electricity & roads faults.", order: 1 },
  { category: "Municipal Services", name: "Electricity Faults", phone: "+27 44 302 6420", description: "Power outages on municipal supply.", order: 2 },
  { category: "Telecommunications", name: "Estate Fibre Support (Vumatel)", phone: "0800 222 297", description: "Fibre connectivity support.", order: 1 },
  { category: "Telecommunications", name: "Telkom Faults", phone: "10210", description: "Copper line and ADSL faults.", order: 2 },
  { category: "HOA After Hours", name: "HOA Duty Manager", phone: "+27 82 555 0199", description: "After-hours estate management line for urgent estate matters.", order: 1 },
  { category: "HOA After Hours", name: "Estate Office (voicemail)", phone: "+27 44 302 9700", description: "Leave a message — returned the next business day.", order: 2 },
];

export type RuleSection = {
  group: string;
  slug: string;
  items: { title: string; body: string }[];
};

export const RULES: RuleSection[] = [
  {
    group: "Estate Conduct Rules",
    slug: "estate-conduct",
    items: [
      { title: "Noise", body: "Residents must avoid causing a nuisance. No loud music or power tools between 20:00 and 07:00 on weekdays, or after 13:00 on Sundays and public holidays. Amplified entertainment at private functions requires prior office approval." },
      { title: "Pets", body: "A maximum of two domestic pets per household is permitted, subject to registration with the HOA. Dogs must be leashed on all common property. Owners are responsible for cleaning up after their pets at all times." },
      { title: "Parking", body: "Vehicles must be parked within private property boundaries or designated visitor bays. No parking on verges, common roads, or in a manner that obstructs emergency access. Caravans, boats and trailers must be stored out of sight." },
      { title: "Security", body: "Access cards and biometric registration are personal and may not be shared. Residents must report lost access devices immediately. Tailgating through booms is strictly prohibited." },
    ],
  },
  {
    group: "Building Rules",
    slug: "building",
    items: [
      { title: "Construction Hours", body: "Building work is permitted Monday to Friday 07:00–17:00 and Saturday 08:00–13:00. No construction on Sundays or public holidays. Deliveries of building material are restricted to these hours." },
      { title: "Contractor Conduct", body: "All contractors must be registered with the HOA before commencing work. Contractor staff must wear identification, use designated ablution facilities, and may not roam the estate. Radios and loud behaviour are prohibited." },
      { title: "Site Requirements", body: "Every building site must be enclosed with shade-cloth hoarding, maintain a rubble skip, and keep the adjacent road clean. A refundable building deposit is required before site handover." },
    ],
  },
  {
    group: "Environmental Rules",
    slug: "environmental",
    items: [
      { title: "Tree Removal", body: "No indigenous tree may be removed or pruned without written approval from the Environmental Committee. Protected species enjoy additional legislative protection." },
      { title: "Fire Prevention", body: "Open fires are restricted to approved built-in braai facilities. During high fire-danger periods, all open flames may be prohibited by notice. Residents must maintain defensible space around dwellings." },
      { title: "Alien Vegetation", body: "Owners are responsible for clearing and controlling declared invasive alien plant species on their erven in accordance with NEMBA regulations." },
    ],
  },
  {
    group: "Architectural Guidelines",
    slug: "architectural",
    items: [
      { title: "DRC Process", body: "All new builds and external alterations must be submitted to the Design Review Committee (DRC). Submissions follow a two-stage process: concept approval followed by working-drawing approval." },
      { title: "Approval Requirements", body: "Plans must comply with the estate Architectural Guidelines covering roof pitch, materials, colours, boundary treatment and landscaping before municipal submission." },
      { title: "Solar Installation Rules", body: "Solar PV and solar geyser installations require DRC approval. Panels must be roof-mounted, non-reflective where possible, and positioned to minimise visibility from common areas. Battery and inverter housing must be screened." },
    ],
  },
];

export const FAQ_CATEGORIES = ["Security", "Building", "Pets", "Refuse", "Access"];

export const FAQS = [
  { category: "Access", question: "How do I get an access card for a new resident?", answer: "Complete the New Owner / Resident form available in Forms & Downloads and submit it to the estate office with a copy of ID. Biometric registration is done at the office during business hours.", featured: true },
  { category: "Access", question: "How do visitors gain access to the estate?", answer: "Pre-register your visitor on the access app or phone the gatehouse. Visitors must present ID at the boom and will be issued a time-limited access code.", featured: true },
  { category: "Security", question: "What do I do if I notice suspicious activity?", answer: "Contact the 24/7 Security Control Room immediately. Do not approach the individuals. Provide your location, a description, and stay on the line.", featured: true },
  { category: "Security", question: "Are panic buttons monitored?", answer: "Yes. All registered panic devices route directly to the control room and dispatch the roving patrol officer." },
  { category: "Building", question: "How long does DRC approval take?", answer: "Concept approval is typically processed within the DRC's published submission cycle. Ensure your submission is complete to avoid delays." },
  { category: "Building", question: "Can I build on weekends?", answer: "Construction is permitted on Saturdays 08:00–13:00. No building work is allowed on Sundays or public holidays." },
  { category: "Pets", question: "How many pets may I keep?", answer: "A maximum of two domestic pets per household, subject to registration with the HOA." },
  { category: "Pets", question: "Must dogs be on a leash?", answer: "Yes, dogs must be leashed on all common property and owners must clean up after them." },
  { category: "Refuse", question: "When is refuse collected?", answer: "Municipal refuse is collected weekly. Place bins at your collection point before 07:00 on collection day and remove them the same day.", featured: true },
  { category: "Refuse", question: "Where can I dispose of garden refuse?", answer: "Garden refuse may be taken to the designated estate green-waste point. Do not dump refuse on common property or vacant erven." },
  { category: "Access", question: "What happens if I lose my access tag?", answer: "Report it to the office immediately so it can be deactivated. A replacement fee applies for a new tag." },
];

export const KNOWLEDGE_CATEGORIES = ["Water", "Electricity", "Fibre", "Security", "Waste", "Biolytic Systems"];

export const KNOWLEDGE = [
  { category: "Water", title: "What to do during a water outage", summary: "Steps to take when your water supply is interrupted.", body: "Check the Notices page for any scheduled maintenance. If there is no notice, confirm whether neighbours are affected, then report the outage to the municipal 24h line and notify the estate office. Store emergency water and avoid using geysers until supply is restored.", tags: ["outage", "supply"] },
  { category: "Water", title: "Understanding your water meter", summary: "How to read and monitor your consumption.", body: "Your meter records consumption in kilolitres. Read it weekly to detect leaks early — a spinning dial with all taps closed indicates a leak. Report suspected common-property leaks to the office." },
  { category: "Electricity", title: "Power failure troubleshooting", summary: "Quick checks before reporting an outage.", body: "First check your distribution board for tripped breakers and your prepaid balance if applicable. Confirm whether the outage is estate-wide by checking with neighbours, then report to the municipal electricity faults line and the estate office.", tags: ["loadshedding", "outage"] },
  { category: "Electricity", title: "Load-shedding schedules", summary: "Where to find current schedules.", body: "Load-shedding follows the municipal schedule for the estate's supply zone. Keep devices charged and torches handy. Security infrastructure runs on backup power during shedding." },
  { category: "Fibre", title: "Fibre connectivity issues", summary: "Resolve common fibre problems.", body: "Reboot your ONT (fibre box) and router by switching them off for 30 seconds. Check that the ONT power and fibre lights are green. If the fault persists, log a ticket with the fibre provider quoting your line reference.", tags: ["internet", "wifi"] },
  { category: "Security", title: "Registering a panic button", summary: "Link your panic device to the control room.", body: "Bring your device to the estate office or request the security team to register it. Test the device monthly and report any faults immediately." },
  { category: "Waste", title: "Recycling at Simola", summary: "Separate and dispose of recyclables.", body: "Separate glass, paper, plastic and tins from general waste. Recyclables are collected on the designated day. Garden waste goes to the green-waste point." },
  { category: "Biolytic Systems", title: "Caring for your biolytic system", summary: "Maintain your on-site treatment system.", body: "Biolytic septic systems rely on healthy bacteria. Avoid flushing chemicals, fats, wet wipes or excessive bleach. Schedule periodic inspections and report unusual odours or surfacing to the office.", tags: ["septic", "maintenance"] },
];

export const NOTICES = [
  { title: "Scheduled Water Maintenance — Phase 2", category: "WATER_NOTICES", excerpt: "Water supply to erven 100–180 will be interrupted for pipeline maintenance.", body: "Please be advised that the municipality will be conducting essential pipeline maintenance affecting erven 100–180. Supply will be interrupted from 09:00 to 14:00. Residents are advised to store water in advance. We apologise for any inconvenience.", pinned: true },
  { title: "Heightened Security Alert — Festive Season", category: "SECURITY_ALERTS", excerpt: "Additional patrols deployed over the festive period.", body: "Security has increased roving patrols and access scrutiny over the festive season. Residents are reminded to pre-register all visitors and report suspicious activity to the control room immediately.", pinned: true },
  { title: "Main Gate Road Resurfacing", category: "ROAD_CLOSURES", excerpt: "Temporary single-lane access at the main entrance.", body: "The access road at the main gate will be resurfaced. Expect single-lane, stop/go controlled access. Please allow extra time when entering and exiting the estate.", pinned: false },
  { title: "Clubhouse Generator Servicing", category: "MAINTENANCE_NOTICES", excerpt: "Brief power interruption at the clubhouse.", body: "The clubhouse standby generator will undergo scheduled servicing. A brief power interruption to clubhouse facilities is expected during the maintenance window.", pinned: false },
  { title: "Notice of Annual General Meeting", category: "AGM_NOTICES", excerpt: "The Simola HOA AGM will be held at the clubhouse.", body: "Notice is hereby given of the Annual General Meeting of the Simola Homeowners Association. The agenda, financials and proxy forms are available in the Document Library. All members are encouraged to attend.", pinned: true },
  { title: "Community Clean-Up & Braai", category: "COMMUNITY_UPDATES", excerpt: "Join your neighbours for a morning of community spirit.", body: "Residents are invited to a community clean-up morning followed by a social braai at the clubhouse lawns. Bring the family — refreshments provided. RSVP at the estate office.", pinned: false },
];

export const DOCUMENT_CATEGORIES = [
  { name: "New Owner", slug: "new-owner", kind: "document" },
  { name: "Registrations", slug: "registrations", kind: "document" },
  { name: "Building Applications", slug: "building-applications", kind: "document" },
  { name: "Governance", slug: "governance", kind: "document" },
];

export const DOCUMENTS = [
  { title: "New Owner / Resident Form", description: "Register as a new owner or resident and obtain access.", categorySlug: "new-owner", library: "forms", featured: true, fileName: "new-owner-form.pdf" },
  { title: "Domestic Worker Registration Form", description: "Printable domestic worker registration form.", categorySlug: "registrations", library: "forms", featured: true, fileName: "domestic-worker-registration.pdf" },
  { title: "Contractor Registration Form", description: "Register a contractor for work on the estate.", categorySlug: "registrations", library: "forms", featured: true, fileName: "contractor-registration.pdf" },
  { title: "Building Plan Submission (DRC)", description: "Design Review Committee submission application.", categorySlug: "building-applications", library: "forms", featured: true, fileName: "drc-building-application.pdf" },
  { title: "Estate Conduct Rules", description: "Full estate conduct rules document.", categorySlug: "governance", library: "library", featured: false, fileName: "estate-conduct-rules.pdf" },
  { title: "Architectural Guidelines", description: "Complete architectural design guidelines.", categorySlug: "building-applications", library: "library", featured: false, fileName: "architectural-guidelines.pdf" },
  { title: "HOA Constitution", description: "The constitution of the Simola Homeowners Association.", categorySlug: "governance", library: "library", featured: false, fileName: "hoa-constitution.pdf" },
  { title: "AGM Minutes (Latest)", description: "Minutes of the most recent Annual General Meeting.", categorySlug: "governance", library: "library", featured: false, fileName: "agm-minutes.pdf" },
];
