/**
 * CloudGen SmartPatrol solution catalog + INR commercial packages.
 * Rate card: Face/QR ₹2,000/mo · Visitor/Vehicle ₹3,000/mo (per site).
 * Bundles discount vs à-la-carte. CCTV / Industry / Custom = quote.
 */

export type SolutionPlatform =
  | "Mobile App"
  | "Web App"
  | "CCTV"
  | "CCTV / Mobile App"
  | "Custom";

export type Solution = {
  id: string;
  name: string;
  platform: SolutionPlatform;
  summary: string;
  category: "workforce" | "security" | "cctv" | "operations" | "custom";
};

export const SOLUTIONS: Solution[] = [
  {
    id: "face-attendance",
    name: "Face Biometric Attendance System",
    platform: "Mobile App",
    summary: "Track attendance with facial recognition and liveness checks.",
    category: "workforce",
  },
  {
    id: "visitor-management",
    name: "Visitor Management System",
    platform: "Mobile App",
    summary: "Manage visitors easily and securely with digital passes.",
    category: "security",
  },
  {
    id: "vehicle-management",
    name: "Vehicle Management System",
    platform: "Mobile App",
    summary: "Monitor and manage site vehicles end to end.",
    category: "security",
  },
  {
    id: "qr-patrolling",
    name: "QR Code Checkpoint Scan Patrolling System",
    platform: "Mobile App",
    summary: "Digitally track patrol checkpoints with time and location proof.",
    category: "security",
  },
  {
    id: "hospital-management",
    name: "Hospital Management System",
    platform: "Web App",
    summary: "Efficient hospital operations across wards and departments.",
    category: "operations",
  },
  {
    id: "doctor-appointment",
    name: "AI Chatbot Doctor Appointment Booking",
    platform: "Mobile App",
    summary: "Book doctor appointments through an AI chatbot with availability sync.",
    category: "operations",
  },
  {
    id: "command-centre",
    name: "Availability Command Centre — Ticket Complaints Tracking System",
    platform: "Mobile App",
    summary: "Report and resolve corporation complaints instantly with the ticket complaints tracking system.",
    category: "operations",
  },
  {
    id: "pharmacy-billing",
    name: "Pharmacy Billing System",
    platform: "Web App",
    summary: "Fast and accurate pharmacy billing and stock workflows.",
    category: "operations",
  },
  {
    id: "web-dev",
    name: "Web App Development",
    platform: "Custom",
    summary: "Custom web applications tailored to your business.",
    category: "custom",
  },
  {
    id: "mobile-dev",
    name: "Mobile App Development",
    platform: "Custom",
    summary: "Powerful mobile apps for every operational need.",
    category: "custom",
  },
  {
    id: "website-dev",
    name: "Website Development",
    platform: "Custom",
    summary: "Modern and responsive websites for your brand.",
    category: "custom",
  },
  {
    id: "cctv-attendance",
    name: "CCTV Attendance System",
    platform: "CCTV",
    summary: "Automated attendance via existing CCTV cameras.",
    category: "cctv",
  },
  {
    id: "people-counting",
    name: "CCTV People Counting",
    platform: "CCTV",
    summary: "Count people accurately for capacity and footfall insights.",
    category: "cctv",
  },
  {
    id: "anpr",
    name: "CCTV ANPR (Automatic Number Plate Recognition)",
    platform: "CCTV",
    summary: "Identify vehicles automatically from number plates.",
    category: "cctv",
  },
  {
    id: "ocr",
    name: "CCTV / Mobile OCR for ID Cards",
    platform: "CCTV / Mobile App",
    summary:
      "Extract ID number, name, phone number and address from ID cards automatically.",
    category: "cctv",
  },
];

/** Included on every commercial package. */
export const COMMON_SOLUTION_IDS = ["command-centre"] as const;

export type SolutionPackageId =
  | "face"
  | "qr-patrol"
  | "visitor"
  | "vehicle"
  | "workforce-duo"
  | "gate-duo"
  | "site-ops"
  | "vision-ai"
  | "industry"
  | "custom";

export type SolutionPackage = {
  id: SolutionPackageId;
  name: string;
  blurb: string;
  popular?: boolean;
  /** True = sales quote only (no online checkout price). */
  quoteOnly?: boolean;
  /** Capacity / commercial unit from rate card. */
  unitLimit: string;
  /** INR list price per month. */
  inrMonthly: number | null;
  /** INR billed annually (typically 12× monthly; bundles may discount). */
  inrAnnual: number | null;
  /** One-time setup / onboarding in INR. */
  inrSetup: number | null;
  solutionIds: string[];
  highlights: string[];
  bestFor: string;
};

/**
 * INR packages from CloudGen rate card (Package-1):
 * Face ₹2,000/mo · QR ₹2,000/mo · Visitor ₹3,000/mo · Vehicle ₹3,000/mo
 * Singles match list; combos undercut à-la-carte. CCTV / Industry / Custom = quote.
 */
export const SOLUTION_PACKAGES: SolutionPackage[] = [
  {
    id: "face",
    name: "Smart Patrol Attendance",
    blurb: "Face biometric attendance only — for sites that only need workforce punch.",
    unitLimit: "Upto 25 users",
    inrMonthly: 2000,
    inrAnnual: 24000,
    inrSetup: 999,
    solutionIds: ["face-attendance", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Face biometric attendance",
      "Upto 25 users",
      "Ticket Complaints Tracking System",
      "Mobile app access",
    ],
    bestFor: "Customers who only need face biometric",
  },
  {
    id: "qr-patrol",
    name: "Smart Patrol Checkpoint",
    blurb: "QR checkpoint scan patrolling only — proof of presence on routes.",
    unitLimit: "Upto 20 codes",
    inrMonthly: 2000,
    inrAnnual: 24000,
    inrSetup: 999,
    solutionIds: ["qr-patrolling", ...COMMON_SOLUTION_IDS],
    highlights: [
      "QR code checkpoint scan",
      "Upto 20 codes",
      "Ticket Complaints Tracking System",
      "Time & location proof",
    ],
    bestFor: "Customers who only need QR scan",
  },
  {
    id: "visitor",
    name: "Smart Patrol Visitor",
    blurb: "Visitor management only — digital check-in for a single site.",
    unitLimit: "Per site",
    inrMonthly: 3000,
    inrAnnual: 36000,
    inrSetup: 1499,
    solutionIds: ["visitor-management", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Visitor management system",
      "Per site license",
      "Ticket Complaints Tracking System",
      "Digital passes",
    ],
    bestFor: "Customers who only need visitor management",
  },
  {
    id: "vehicle",
    name: "Smart Patrol Vehicle",
    blurb: "Vehicle management only — entry / exit control for a single site.",
    unitLimit: "Per site",
    inrMonthly: 3000,
    inrAnnual: 36000,
    inrSetup: 1499,
    solutionIds: ["vehicle-management", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Vehicle management system",
      "Per site license",
      "Ticket Complaints Tracking System",
      "Gate movement visibility",
    ],
    bestFor: "Customers who only need vehicle management",
  },
  {
    id: "workforce-duo",
    name: "Smart Patrol Workforce Duo",
    blurb: "Face biometric + QR patrol together — save vs buying both alone.",
    unitLimit: "25 users · 20 codes",
    inrMonthly: 3500,
    inrAnnual: 42000,
    inrSetup: 1499,
    solutionIds: ["face-attendance", "qr-patrolling", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Face biometric + QR patrol",
      "List ₹4,000/mo → ₹3,500/mo",
      "Ticket Complaints Tracking System",
      "Ideal attendance + checkpoint stack",
    ],
    bestFor: "Customers who need face biometric and QR scan",
  },
  {
    id: "gate-duo",
    name: "Smart Patrol Gate Duo",
    blurb: "Visitor + vehicle gate stack for reception and parking control.",
    unitLimit: "Per site",
    inrMonthly: 5500,
    inrAnnual: 66000,
    inrSetup: 1999,
    solutionIds: ["visitor-management", "vehicle-management", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Visitor + vehicle management",
      "List ₹6,000/mo → ₹5,500/mo",
      "Ticket Complaints Tracking System",
      "Single-site gate operations",
    ],
    bestFor: "Customers who need visitor and vehicle together",
  },
  {
    id: "site-ops",
    name: "Smart Patrol Site Ops Suite",
    blurb: "Full site stack — face, QR, visitor and vehicle in one competitive bundle.",
    popular: true,
    unitLimit: "25 users · 20 codes · per site gate",
    inrMonthly: 8500,
    inrAnnual: 99900,
    inrSetup: 2499,
    solutionIds: [
      "face-attendance",
      "qr-patrolling",
      "visitor-management",
      "vehicle-management",
      ...COMMON_SOLUTION_IDS,
    ],
    highlights: [
      "Face + QR + Visitor + Vehicle",
      "List ₹10,000/mo → ₹8,500/mo",
      "Ticket Complaints Tracking System",
      "Best value full site operations",
    ],
    bestFor: "Customers who need the complete site operations stack",
  },
  {
    id: "vision-ai",
    name: "Smart Patrol Vision AI",
    blurb: "CCTV attendance, people counting, ANPR and ID OCR — scoped per camera set.",
    quoteOnly: true,
    unitLimit: "Per camera set · custom scope",
    inrMonthly: null,
    inrAnnual: null,
    inrSetup: null,
    solutionIds: [
      "cctv-attendance",
      "people-counting",
      "anpr",
      "ocr",
      ...COMMON_SOLUTION_IDS,
    ],
    highlights: [
      "CCTV attendance & people counting",
      "ANPR number-plate recognition",
      "ID card OCR",
      "Ticket Complaints Tracking System",
    ],
    bestFor: "Sites with camera infrastructure — request a quote",
  },
  {
    id: "industry",
    name: "Smart Patrol Industry Suite",
    blurb: "Hospital, pharmacy and AI doctor appointment booking — scoped per deployment.",
    quoteOnly: true,
    unitLimit: "Custom scope",
    inrMonthly: null,
    inrAnnual: null,
    inrSetup: null,
    solutionIds: [
      "hospital-management",
      "pharmacy-billing",
      "doctor-appointment",
      ...COMMON_SOLUTION_IDS,
    ],
    highlights: [
      "Hospital management",
      "Pharmacy billing",
      "AI Chatbot Doctor Appointment Booking",
      "Ticket Complaints Tracking System",
    ],
    bestFor: "Healthcare and vertical ops — request a quote",
  },
  {
    id: "custom",
    name: "Smart Patrol Custom Build",
    blurb: "Custom web, mobile and website builds tailored to your workflows.",
    quoteOnly: true,
    unitLimit: "Project quote",
    inrMonthly: null,
    inrAnnual: null,
    inrSetup: null,
    solutionIds: ["web-dev", "mobile-dev", "website-dev", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Web app development",
      "Mobile app development",
      "Website development",
      "Ticket Complaints Tracking System",
    ],
    bestFor: "Bespoke digital delivery — request a quote",
  },
];

export const VALUE_PROPS = [
  {
    title: "Enhanced Security",
    body: "Biometrics, checkpoints, gate control and CCTV AI in one stack.",
  },
  {
    title: "Operational Efficiency",
    body: "Digitize attendance, visitors, vehicles and complaints without paper.",
  },
  {
    title: "Real-Time Insights",
    body: "Live activity, analytics and automated reporting for managers.",
  },
  {
    title: "Always-On Support",
    body: "Ticket Complaints Tracking System and CloudGen specialist coverage.",
  },
] as const;

export type PackageBilling = "monthly" | "annual";

export const PAID_PACKAGE_IDS = SOLUTION_PACKAGES.filter((p) => !p.quoteOnly).map(
  (p) => p.id,
) as SolutionPackageId[];

export function getSolution(id: string) {
  const solution = SOLUTIONS.find((s) => s.id === id);
  if (!solution) throw new Error(`Unknown solution: ${id}`);
  return solution;
}

export function getPackage(id: SolutionPackageId) {
  const pkg = SOLUTION_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new Error(`Unknown package: ${id}`);
  return pkg;
}

export function solutionsForPackage(pkg: SolutionPackage) {
  return pkg.solutionIds.map(getSolution);
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Razorpay charge = period (monthly or annual) + one-time setup, already in INR. */
export function quotePackage(packageId: SolutionPackageId, billing: PackageBilling) {
  const pkg = getPackage(packageId);
  if (pkg.quoteOnly || pkg.inrMonthly == null || pkg.inrAnnual == null || pkg.inrSetup == null) {
    return {
      pkg,
      billing,
      inrPeriod: null as number | null,
      inrSetup: null as number | null,
      inrDue: null as number | null,
      needsQuote: true as const,
    };
  }

  const inrPeriod = billing === "monthly" ? pkg.inrMonthly : pkg.inrAnnual;
  const inrDue = inrPeriod + pkg.inrSetup;
  return {
    pkg,
    billing,
    inrPeriod,
    inrSetup: pkg.inrSetup,
    inrDue,
    needsQuote: false as const,
  };
}
