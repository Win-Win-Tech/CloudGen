/**
 * CloudGen SmartPatrol solution catalog + USD commercial packages.
 * Competitive USD rate card (from prior INR card ≈ ₹83/USD, rounded):
 * Face/QR $25/mo · Visitor/Vehicle $36/mo (per site).
 * Bundles discount vs à-la-carte. CCTV / Industry / Custom = quote.
 * Razorpay checkout converts USD → INR via USD_TO_INR.
 * USD packages are zero-rated under LUT (no GST).
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
  /** USD list price per month. */
  usdMonthly: number | null;
  /** USD billed annually (~10× monthly for competitive annual). */
  usdAnnual: number | null;
  /** One-time setup / onboarding in USD. */
  usdSetup: number | null;
  solutionIds: string[];
  highlights: string[];
  bestFor: string;
};

/**
 * Competitive USD packages (converted from INR Package-1, rounded):
 * Face/QR $25/mo · Visitor/Vehicle $36/mo · combos undercut à-la-carte.
 * CCTV / Industry / Custom = quote.
 */
export const SOLUTION_PACKAGES: SolutionPackage[] = [
  {
    id: "face",
    name: "Smart Patrol Attendance",
    blurb: "Face biometric attendance only — for sites that only need workforce punch.",
    unitLimit: "Upto 25 users",
    usdMonthly: 25,
    usdAnnual: 250,
    usdSetup: 12,
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
    usdMonthly: 25,
    usdAnnual: 250,
    usdSetup: 12,
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
    usdMonthly: 36,
    usdAnnual: 360,
    usdSetup: 18,
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
    usdMonthly: 36,
    usdAnnual: 360,
    usdSetup: 18,
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
    usdMonthly: 42,
    usdAnnual: 420,
    usdSetup: 18,
    solutionIds: ["face-attendance", "qr-patrolling", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Face biometric + QR patrol",
      "List $50/mo → $42/mo",
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
    usdMonthly: 66,
    usdAnnual: 660,
    usdSetup: 24,
    solutionIds: ["visitor-management", "vehicle-management", ...COMMON_SOLUTION_IDS],
    highlights: [
      "Visitor + vehicle management",
      "List $72/mo → $66/mo",
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
    usdMonthly: 99,
    usdAnnual: 990,
    usdSetup: 30,
    solutionIds: [
      "face-attendance",
      "qr-patrolling",
      "visitor-management",
      "vehicle-management",
      ...COMMON_SOLUTION_IDS,
    ],
    highlights: [
      "Face + QR + Visitor + Vehicle",
      "List $122/mo → $99/mo",
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
    usdMonthly: null,
    usdAnnual: null,
    usdSetup: null,
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
    usdMonthly: null,
    usdAnnual: null,
    usdSetup: null,
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
    usdMonthly: null,
    usdAnnual: null,
    usdSetup: null,
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

/** USD rate card unit bases (pro-rata beyond these). */
export const RATE_CARD = {
  faceUsersBase: 25,
  faceMonthly: 25,
  faceAnnual: 250,
  qrCodesBase: 20,
  qrMonthly: 25,
  qrAnnual: 250,
  siteMonthly: 36,
  siteAnnual: 360,
  usersMaxOnline: 200,
  codesMaxOnline: 200,
  sitesMaxOnline: 10,
} as const;

/** Convert published USD package totals to INR for Razorpay. */
export const USD_TO_INR = Number(process.env.NEXT_PUBLIC_USD_TO_INR || 83);

/** Discrete bands for QR-Patrol-style drag (index → quantity). */
export const USER_STEPS = [25, 50, 75, 100, 150, 200] as const;
export const CODE_STEPS = [20, 40, 60, 80, 120, 200] as const;
export const SITE_STEPS = [1, 2, 3, 5, 8, 10] as const;

export type PackageQty = {
  users: number;
  codes: number;
  /** Visitor management site count. */
  visitorSites: number;
  /** Vehicle management site count. */
  vehicleSites: number;
};

export type PackageDimensions = {
  users: boolean;
  codes: boolean;
  visitorSites: boolean;
  vehicleSites: boolean;
};

export function packageDimensions(id: SolutionPackageId): PackageDimensions {
  switch (id) {
    case "face":
      return { users: true, codes: false, visitorSites: false, vehicleSites: false };
    case "qr-patrol":
      return { users: false, codes: true, visitorSites: false, vehicleSites: false };
    case "visitor":
      return { users: false, codes: false, visitorSites: true, vehicleSites: false };
    case "vehicle":
      return { users: false, codes: false, visitorSites: false, vehicleSites: true };
    case "workforce-duo":
      return { users: true, codes: true, visitorSites: false, vehicleSites: false };
    case "gate-duo":
      return { users: false, codes: false, visitorSites: true, vehicleSites: true };
    case "site-ops":
      return { users: true, codes: true, visitorSites: true, vehicleSites: true };
    default:
      return { users: false, codes: false, visitorSites: false, vehicleSites: false };
  }
}

export function defaultPackageQty(_id: SolutionPackageId): PackageQty {
  return {
    users: RATE_CARD.faceUsersBase,
    codes: RATE_CARD.qrCodesBase,
    visitorSites: 1,
    vehicleSites: 1,
  };
}

/** Bundle factor from published base price vs rate-card list at default qty. */
export function bundleFactor(packageId: SolutionPackageId, billing: PackageBilling) {
  const pkg = getPackage(packageId);
  if (pkg.quoteOnly || pkg.usdMonthly == null || pkg.usdAnnual == null) return 1;
  const dims = packageDimensions(packageId);
  const list = listPeriodUsd(dims, defaultPackageQty(packageId), billing);
  if (list <= 0) return 1;
  const published = billing === "monthly" ? pkg.usdMonthly : pkg.usdAnnual;
  return published / list;
}

export function qtySummary(dims: PackageDimensions, qty: PackageQty) {
  const parts: string[] = [];
  if (dims.users) parts.push(`${qty.users} users`);
  if (dims.codes) parts.push(`${qty.codes} codes`);
  if (dims.visitorSites) {
    parts.push(
      `${qty.visitorSites} visitor site${qty.visitorSites === 1 ? "" : "s"}`,
    );
  }
  if (dims.vehicleSites) {
    parts.push(
      `${qty.vehicleSites} vehicle site${qty.vehicleSites === 1 ? "" : "s"}`,
    );
  }
  return parts.join(" · ") || "Custom scope";
}

/** Normalize qty input; `sites` mirrors both modules when a split count is omitted. */
export function normalizePackageQty(
  dims: PackageDimensions,
  qtyInput?: Partial<PackageQty> & { sites?: number },
): PackageQty {
  const defaults = defaultPackageQty("face");
  const sharedSites =
    qtyInput?.sites != null ? Math.max(1, Math.round(qtyInput.sites)) : undefined;
  return {
    users: Math.max(1, Math.round(qtyInput?.users ?? defaults.users)),
    codes: Math.max(1, Math.round(qtyInput?.codes ?? defaults.codes)),
    visitorSites: Math.max(
      1,
      Math.round(
        qtyInput?.visitorSites ??
          (dims.visitorSites ? sharedSites : undefined) ??
          defaults.visitorSites,
      ),
    ),
    vehicleSites: Math.max(
      1,
      Math.round(
        qtyInput?.vehicleSites ??
          (dims.vehicleSites ? sharedSites : undefined) ??
          defaults.vehicleSites,
      ),
    ),
  };
}

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
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function usdToInr(usd: number) {
  return Math.round(usd * USD_TO_INR);
}

/**
 * Legacy helper (EUR plans). USD Smart Patrol packages are LUT zero-rated — no GST.
 */
export const GST_RATE = 0.18;
export const GST_PERCENT_LABEL = "18%";

export function applyGst(taxableInr: number) {
  const taxable = Math.max(0, Math.round(taxableInr));
  const gst = Math.round(taxable * GST_RATE);
  return {
    taxable,
    gst,
    total: taxable + gst,
  };
}

function listPeriodUsd(
  dims: PackageDimensions,
  qty: PackageQty,
  billing: PackageBilling,
) {
  let total = 0;
  if (dims.users) {
    const unit =
      billing === "monthly"
        ? RATE_CARD.faceMonthly / RATE_CARD.faceUsersBase
        : RATE_CARD.faceAnnual / RATE_CARD.faceUsersBase;
    total += qty.users * unit;
  }
  if (dims.codes) {
    const unit =
      billing === "monthly"
        ? RATE_CARD.qrMonthly / RATE_CARD.qrCodesBase
        : RATE_CARD.qrAnnual / RATE_CARD.qrCodesBase;
    total += qty.codes * unit;
  }
  const siteUnit = billing === "monthly" ? RATE_CARD.siteMonthly : RATE_CARD.siteAnnual;
  if (dims.visitorSites) total += qty.visitorSites * siteUnit;
  if (dims.vehicleSites) total += qty.vehicleSites * siteUnit;
  return total;
}

/**
 * Pro-rata quote from USD rate card + published bundle factor.
 * Beyond online max users/codes/sites → needsQuote.
 * INR fields are derived for Razorpay (USD × USD_TO_INR). No GST (LUT).
 */
export function quotePackage(
  packageId: SolutionPackageId,
  billing: PackageBilling,
  qtyInput?: Partial<PackageQty> & { sites?: number },
) {
  const pkg = getPackage(packageId);
  const dims = packageDimensions(packageId);
  const qty = normalizePackageQty(dims, qtyInput);

  if (pkg.quoteOnly || pkg.usdMonthly == null || pkg.usdAnnual == null || pkg.usdSetup == null) {
    return {
      pkg,
      billing,
      qty,
      dims,
      usdPeriod: null as number | null,
      usdSetup: null as number | null,
      usdListPeriod: null as number | null,
      inrPeriod: null as number | null,
      inrSetup: null as number | null,
      inrSubtotal: null as number | null,
      inrGst: null as number | null,
      inrDue: null as number | null,
      listPeriod: null as number | null,
      factor: 1,
      needsQuote: true as const,
    };
  }

  const factor = bundleFactor(packageId, billing);
  const overLimit =
    (dims.users && qty.users > RATE_CARD.usersMaxOnline) ||
    (dims.codes && qty.codes > RATE_CARD.codesMaxOnline) ||
    (dims.visitorSites && qty.visitorSites > RATE_CARD.sitesMaxOnline) ||
    (dims.vehicleSites && qty.vehicleSites > RATE_CARD.sitesMaxOnline);

  if (overLimit) {
    return {
      pkg,
      billing,
      qty,
      dims,
      usdPeriod: null as number | null,
      usdSetup: null as number | null,
      usdListPeriod: null as number | null,
      inrPeriod: null as number | null,
      inrSetup: null as number | null,
      inrSubtotal: null as number | null,
      inrGst: null as number | null,
      inrDue: null as number | null,
      listPeriod: null as number | null,
      factor,
      needsQuote: true as const,
    };
  }

  const listPeriod = listPeriodUsd(dims, qty, billing);
  const usdPeriod = Math.round(listPeriod * factor);
  const scale = Math.max(
    dims.users ? qty.users / RATE_CARD.faceUsersBase : 0,
    dims.codes ? qty.codes / RATE_CARD.qrCodesBase : 0,
    dims.visitorSites ? qty.visitorSites : 0,
    dims.vehicleSites ? qty.vehicleSites : 0,
    1,
  );
  const usdSetup = Math.round(pkg.usdSetup * Math.min(scale, 3));
  const inrPeriod = usdToInr(usdPeriod);
  const inrSetup = usdToInr(usdSetup);
  const inrSubtotal = inrPeriod + inrSetup;

  return {
    pkg,
    billing,
    qty,
    dims,
    usdPeriod,
    usdSetup,
    usdListPeriod: Math.round(listPeriod),
    inrPeriod,
    inrSetup,
    inrSubtotal,
    /** USD packages are LUT zero-rated — GST not charged. */
    inrGst: 0,
    /** Razorpay payable = INR(period + setup), no GST. */
    inrDue: inrSubtotal,
    listPeriod: Math.round(listPeriod),
    factor,
    needsQuote: false as const,
  };
}

/** Plan comparison columns (paid packages first, then quote-only). */
export const COMPARISON_PACKAGE_IDS: SolutionPackageId[] = [
  "face",
  "qr-patrol",
  "visitor",
  "vehicle",
  "workforce-duo",
  "gate-duo",
  "site-ops",
  "vision-ai",
];

export type ComparisonCell = boolean | "limited" | "quote" | "addon";

export type ComparisonRow = {
  feature: string;
  values: Partial<Record<SolutionPackageId, ComparisonCell>>;
};

export type ComparisonGroup = {
  title: string;
  rows: ComparisonRow[];
};

export const PLAN_COMPARISON: ComparisonGroup[] = [
  {
    title: "Workforce & checkpoints",
    rows: [
      {
        feature: "Face biometric attendance",
        values: { face: true, "workforce-duo": true, "site-ops": true },
      },
      {
        feature: "QR checkpoint scan patrolling",
        values: { "qr-patrol": true, "workforce-duo": true, "site-ops": true },
      },
      {
        feature: "Pro-rata users (drag to scale)",
        values: {
          face: true,
          "workforce-duo": true,
          "site-ops": true,
        },
      },
      {
        feature: "Pro-rata QR codes (drag to scale)",
        values: {
          "qr-patrol": true,
          "workforce-duo": true,
          "site-ops": true,
        },
      },
    ],
  },
  {
    title: "Gate & site control",
    rows: [
      {
        feature: "Visitor management",
        values: { visitor: true, "gate-duo": true, "site-ops": true },
      },
      {
        feature: "Vehicle management",
        values: { vehicle: true, "gate-duo": true, "site-ops": true },
      },
      {
        feature: "Visitor site scaling (drag)",
        values: {
          visitor: true,
          "gate-duo": true,
          "site-ops": true,
        },
      },
      {
        feature: "Vehicle site scaling (drag)",
        values: {
          vehicle: true,
          "gate-duo": true,
          "site-ops": true,
        },
      },
    ],
  },
  {
    title: "Operations & support",
    rows: [
      {
        feature: "Ticket Complaints Tracking System",
        values: {
          face: true,
          "qr-patrol": true,
          visitor: true,
          vehicle: true,
          "workforce-duo": true,
          "gate-duo": true,
          "site-ops": true,
          "vision-ai": true,
        },
      },
      {
        feature: "Mobile app access",
        values: {
          face: true,
          "qr-patrol": true,
          visitor: true,
          vehicle: true,
          "workforce-duo": true,
          "gate-duo": true,
          "site-ops": true,
          "vision-ai": "limited",
        },
      },
      {
        feature: "Web management console",
        values: {
          face: true,
          "qr-patrol": true,
          visitor: true,
          vehicle: true,
          "workforce-duo": true,
          "gate-duo": true,
          "site-ops": true,
          "vision-ai": true,
        },
      },
      {
        feature: "Real-time alerts & reports",
        values: {
          face: true,
          "qr-patrol": true,
          visitor: true,
          vehicle: true,
          "workforce-duo": true,
          "gate-duo": true,
          "site-ops": true,
          "vision-ai": true,
        },
      },
    ],
  },
  {
    title: "Vision AI & custom",
    rows: [
      {
        feature: "CCTV attendance / people counting",
        values: { "vision-ai": "quote" },
      },
      {
        feature: "ANPR & ID OCR",
        values: { "vision-ai": "quote" },
      },
      {
        feature: "Industry / Custom Build",
        values: { "vision-ai": "addon" },
      },
    ],
  },
];
