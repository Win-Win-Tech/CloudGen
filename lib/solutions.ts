/**
 * CloudGen SmartPatrol solution catalog from the product flyer,
 * grouped into competitive USD packages for SMB / mid-market buyers.
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
    id: "court-booking",
    name: "Badminton Court WhatsApp Booking System",
    platform: "Mobile App",
    summary: "Book courts easily via WhatsApp with availability sync.",
    category: "operations",
  },
  {
    id: "command-centre",
    name: "Availability Command Centre — 24×7 WhatsApp Complaints Ticketing",
    platform: "Mobile App",
    summary: "Report and resolve corporation complaints instantly over WhatsApp.",
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

export type SolutionPackageId =
  | "essentials"
  | "operations"
  | "vision-ai"
  | "industry"
  | "enterprise";

export type SolutionPackage = {
  id: SolutionPackageId;
  name: string;
  blurb: string;
  popular?: boolean;
  /** Competitive USD list price per month (site / org license). */
  usdMonthly: number;
  /** Competitive USD annual total (~15% off). */
  usdAnnual: number;
  /** One-time setup / onboarding in USD. */
  usdSetup: number;
  solutionIds: string[];
  highlights: string[];
  bestFor: string;
};

/**
 * Competitive USD packaging vs regional SaaS / systems integrators:
 * - Guard/workforce suites often list $50–200 / site / mo
 * - Visitor + vehicle gate stacks $100–250 / mo
 * - CCTV AI analytics (ANPR / counting) typically $200–500 / camera-set / mo
 * - Vertical apps (hospital / pharmacy) $200–600 / mo
 * Bundles undercut à-la-carte while staying commercially credible.
 */
export const SOLUTION_PACKAGES: SolutionPackage[] = [
  {
    id: "essentials",
    name: "Essentials",
    blurb: "Core workforce and patrol stack for single sites.",
    usdMonthly: 79,
    usdAnnual: 799,
    usdSetup: 149,
    solutionIds: ["face-attendance", "visitor-management", "qr-patrolling"],
    highlights: [
      "Face biometric attendance",
      "Visitor check-in & digital passes",
      "QR checkpoint patrolling",
      "Daily activity visibility",
    ],
    bestFor: "Small security teams and single facilities",
  },
  {
    id: "operations",
    name: "Operations",
    blurb: "Gate control plus 24×7 WhatsApp command-centre ticketing.",
    popular: true,
    usdMonthly: 179,
    usdAnnual: 1829,
    usdSetup: 299,
    solutionIds: [
      "face-attendance",
      "visitor-management",
      "qr-patrolling",
      "vehicle-management",
      "command-centre",
    ],
    highlights: [
      "Everything in Essentials",
      "Vehicle entry / exit management",
      "24×7 WhatsApp complaints ticketing",
      "Availability command centre",
    ],
    bestFor: "Multi-gate campuses and civic / facility ops",
  },
  {
    id: "vision-ai",
    name: "Vision AI",
    blurb: "CCTV intelligence for attendance, footfall, plates and ID OCR.",
    usdMonthly: 349,
    usdAnnual: 3569,
    usdSetup: 599,
    solutionIds: ["cctv-attendance", "people-counting", "anpr", "ocr"],
    highlights: [
      "CCTV face attendance",
      "People counting analytics",
      "ANPR number-plate recognition",
      "ID card OCR extraction",
    ],
    bestFor: "Sites with camera infrastructure ready for AI",
  },
  {
    id: "industry",
    name: "Industry Apps",
    blurb: "Ready vertical systems for hospitals, pharmacies and court booking.",
    usdMonthly: 299,
    usdAnnual: 3059,
    usdSetup: 499,
    solutionIds: ["hospital-management", "pharmacy-billing", "court-booking"],
    highlights: [
      "Hospital management web app",
      "Pharmacy billing system",
      "WhatsApp court booking",
      "Domain-ready workflows",
    ],
    bestFor: "Healthcare, retail pharmacy and sports facilities",
  },
  {
    id: "enterprise",
    name: "Enterprise Suite",
    blurb: "All SmartPatrol solutions plus custom web, mobile and website builds.",
    usdMonthly: 799,
    usdAnnual: 8159,
    usdSetup: 1499,
    solutionIds: SOLUTIONS.map((s) => s.id),
    highlights: [
      "All 15 CloudGen solutions",
      "Custom web app development",
      "Custom mobile app development",
      "Website development & branding",
      "Priority 24×7 support",
    ],
    bestFor: "Enterprises needing full stack + custom delivery",
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
    body: "24×7 WhatsApp command centre and CloudGen specialist coverage.",
  },
] as const;

export type PackageBilling = "monthly" | "annual";

export const USD_TO_INR = Number(process.env.NEXT_PUBLIC_USD_TO_INR || 83);

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

export function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

/** First Razorpay charge = period price + one-time setup, converted to INR. */
export function quotePackage(packageId: SolutionPackageId, billing: PackageBilling) {
  const pkg = getPackage(packageId);
  const usdPeriod = billing === "monthly" ? pkg.usdMonthly : pkg.usdAnnual;
  const usdDue = usdPeriod + pkg.usdSetup;
  const inrDue = Math.round(usdDue * USD_TO_INR);
  return {
    pkg,
    billing,
    usdPeriod,
    usdSetup: pkg.usdSetup,
    usdDue,
    inrDue,
  };
}
