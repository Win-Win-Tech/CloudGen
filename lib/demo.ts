import crypto from "node:crypto";
import { site } from "@/lib/site";

/** Free demo window for app testing (override with DEMO_DURATION_DAYS). */
export const DEMO_DURATION_DAYS = Number(process.env.DEMO_DURATION_DAYS || 7);

export type DemoAccountRecord = {
  id: string;
  request_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string;
  username: string;
  password_hash: string;
  password_hint: string;
  status: string;
  starts_at: string | Date;
  expires_at: string | Date;
  last_validated_at: string | Date | null;
  created_at: string | Date;
};

export function hashDemoPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function generateDemoPassword() {
  // Easy to type on mobile, still random enough for short-lived demos.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const bytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function generateDemoUsername(organization: string, email: string) {
  const org = organization
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 10);
  const mail = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 6) || "user";
  const suffix = crypto.randomBytes(2).toString("hex");
  return `demo.${org || mail}.${suffix}`;
}

export function demoWindow(from = new Date()) {
  const startsAt = from;
  const expiresAt = new Date(from.getTime() + DEMO_DURATION_DAYS * 24 * 60 * 60 * 1000);
  return { startsAt, expiresAt };
}

export function isDemoExpired(account: Pick<DemoAccountRecord, "expires_at" | "status">) {
  if (account.status === "revoked" || account.status === "expired") return true;
  return new Date(account.expires_at).getTime() <= Date.now();
}

export function demoStatus(account: DemoAccountRecord) {
  if (account.status === "revoked") return "revoked" as const;
  if (isDemoExpired(account)) return "expired" as const;
  return "active" as const;
}

export function msRemaining(expiresAt: string | Date) {
  return Math.max(0, new Date(expiresAt).getTime() - Date.now());
}

export function formatDemoExpiry(expiresAt: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(expiresAt));
}

export function demoInstructions(input: {
  username: string;
  password: string;
  expiresAt: string | Date;
}) {
  return [
    `Your ${site.product} free demo is ready.`,
    "",
    `Username: ${input.username}`,
    `Password: ${input.password}`,
    `Valid until: ${formatDemoExpiry(input.expiresAt)} IST (${DEMO_DURATION_DAYS} days)`,
    "",
    "How to test:",
    `1. Install the ${site.appName} / ${site.product} app from Google Play (${site.playStoreUrl})`,
    "2. Open the app and sign in with the demo username and password above",
    "3. Try QR checkpoint scan, face attendance, visitors/vehicles and tickets",
    "",
    "When the demo expires:",
    "- Login is rejected by the demo validate API / app backend",
    "- Status becomes expired; credentials stop working automatically",
    "- Subscribe at /pricing or /checkout to continue without interruption",
    "",
    `Support: ${site.email}`,
  ].join("\n");
}
