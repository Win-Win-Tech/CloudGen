import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export type LeadMailPayload = {
  kind: string;
  fullName: string;
  email: string;
  phone?: string | null;
  organization: string;
  interest?: string | null;
  message?: string | null;
  sites?: string | null;
  id: string;
};

function inbox() {
  return process.env.LEAD_INBOX?.trim() || site.email;
}

function subjectFor(kind: string) {
  switch (kind) {
    case "contact":
      return `New contact message — ${site.company}`;
    case "demo-test":
      return `New demo test request — ${site.product}`;
    case "register":
      return `New registration — ${site.product}`;
    default:
      return `New demo request — ${site.product}`;
  }
}

function textBody(payload: LeadMailPayload) {
  return [
    `Kind: ${payload.kind}`,
    `Name: ${payload.fullName}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "—"}`,
    `Organization: ${payload.organization}`,
    `Interest: ${payload.interest || "—"}`,
    `Sites: ${payload.sites || "—"}`,
    `Message: ${payload.message || "—"}`,
    `Reference: ${payload.id}`,
    "",
    `Sent from ${site.url}`,
  ].join("\n");
}

function htmlBody(payload: LeadMailPayload) {
  const rows: [string, string][] = [
    ["Kind", payload.kind],
    ["Name", payload.fullName],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Organization", payload.organization],
    ["Interest", payload.interest || "—"],
    ["Sites", payload.sites || "—"],
    ["Message", payload.message || "—"],
    ["Reference", payload.id],
  ];
  return `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#1a1f2c">
      <h2 style="margin:0 0 12px">${subjectFor(payload.kind)}</h2>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 10px;border:1px solid #d9e2ec;font-weight:600;width:140px">${label}</td>
            <td style="padding:8px 10px;border:1px solid #d9e2ec">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <p style="margin-top:16px;color:#5c6b7a;font-size:13px">Sent from ${escapeHtml(site.url)}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendWithResend(payload: LeadMailPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from =
    process.env.MAIL_FROM?.trim() ||
    `${site.company} <onboarding@resend.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [inbox()],
      reply_to: payload.email,
      subject: subjectFor(payload.kind),
      text: textBody(payload),
      html: htmlBody(payload),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend failed: ${detail}`);
  }
  return true;
}

async function sendWithSmtp(payload: LeadMailPayload) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.MAIL_FROM?.trim() ||
    `"${site.company}" <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: inbox(),
    replyTo: payload.email,
    subject: subjectFor(payload.kind),
    text: textBody(payload),
    html: htmlBody(payload),
  });
  return true;
}

/** Zero-config fallback — activates after first confirmation email to the inbox. */
async function sendWithFormSubmit(payload: LeadMailPayload) {
  const enabled =
    process.env.MAIL_PROVIDER === "formsubmit" ||
    process.env.FORMSUBMIT_ENABLED === "true" ||
    (!process.env.RESEND_API_KEY &&
      !process.env.SMTP_HOST &&
      process.env.FORMSUBMIT_ENABLED !== "false");

  if (!enabled) return false;

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox())}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: site.url,
      Referer: `${site.url}/contact`,
    },
    body: JSON.stringify({
      name: payload.fullName,
      email: payload.email,
      phone: payload.phone || "",
      organization: payload.organization,
      interest: payload.interest || "",
      message: payload.message || "",
      sites: payload.sites || "",
      kind: payload.kind,
      _subject: subjectFor(payload.kind),
      _template: "table",
      _replyto: payload.email,
    }),
  });

  const detail = await res.text();
  let parsed: { success?: string | boolean; message?: string } = {};
  try {
    parsed = JSON.parse(detail) as typeof parsed;
  } catch {
    /* non-JSON error body */
  }

  if (!res.ok || parsed.success === "false" || parsed.success === false) {
    if (parsed.message?.toLowerCase().includes("activation")) {
      throw new Error(
        `Activate form email sent to ${inbox()}. Open that inbox, click “Activate Form”, then submit again.`,
      );
    }
    throw new Error(`FormSubmit failed: ${parsed.message || detail}`);
  }
  return true;
}

/**
 * Notify sales inbox about a lead. Tries Resend → SMTP → FormSubmit.
 * Returns which provider was used, or throws if all configured paths fail.
 */
export async function sendLeadEmail(payload: LeadMailPayload) {
  if (await sendWithResend(payload)) return { provider: "resend" as const };
  if (await sendWithSmtp(payload)) return { provider: "smtp" as const };
  if (await sendWithFormSubmit(payload)) return { provider: "formsubmit" as const };

  throw new Error(
    "Email is not configured. Set RESEND_API_KEY, or SMTP_HOST/SMTP_USER/SMTP_PASS, or FORMSUBMIT_ENABLED=true.",
  );
}

export function mailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      (process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim()) ||
      process.env.MAIL_PROVIDER === "formsubmit" ||
      process.env.FORMSUBMIT_ENABLED === "true" ||
      (!process.env.RESEND_API_KEY &&
        !process.env.SMTP_HOST &&
        process.env.FORMSUBMIT_ENABLED !== "false"),
  );
}
