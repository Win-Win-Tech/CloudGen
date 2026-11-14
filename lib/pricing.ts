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
    blurb: "QR/NFC checkpoints, GPS monitoring, alerts and daily reports.",
    fromPerGuard: 2.64,
    prices: {
      "1-3": { monthly: 47, annualMonthly: 39, annualTotal: 479 },
      "4-9": { monthly: 95, annualMonthly: 80, annualTotal: 969 },
      "10-24": { monthly: 155, annualMonthly: 131, annualTotal: 1581 },
      "25-49": { monthly: 227, annualMonthly: 192, annualTotal: 2315 },
      "50-100": { monthly: 311, annualMonthly: 264, annualTotal: 3172 },
    },
    features: [
      "Geolocation & GPS monitoring",
      "Real-time alerts & email notifications",
      "Daily activity reports",
      "Schedules management",
      "NFC / QR-code checkpoints",
      "Beacon checkpoints",
      "User management",
      "Multilevel access (limited)",
      "Issue management (missed scans)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Everything in Base, plus mobile management, SOS and face verification.",
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
      "Mobile management & mobile forms",
      "Welfare check",
      "External SOS button",
      "Man-down functionality",
      "Indoor location",
      "Face verification",
      "SSO login (upon request)",
      "API access",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    blurb: "Full operations suite with attendance, trails, branding and advanced reporting.",
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
      "Time & attendance",
      "Full issue management",
      "Virtual checkpoints & guard trail",
      "Actions log & Safepass",
      "Personalized login & logo on reports",
      "Custom fields & asset tracking",
      "Advanced / performance reporting",
      "Business intelligence tool",
    ],
  },
];

export const COMPARISON: {
  group: string;
  rows: { name: string; base: string | boolean; pro: string | boolean; gold: string | boolean }[];
}[] = [
  {
    group: "Proof of presence & accountability",
    rows: [
      { name: "QR-Codes", base: true, pro: true, gold: true },
      { name: "NFC Tags", base: true, pro: true, gold: true },
      { name: "Beacons", base: true, pro: true, gold: true },
      { name: "Virtual checkpoints", base: false, pro: false, gold: true },
      { name: "Schedules management", base: true, pro: true, gold: true },
    ],
  },
  {
    group: "Real-time tracking & geolocation",
    rows: [
      { name: "GPS monitoring", base: true, pro: true, gold: true },
      { name: "Geofencing", base: true, pro: true, gold: true },
      { name: "Indoor location", base: false, pro: true, gold: true },
      { name: "Guard trail", base: false, pro: false, gold: true },
    ],
  },
  {
    group: "Safety & emergency response",
    rows: [
      { name: "In-app SOS", base: true, pro: true, gold: true },
      { name: "External SOS", base: false, pro: true, gold: true },
      { name: "Man-down alerts", base: false, pro: true, gold: true },
      { name: "Welfare check", base: false, pro: true, gold: true },
      { name: "Safepass", base: false, pro: false, gold: true },
    ],
  },
  {
    group: "Security & access control",
    rows: [
      { name: "Multi-level access", base: "Limited", pro: "Limited", gold: true },
      { name: "Face verification", base: false, pro: true, gold: true },
      { name: "Actions log", base: false, pro: false, gold: true },
      { name: "Visitor management", base: "Add-on", pro: "Add-on", gold: "Add-on" },
    ],
  },
  {
    group: "Tasks & reporting",
    rows: [
      { name: "Time & attendance", base: false, pro: false, gold: true },
      { name: "Issue management", base: "Limited", pro: "Limited", gold: true },
      { name: "Real-time & daily reports", base: true, pro: true, gold: true },
      { name: "Mobile forms", base: false, pro: true, gold: true },
      { name: "Performance / BI reports", base: false, pro: false, gold: true },
      { name: "API access", base: false, pro: true, gold: true },
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
