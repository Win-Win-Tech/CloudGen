/**
 * Pricing mirrored from https://www.qrpatrol.com/pricing (EUR).
 * Guard-count tiers and monthly / annual totals match their published pricelist.
 */

export type PlanId = "base" | "pro" | "gold";
export type BillingCycle = "monthly" | "annual";

export type GuardTierId = "1-3" | "4-9" | "10-24" | "25-49" | "50-100";

export const GUARD_TIERS: {
  id: GuardTierId;
  label: string;
  min: number;
  max: number;
}[] = [
  { id: "1-3", label: "1–3 guards", min: 1, max: 3 },
  { id: "4-9", label: "4–9 guards", min: 4, max: 9 },
  { id: "10-24", label: "10–24 guards", min: 10, max: 24 },
  { id: "25-49", label: "25–49 guards", min: 25, max: 49 },
  { id: "50-100", label: "50–100 guards", min: 50, max: 100 },
];

export type TierPrice = {
  monthly: number;
  annualMonthly: number;
  annualTotal: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  blurb: string;
  popular?: boolean;
  fromPerGuard: number;
  prices: Record<GuardTierId, TierPrice>;
  features: string[];
};

export const PLANS: Plan[] = [
  {
    id: "base",
    name: "Base",
    blurb: "QR checkpoint patrolling, GPS monitoring, alerts and daily reports.",
    fromPerGuard: 2.64,
    prices: {
      "1-3": { monthly: 47, annualMonthly: 39, annualTotal: 479 },
      "4-9": { monthly: 95, annualMonthly: 80, annualTotal: 969 },
      "10-24": { monthly: 155, annualMonthly: 131, annualTotal: 1581 },
      "25-49": { monthly: 227, annualMonthly: 192, annualTotal: 2315 },
      "50-100": { monthly: 311, annualMonthly: 264, annualTotal: 3172 },
    },
    features: [
      "QR code checkpoint scan patrolling",
      "Geolocation & GPS monitoring",
      "Schedules & real-time alerts",
      "Daily activity reports",
      "Ticket Complaints Tracking System",
      "Missed-scan issue alerts",
      "Visitor management (add-on)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Face attendance, visitors, vehicles and Ticket Complaints Tracking System.",
    popular: true,
    fromPerGuard: 5.07,
    prices: {
      "1-3": { monthly: 90, annualMonthly: 76, annualTotal: 918 },
      "4-9": { monthly: 182, annualMonthly: 154, annualTotal: 1856 },
      "10-24": { monthly: 297, annualMonthly: 252, annualTotal: 3029 },
      "25-49": { monthly: 435, annualMonthly: 369, annualTotal: 4437 },
      "50-100": { monthly: 596, annualMonthly: 506, annualTotal: 6079 },
    },
    features: [
      "Everything in Base",
      "Face biometric attendance",
      "Visitor management system",
      "Vehicle management system",
      "Ticket Complaints Tracking System",
      "SOS, welfare check & indoor location",
      "ID card OCR & API access",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    blurb: "Full stack with CCTV AI analytics, trails, BI reporting and priority support.",
    fromPerGuard: 9.53,
    prices: {
      "1-3": { monthly: 179, annualMonthly: 143, annualTotal: 1718 },
      "4-9": { monthly: 363, annualMonthly: 290, annualTotal: 3485 },
      "10-24": { monthly: 593, annualMonthly: 474, annualTotal: 5693 },
      "25-49": { monthly: 869, annualMonthly: 695, annualTotal: 8342 },
      "50-100": { monthly: 1191, annualMonthly: 952, annualTotal: 11434 },
    },
    features: [
      "Everything in Pro",
      "CCTV attendance & people counting",
      "ANPR number-plate recognition",
      "Virtual checkpoints & guard trail",
      "Advanced / BI performance reports",
      "Industry apps & custom builds (add-on)",
      "Priority 24×7 support",
    ],
  },
];

export const COMPARISON: {
  group: string;
  rows: { name: string; base: string | boolean; pro: string | boolean; gold: string | boolean }[];
}[] = [
  {
    group: "Workforce management",
    rows: [
      { name: "Mobile App — Face Biometric Attendance System", base: false, pro: true, gold: true },
      { name: "CCTV — CCTV Attendance System", base: false, pro: "Add-on", gold: true },
      { name: "GPS geofencing & shift controls", base: true, pro: true, gold: true },
      { name: "Schedules & multi-site access", base: "Limited", pro: true, gold: true },
    ],
  },
  {
    group: "Security operations",
    rows: [
      { name: "Mobile App — QR Code Checkpoint Scan Patrolling System", base: true, pro: true, gold: true },
      { name: "Mobile App — Visitor Management System", base: "Add-on", pro: true, gold: true },
      { name: "Mobile App — Vehicle Management System", base: false, pro: true, gold: true },
      { name: "Virtual checkpoints & guard trail", base: false, pro: false, gold: true },
    ],
  },
  {
    group: "Incident & command centre",
    rows: [
      { name: "Missed-scan / basic issue alerts", base: true, pro: true, gold: true },
      {
        name: "Mobile App — Availability Command Centre — Ticket Complaints Tracking System",
        base: true,
        pro: true,
        gold: true,
      },
      { name: "In-app SOS & welfare check", base: "In-app SOS", pro: true, gold: true },
      { name: "Full incident evidence (voice / image / video)", base: false, pro: true, gold: true },
    ],
  },
  {
    group: "CCTV AI analytics",
    rows: [
      { name: "CCTV — CCTV Attendance System", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "CCTV — CCTV People Counting", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "CCTV — CCTV ANPR (Automatic Number Plate Recognition)", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "CCTV / Mobile App — CCTV / Mobile OCR for ID Cards", base: "Quote", pro: "Quote", gold: "Quote" },
    ],
  },
  {
    group: "Industry apps",
    rows: [
      { name: "Web App — Hospital Management System", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "Web App — Pharmacy Billing System", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "Mobile App — AI Chatbot Doctor Appointment Booking", base: "Quote", pro: "Quote", gold: "Quote" },
    ],
  },
  {
    group: "Custom development",
    rows: [
      { name: "Custom — Web App Development", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "Custom — Mobile App Development", base: "Quote", pro: "Quote", gold: "Quote" },
      { name: "Custom — Website Development", base: "Quote", pro: "Quote", gold: "Quote" },
    ],
  },
  {
    group: "Reporting, access & integrations",
    rows: [
      { name: "Real-time alerts & daily reports", base: true, pro: true, gold: true },
      { name: "Advanced / BI performance reports", base: false, pro: false, gold: true },
      { name: "Multi-level access & audit log", base: "Limited", pro: "Limited", gold: true },
      { name: "API access", base: false, pro: true, gold: true },
      { name: "Priority 24×7 support", base: false, pro: false, gold: true },
    ],
  },
];

export const EUR_TO_INR = Number(process.env.NEXT_PUBLIC_EUR_TO_INR || 90);

export function tierForGuards(guards: number): GuardTierId | "quote" {
  if (guards < 1) return "1-3";
  if (guards > 100) return "quote";
  const tier = GUARD_TIERS.find((t) => guards >= t.min && guards <= t.max);
  return tier?.id ?? "quote";
}

export function getPlan(id: PlanId) {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

export function quotePlan(planId: PlanId, guards: number, billing: BillingCycle) {
  const plan = getPlan(planId);
  const tierId = tierForGuards(guards);
  if (tierId === "quote") {
    return {
      plan,
      tierId,
      guards,
      billing,
      eurMonthly: null as number | null,
      eurDue: null as number | null,
      inrDue: null as number | null,
      perGuard: null as number | null,
      needsQuote: true as const,
      annualTotal: null as number | null,
    };
  }
  const price = plan.prices[tierId];
  const eurMonthly = billing === "monthly" ? price.monthly : price.annualMonthly;
  const eurDue = billing === "monthly" ? price.monthly : price.annualTotal;
  const inrDue = Math.round(eurDue * EUR_TO_INR);
  const perGuard = Number((eurMonthly / guards).toFixed(2));
  return {
    plan,
    tierId,
    guards,
    billing,
    eurMonthly,
    eurDue,
    inrDue,
    perGuard,
    needsQuote: false as const,
    annualTotal: price.annualTotal,
  };
}

export function formatEUR(n: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
