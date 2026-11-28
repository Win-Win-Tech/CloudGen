import { site } from "@/lib/site";

export type SequenceStep = {
  key: string;
  /** Hours after enrollment before this step may send. */
  delayHours: number;
  subject: (name: string) => string;
  text: (args: {
    fullName: string;
    organization: string;
    interest?: string | null;
    unsubscribeUrl: string;
  }) => string;
  html: (args: {
    fullName: string;
    organization: string;
    interest?: string | null;
    unsubscribeUrl: string;
  }) => string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "there";
}

const footerText = (unsubscribeUrl: string) =>
  [
    "",
    "—",
    `${site.company} · ${site.product}`,
    site.url,
    `Sales: ${site.email} · ${site.phone}`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

const footerHtml = (unsubscribeUrl: string) => `
  <p style="margin-top:24px;padding-top:16px;border-top:1px solid #d9e2ec;color:#5c6b7a;font-size:12px;line-height:1.5">
    ${escapeHtml(site.company)} · ${escapeHtml(site.product)}<br/>
    <a href="${escapeHtml(site.url)}">${escapeHtml(site.url)}</a><br/>
    Sales: <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a> · ${escapeHtml(site.phone)}<br/>
    <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe from follow-up emails</a>
  </p>`;

/** Opt-in nurture sequence for website leads (demo / contact / register). */
export const LEAD_NURTURE_STEPS: SequenceStep[] = [
  {
    key: "day0_thanks",
    delayHours: 0,
    subject: (name) =>
      `Thanks ${firstName(name)} — we received your ${site.product} request`,
    text: ({ fullName, organization, interest, unsubscribeUrl }) =>
      [
        `Hi ${firstName(fullName)},`,
        "",
        `Thanks for reaching out to ${site.company} about ${site.product}${interest ? ` (${interest})` : ""}.`,
        `We've logged your request for ${organization || "your team"} and our sales team will follow up shortly.`,
        "",
        "Meanwhile you can explore:",
        `- Solutions: ${site.url}/solutions`,
        `- Pricing: ${site.url}/pricing`,
        `- Book / contact: ${site.url}/contact`,
        "",
        "Reply to this email anytime with your sites, guard count, or preferred demo slot.",
        footerText(unsubscribeUrl),
      ].join("\n"),
    html: ({ fullName, organization, interest, unsubscribeUrl }) => `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;color:#1a1f2c;max-width:600px">
        <p>Hi ${escapeHtml(firstName(fullName))},</p>
        <p>Thanks for reaching out to <strong>${escapeHtml(site.company)}</strong> about
        <strong>${escapeHtml(site.product)}</strong>${interest ? ` (${escapeHtml(interest)})` : ""}.</p>
        <p>We've logged your request for <strong>${escapeHtml(organization || "your team")}</strong>
        and our sales team will follow up shortly.</p>
        <p>Meanwhile you can explore:</p>
        <ul>
          <li><a href="${escapeHtml(site.url)}/solutions">Solutions</a></li>
          <li><a href="${escapeHtml(site.url)}/pricing">Pricing</a></li>
          <li><a href="${escapeHtml(site.url)}/contact">Contact / demo</a></li>
        </ul>
        <p>Reply anytime with your sites, guard count, or preferred demo slot.</p>
        ${footerHtml(unsubscribeUrl)}
      </div>`,
  },
  {
    key: "day2_value",
    delayHours: 48,
    subject: () =>
      `${site.product}: QR patrol, attendance & visitor control in one stack`,
    text: ({ fullName, unsubscribeUrl }) =>
      [
        `Hi ${firstName(fullName)},`,
        "",
        `${site.product} helps security and facility teams replace paper registers with live proof:`,
        "- QR checkpoint guard tours with missed-scan alerts",
        "- Face biometric attendance for field staff",
        "- Visitor and vehicle gate workflows",
        "",
        `See modules: ${site.url}/solutions`,
        `Customer stories: ${site.url}/testimonials`,
        "",
        "If you share how many sites and guards you run, we can map a package for you.",
        footerText(unsubscribeUrl),
      ].join("\n"),
    html: ({ fullName, unsubscribeUrl }) => `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;color:#1a1f2c;max-width:600px">
        <p>Hi ${escapeHtml(firstName(fullName))},</p>
        <p><strong>${escapeHtml(site.product)}</strong> helps security and facility teams replace paper registers with live proof:</p>
        <ul>
          <li>QR checkpoint guard tours with missed-scan alerts</li>
          <li>Face biometric attendance for field staff</li>
          <li>Visitor and vehicle gate workflows</li>
        </ul>
        <p>
          <a href="${escapeHtml(site.url)}/solutions">See modules</a> ·
          <a href="${escapeHtml(site.url)}/testimonials">Customer stories</a>
        </p>
        <p>If you share how many sites and guards you run, we can map a package for you.</p>
        ${footerHtml(unsubscribeUrl)}
      </div>`,
  },
  {
    key: "day5_proof",
    delayHours: 120,
    subject: () =>
      `How teams use ${site.product} for live accountability`,
    text: ({ fullName, unsubscribeUrl }) =>
      [
        `Hi ${firstName(fullName)},`,
        "",
        "Ops leads usually ask three things before a demo:",
        "1) Can supervisors see missed checkpoints in real time?",
        "2) Can attendance and visitor logs survive audits?",
        "3) Will guards actually use the mobile app?",
        "",
        `${site.product}'s Guards app is built for field use (Android), with supervisor dashboards for proof of rounds and tickets.`,
        "",
        `App details: ${site.url}/app`,
        `Pricing overview: ${site.url}/pricing`,
        "",
        "Want a 20-minute walkthrough this week? Reply with two time slots.",
        footerText(unsubscribeUrl),
      ].join("\n"),
    html: ({ fullName, unsubscribeUrl }) => `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;color:#1a1f2c;max-width:600px">
        <p>Hi ${escapeHtml(firstName(fullName))},</p>
        <p>Ops leads usually ask three things before a demo:</p>
        <ol>
          <li>Can supervisors see missed checkpoints in real time?</li>
          <li>Can attendance and visitor logs survive audits?</li>
          <li>Will guards actually use the mobile app?</li>
        </ol>
        <p><strong>${escapeHtml(site.product)}</strong>'s Guards app is built for field use (Android),
        with supervisor dashboards for proof of rounds and tickets.</p>
        <p>
          <a href="${escapeHtml(site.url)}/app">App details</a> ·
          <a href="${escapeHtml(site.url)}/pricing">Pricing</a>
        </p>
        <p>Want a 20-minute walkthrough this week? Reply with two time slots.</p>
        ${footerHtml(unsubscribeUrl)}
      </div>`,
  },
  {
    key: "day10_cta",
    delayHours: 240,
    subject: () => `Shall we schedule your ${site.product} demo?`,
    text: ({ fullName, organization, unsubscribeUrl }) =>
      [
        `Hi ${firstName(fullName)},`,
        "",
        `Quick check-in for ${organization || "your team"}.`,
        `If ${site.product} is still on your radar, we can run a short demo tailored to your sites and workflows.`,
        "",
        `Book / write to us: ${site.url}/contact`,
        `Or reply here / call ${site.phone}.`,
        "",
        "If the timing is not right, reply \"later\" and we will pause follow-ups.",
        footerText(unsubscribeUrl),
      ].join("\n"),
    html: ({ fullName, organization, unsubscribeUrl }) => `
      <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;color:#1a1f2c;max-width:600px">
        <p>Hi ${escapeHtml(firstName(fullName))},</p>
        <p>Quick check-in for <strong>${escapeHtml(organization || "your team")}</strong>.</p>
        <p>If <strong>${escapeHtml(site.product)}</strong> is still on your radar, we can run a short demo
        tailored to your sites and workflows.</p>
        <p>
          <a href="${escapeHtml(site.url)}/contact">Contact / book demo</a> ·
          ${escapeHtml(site.phone)}
        </p>
        <p>If the timing is not right, reply &quot;later&quot; and we will pause follow-ups.</p>
        ${footerHtml(unsubscribeUrl)}
      </div>`,
  },
];

export const LEAD_NURTURE_SEQUENCE_KEY = "lead_nurture";
