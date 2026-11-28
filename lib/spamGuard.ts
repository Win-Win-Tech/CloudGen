/**
 * Lead-form spam protection (register / demo / contact).
 * Bots that pass Zod still get stopped here so Hostinger SMTP is not flooded.
 */

const MIN_FORM_MS = 3_500;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_PER_IP = 3;
/** Soft global cap across warm instances — stops distributed bot storms. */
const GLOBAL_WINDOW_MS = 60 * 1000;
const GLOBAL_MAX = 20;

/** Best-effort in-memory rate limit (warm serverless instances). */
const hitsByIp = new Map<string, number[]>();
const globalHits: number[] = [];

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "discard.email",
  "mailnesia.com",
  "maildrop.cc",
  "tempail.com",
  "throwaway.email",
  "fakeinbox.com",
  "emailondeck.com",
  "moakt.com",
  "inboxkitten.com",
  "guerrillamailblock.com",
  "spam4.me",
  "grr.la",
]);

export type LeadSpamInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  organization: string;
  sites?: string | null;
  interest?: string | null;
  message?: string | null;
  /** Honeypot — must be empty. */
  website?: string | null;
  companyUrl?: string | null;
  /** Client timestamp when the form was shown (ms). */
  formStartedAt?: number | string | null;
};

export type SpamVerdict = {
  spam: boolean;
  reason?: string;
};

function vowelsIn(text: string) {
  return (text.match(/[aeiou]/gi) || []).length;
}

function lettersOnly(text: string) {
  return text.replace(/[^a-z]/gi, "");
}

/** Random keyboard mash like "Vgrjvvhgd" / "Fxhjlfmri". */
export function looksLikeGibberish(raw: string) {
  const cleaned = raw
    .replace(/\b(llc|ltd|inc|pvt|private|limited|co|corp|company)\b/gi, "")
    .trim();
  const letters = lettersOnly(cleaned);
  if (letters.length < 5) return false;

  const vowels = vowelsIn(letters);
  const ratio = vowels / letters.length;
  if (vowels === 0) return true;
  if (letters.length >= 6 && ratio < 0.18) return true;

  // Long consonant runs (e.g. "vgrjvvhgd").
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(letters)) return true;

  // Alternating case entropy typical of bots (AAXTdmfIhEkt…).
  const shifts = (letters.match(/[a-z][A-Z]|[A-Z][a-z]/g) || []).length;
  if (letters.length >= 10 && shifts >= 4 && ratio < 0.35) return true;

  // Mostly consonants with almost no spaces / words.
  if (letters.length >= 8 && !/\s/.test(cleaned) && ratio < 0.28) return true;

  return false;
}

function emailDomain(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 0) return "";
  return email.slice(at + 1).toLowerCase().trim();
}

function emailLocal(email: string) {
  const at = email.lastIndexOf("@");
  if (at < 0) return "";
  return email.slice(0, at).toLowerCase().trim();
}

function isDisposableEmail(email: string) {
  const domain = emailDomain(email);
  if (!domain) return true;
  return DISPOSABLE_DOMAINS.has(domain);
}

/**
 * Domains that commonly appear in bounce/spam-trap traffic
 * (e.g. MailChannels 550 SDC blocks to l3@support.com).
 * Never send CRM nurture / marketing mail here.
 */
const BLOCKED_OUTBOUND_DOMAINS = new Set([
  "support.com",
  "email.com",
  "mail.com",
  "tester.com",
  "test.com",
  "example.com",
  "example.org",
  "example.net",
  "localhost",
  "invalid",
  "localdomain",
  ...DISPOSABLE_DOMAINS,
]);

/**
 * True when we must NOT send customer-facing email to this address.
 * Used by CRM follow-ups and sendSimpleEmail recipient filtering.
 */
export function isUnsafeOutboundRecipient(email: string) {
  const addr = String(email || "").trim().toLowerCase();
  if (!addr.includes("@") || addr.includes(" ")) return true;
  const domain = emailDomain(addr);
  if (!domain || BLOCKED_OUTBOUND_DOMAINS.has(domain)) return true;
  // Single-label / nonsense hosts
  if (!domain.includes(".")) return true;
  if (isDisposableEmail(addr) || emailLooksFake(addr)) return true;
  // Very short random locals like l3@… are common spam-trap probes
  const local = emailLocal(addr);
  if (local.length <= 2 && !/^(me|hi|it|hr|cx|ceo)$/i.test(local)) return true;
  if (/^[a-z]\d{1,3}$/i.test(local)) return true; // l3, a1, x99
  return false;
}

function emailLooksFake(email: string) {
  const local = emailLocal(email);
  if (!local || local.length < 2) return true;
  // Random local parts: long strings of consonants / digits.
  if (looksLikeGibberish(local.replace(/[._+-]/g, ""))) return true;
  const digits = (local.match(/\d/g) || []).length;
  if (local.length >= 8 && digits / local.length >= 0.45) return true;
  return false;
}

function phoneLooksFake(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return true;
  if (/^(\d)\1{9,}$/.test(digits)) return true;
  if (/^(0123456789|1234567890|9876543210)/.test(digits)) return true;
  return false;
}

export function clientIp(request: Request) {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return (
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

function rateLimited(ip: string) {
  const now = Date.now();
  const prev = (hitsByIp.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  prev.push(now);
  hitsByIp.set(ip, prev);
  // Bound map growth.
  if (hitsByIp.size > 5_000) {
    const oldest = [...hitsByIp.entries()].slice(0, 500);
    for (const [key] of oldest) hitsByIp.delete(key);
  }
  return prev.length > RATE_MAX_PER_IP;
}

function globalRateLimited() {
  const now = Date.now();
  while (globalHits.length && now - globalHits[0]! >= GLOBAL_WINDOW_MS) {
    globalHits.shift();
  }
  globalHits.push(now);
  return globalHits.length > GLOBAL_MAX;
}

function originAllowed(request: Request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") || "";
  const allowedHosts = [
    host,
    "www.cloudgentechnologies.com",
    "cloudgentechnologies.com",
    "cloud-gen-zeta.vercel.app",
    "localhost:3000",
    "127.0.0.1:3000",
  ].filter(Boolean);

  const okUrl = (raw: string | null) => {
    if (!raw) return false;
    try {
      const u = new URL(raw);
      return allowedHosts.some(
        (h) => u.host === h || u.hostname === h.replace(/:\d+$/, ""),
      );
    } catch {
      return false;
    }
  };

  // Browsers always send Origin on POST from fetch; allow missing in same-origin edge cases
  // only when Referer is present and valid.
  if (origin) return okUrl(origin);
  if (referer) return okUrl(referer);
  return false;
}

export function assessLeadSpam(
  input: LeadSpamInput,
  request: Request,
): SpamVerdict {
  const honeypot = `${input.website || ""}${input.companyUrl || ""}`.trim();
  if (honeypot) {
    return { spam: true, reason: "honeypot" };
  }

  const started = Number(input.formStartedAt);
  // Real LeadForm always sends formStartedAt. Bots that omit it are spam.
  if (!Number.isFinite(started) || started <= 0) {
    return { spam: true, reason: "no-timing" };
  }
  const elapsed = Date.now() - started;
  if (elapsed < 0 || elapsed < MIN_FORM_MS) {
    return { spam: true, reason: "too-fast" };
  }
  // Stale / forged timestamps (form open > 6h).
  if (elapsed > 6 * 60 * 60 * 1000) {
    return { spam: true, reason: "stale-timing" };
  }

  if (!originAllowed(request)) {
    return { spam: true, reason: "bad-origin" };
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return { spam: true, reason: "rate-limit" };
  }
  if (globalRateLimited()) {
    return { spam: true, reason: "global-rate" };
  }

  if (isDisposableEmail(input.email) || emailLooksFake(input.email)) {
    return { spam: true, reason: "email" };
  }

  if (looksLikeGibberish(input.fullName) || looksLikeGibberish(input.organization)) {
    return { spam: true, reason: "gibberish" };
  }

  if (input.phone && phoneLooksFake(input.phone)) {
    return { spam: true, reason: "phone" };
  }

  // Register "sites" must be a small integer when provided.
  if (input.sites != null && String(input.sites).trim() !== "") {
    const sites = String(input.sites).trim();
    if (!/^\d{1,4}$/.test(sites) || Number(sites) < 1) {
      return { spam: true, reason: "sites" };
    }
  }

  if (input.message && looksLikeGibberish(input.message) && input.message.length > 20) {
    return { spam: true, reason: "message" };
  }

  return { spam: false };
}

/** Fake success so bots do not retry with new payloads. */
export function silentSpamResponse() {
  return {
    ok: true as const,
    id: crypto.randomUUID(),
    mailed: false as const,
    message:
      "Registration received. Our team will share onboarding next steps shortly.",
  };
}
