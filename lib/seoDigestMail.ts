import type { SeoDailyReport } from "@/lib/seoDaily";
import { sendSimpleEmail } from "@/lib/mail";
import { site } from "@/lib/site";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatSeoDigest(report: SeoDailyReport) {
  const date = report.checkedAt.slice(0, 10);
  const statusLabel =
    report.failing.length === 0
      ? "All clear"
      : `${report.failing.length} URL issue(s)`;

  const subject = `[SEO daily] ${statusLabel} · ${site.product} · ${date}`;

  const failLines =
    report.failing.length === 0
      ? ["None — all monitored URLs OK."]
      : report.failing.map(
          (f) =>
            `- ${f.path} → ${f.status ?? "ERR"}${f.error ? ` (${f.error})` : ""} ${f.url}`,
        );

  const kw = report.focus.keywords.slice(0, 8).map((k) => `- ${k}`);

  const text = [
    `CloudGen / SmartPatrol — daily SEO digest (${date})`,
    "",
    `Health: ${report.okCount}/${report.total} OK`,
    `Focus cluster today: ${report.focus.cluster}`,
    `Primary page: ${report.focus.primaryUrl}`,
    "",
    "Failing URLs:",
    ...failLines,
    "",
    "Today's keyword focus (optimize titles/H1/FAQ or a short guide):",
    ...kw,
    "",
    "Search Console:",
    `- Performance: ${report.gscLinks.performance}`,
    `- Indexing: ${report.gscLinks.indexing}`,
    `- Removals: ${report.gscLinks.removals}`,
    "",
    `Site: ${site.url}`,
  ].join("\n");

  const failHtml =
    report.failing.length === 0
      ? `<p style="color:#0f7b3a">None — all monitored URLs OK.</p>`
      : `<ul>${report.failing
          .map(
            (f) =>
              `<li><code>${escapeHtml(f.path)}</code> → <strong>${f.status ?? "ERR"}</strong> ${escapeHtml(f.url)}${f.error ? ` <em>(${escapeHtml(f.error)})</em>` : ""}</li>`,
          )
          .join("")}</ul>`;

  const kwHtml = `<ul>${report.focus.keywords
    .slice(0, 8)
    .map((k) => `<li>${escapeHtml(k)}</li>`)
    .join("")}</ul>`;

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#1a1f2c;max-width:640px">
      <h2 style="margin:0 0 8px">Daily SEO digest</h2>
      <p style="margin:0 0 16px;color:#5c6b7a">${escapeHtml(date)} · ${escapeHtml(site.product)}</p>
      <p><strong>Health:</strong> ${report.okCount}/${report.total} OK</p>
      <p><strong>Focus cluster:</strong> ${escapeHtml(report.focus.cluster)}<br/>
         <strong>Primary page:</strong> <code>${escapeHtml(report.focus.primaryUrl)}</code></p>
      <h3 style="margin:20px 0 8px">Failing URLs</h3>
      ${failHtml}
      <h3 style="margin:20px 0 8px">Keyword focus today</h3>
      ${kwHtml}
      <h3 style="margin:20px 0 8px">Search Console</h3>
      <ul>
        <li><a href="${report.gscLinks.performance}">Performance</a></li>
        <li><a href="${report.gscLinks.indexing}">Indexing</a></li>
        <li><a href="${report.gscLinks.removals}">Removals</a></li>
      </ul>
      <p style="margin-top:20px;color:#5c6b7a;font-size:13px">${escapeHtml(site.url)}</p>
    </div>
  `;

  return { subject, text, html };
}

export async function sendSeoDailyDigest(report: SeoDailyReport) {
  const { subject, text, html } = formatSeoDigest(report);
  const to =
    process.env.SEO_DIGEST_TO?.trim() ||
    process.env.LEAD_INBOX?.trim() ||
    site.email;
  return sendSimpleEmail({ to, subject, text, html });
}
