import type { GaDailyReport } from "@/lib/gaReport";
import { formatDuration, formatPct } from "@/lib/gaReport";
import type { GscDailyReport, GscQueryRow } from "@/lib/gscReport";
import { formatCtr, formatPosition } from "@/lib/gscReport";
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

function listLines(
  rows: { label: string; value: number }[],
  empty = "None yet.",
) {
  if (!rows.length) return [empty];
  return rows.map((r) => `- ${r.label}: ${r.value}`);
}

function listHtml(
  rows: { label: string; value: number }[],
  empty = "None yet.",
) {
  if (!rows.length) return `<p style="color:#5c6b7a">${escapeHtml(empty)}</p>`;
  return `<ul>${rows
    .map(
      (r) =>
        `<li><code>${escapeHtml(r.label)}</code> — <strong>${r.value}</strong></li>`,
    )
    .join("")}</ul>`;
}

function gaTextBlock(ga: GaDailyReport | null | undefined) {
  if (!ga) {
    return ["Google Analytics:", "- Not included in this run."];
  }
  if (!ga.configured) {
    return [
      "Google Analytics:",
      `- Not configured (${ga.error || "set GA4_PROPERTY_ID + GA_SERVICE_ACCOUNT_JSON"})`,
    ];
  }
  if (ga.error && !ga.yesterday) {
    return ["Google Analytics:", `- API error: ${ga.error}`];
  }

  const y = ga.yesterday!;
  const w = ga.last7Days!;
  return [
    "Google Analytics (GA4)",
    `Property: ${ga.propertyId}`,
    "",
    "Yesterday:",
    `- Active users: ${y.activeUsers}`,
    `- Sessions: ${y.sessions}`,
    `- Page views: ${y.screenPageViews}`,
    `- Engaged sessions: ${y.engagedSessions}`,
    `- Avg session: ${formatDuration(y.averageSessionDurationSec)}`,
    `- Bounce rate: ${formatPct(y.bounceRate)}`,
    "",
    "Last 7 days:",
    `- Active users: ${w.activeUsers}`,
    `- Sessions: ${w.sessions}`,
    `- Page views: ${w.screenPageViews}`,
    `- Engaged sessions: ${w.engagedSessions}`,
    "",
    "Top pages (7d, views):",
    ...listLines(ga.topPages),
    "",
    "Top channels (7d, sessions):",
    ...listLines(ga.topChannels),
    "",
    "Top countries (7d, users):",
    ...listLines(ga.topCountries),
    "",
    "Top sources / medium (7d):",
    ...listLines(ga.topSources),
    "",
    "Organic search landing pages (7d):",
    ...listLines(ga.organicLandingPages, "No organic landings yet."),
  ];
}

function gscTableText(rows: GscQueryRow[], empty: string) {
  if (!rows.length) return [empty];
  return [
    "Keyword / page | Clicks | Impressions | CTR | Avg position",
    ...rows.map(
      (r) =>
        `${r.query} | ${r.clicks} | ${r.impressions} | ${formatCtr(r.ctr)} | ${formatPosition(r.position)}`,
    ),
  ];
}

function gscTableHtml(rows: GscQueryRow[], empty: string, firstCol: string) {
  if (!rows.length) {
    return `<p style="color:#5c6b7a">${escapeHtml(empty)}</p>`;
  }
  const head = `
    <tr>
      <th align="left" style="padding:6px 8px;border-bottom:1px solid #d9e2ec">${escapeHtml(firstCol)}</th>
      <th align="right" style="padding:6px 8px;border-bottom:1px solid #d9e2ec">Clicks</th>
      <th align="right" style="padding:6px 8px;border-bottom:1px solid #d9e2ec">Impressions</th>
      <th align="right" style="padding:6px 8px;border-bottom:1px solid #d9e2ec">CTR</th>
      <th align="right" style="padding:6px 8px;border-bottom:1px solid #d9e2ec">Avg pos</th>
    </tr>`;
  const body = rows
    .map(
      (r) => `
    <tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eef2f6;max-width:280px;word-break:break-word">${escapeHtml(r.query)}</td>
      <td align="right" style="padding:6px 8px;border-bottom:1px solid #eef2f6"><strong>${r.clicks}</strong></td>
      <td align="right" style="padding:6px 8px;border-bottom:1px solid #eef2f6">${r.impressions}</td>
      <td align="right" style="padding:6px 8px;border-bottom:1px solid #eef2f6">${escapeHtml(formatCtr(r.ctr))}</td>
      <td align="right" style="padding:6px 8px;border-bottom:1px solid #eef2f6">${escapeHtml(formatPosition(r.position))}</td>
    </tr>`,
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:13px;margin:8px 0 16px">${head}${body}</table>`;
}

function gscTextBlock(gsc: GscDailyReport | null | undefined) {
  if (!gsc) {
    return ["Google Search keywords:", "- Not included in this run."];
  }
  if (!gsc.configured) {
    return [
      "Google Search keywords:",
      `- Not configured (${gsc.error || "set GA_SERVICE_ACCOUNT_JSON + add the service account to Search Console"})`,
    ];
  }
  if (gsc.error && !gsc.totals) {
    return ["Google Search keywords:", `- API error: ${gsc.error}`];
  }

  const t = gsc.totals!;
  return [
    "Google Search keywords (Search Console)",
    `Property: ${gsc.siteUrl}`,
    `Period: ${gsc.startDate} → ${gsc.endDate} (GSC data lags ~2–3 days)`,
    "",
    "People from Google Search (period totals):",
    `- Clicks (visited from Google): ${t.clicks}`,
    `- Impressions (showed in Google results): ${t.impressions}`,
    `- CTR: ${formatCtr(t.ctr)}`,
    `- Avg position: ${formatPosition(t.position)}`,
    "",
    "Top keywords customers typed in Google:",
    ...gscTableText(gsc.topQueries, "No keyword data yet for this period."),
    "",
    "Top landing pages from Google:",
    ...gscTableText(gsc.topPages, "No page data yet for this period."),
  ];
}

function gscHtmlBlock(gsc: GscDailyReport | null | undefined) {
  if (!gsc) {
    return `<p style="color:#5c6b7a">Not included in this run.</p>`;
  }
  if (!gsc.configured) {
    return `<p style="color:#b45309">Not configured — set <code>GA_SERVICE_ACCOUNT_JSON</code>, enable Search Console API in GCP, and add the service account email as a user on the Search Console property${gsc.error ? ` (${escapeHtml(gsc.error)})` : ""}.</p>`;
  }
  if (gsc.error && !gsc.totals) {
    return `<p style="color:#b91c1c">API error: ${escapeHtml(gsc.error)}</p>`;
  }

  const t = gsc.totals!;
  return `
    <p style="color:#5c6b7a;margin:0 0 8px">Property <code>${escapeHtml(String(gsc.siteUrl))}</code><br/>
    Period <strong>${escapeHtml(String(gsc.startDate))}</strong> → <strong>${escapeHtml(String(gsc.endDate))}</strong> (Search Console lags ~2–3 days)</p>
    <h4 style="margin:12px 0 6px">People from Google Search</h4>
    <ul>
      <li>Clicks (visited from Google): <strong>${t.clicks}</strong></li>
      <li>Impressions (appeared in Google): <strong>${t.impressions}</strong></li>
      <li>CTR: <strong>${escapeHtml(formatCtr(t.ctr))}</strong></li>
      <li>Avg position: <strong>${escapeHtml(formatPosition(t.position))}</strong></li>
    </ul>
    <h4 style="margin:12px 0 6px">Keywords customers searched on Google</h4>
    ${gscTableHtml(gsc.topQueries, "No keyword data yet for this period.", "Keyword")}
    <h4 style="margin:12px 0 6px">Landing pages from Google</h4>
    ${gscTableHtml(gsc.topPages, "No page data yet for this period.", "Page")}
  `;
}

function gaHtmlBlock(ga: GaDailyReport | null | undefined) {
  if (!ga) {
    return `<p style="color:#5c6b7a">Not included in this run.</p>`;
  }
  if (!ga.configured) {
    return `<p style="color:#b45309">Not configured — set <code>GA4_PROPERTY_ID</code> and <code>GA_SERVICE_ACCOUNT_JSON</code>.</p>`;
  }
  if (ga.error && !ga.yesterday) {
    return `<p style="color:#b91c1c">API error: ${escapeHtml(ga.error)}</p>`;
  }

  const y = ga.yesterday!;
  const w = ga.last7Days!;
  return `
    <p style="color:#5c6b7a;margin:0 0 8px">Property <code>${escapeHtml(String(ga.propertyId))}</code></p>
    <h4 style="margin:12px 0 6px">Yesterday</h4>
    <ul>
      <li>Active users: <strong>${y.activeUsers}</strong></li>
      <li>Sessions: <strong>${y.sessions}</strong></li>
      <li>Page views: <strong>${y.screenPageViews}</strong></li>
      <li>Engaged sessions: <strong>${y.engagedSessions}</strong></li>
      <li>Avg session: <strong>${escapeHtml(formatDuration(y.averageSessionDurationSec))}</strong></li>
      <li>Bounce rate: <strong>${escapeHtml(formatPct(y.bounceRate))}</strong></li>
    </ul>
    <h4 style="margin:12px 0 6px">Last 7 days</h4>
    <ul>
      <li>Active users: <strong>${w.activeUsers}</strong></li>
      <li>Sessions: <strong>${w.sessions}</strong></li>
      <li>Page views: <strong>${w.screenPageViews}</strong></li>
      <li>Engaged sessions: <strong>${w.engagedSessions}</strong></li>
    </ul>
    <h4 style="margin:12px 0 6px">Top pages (7d)</h4>
    ${listHtml(ga.topPages)}
    <h4 style="margin:12px 0 6px">Top channels (7d)</h4>
    ${listHtml(ga.topChannels)}
    <h4 style="margin:12px 0 6px">Top countries (7d)</h4>
    ${listHtml(ga.topCountries)}
    <h4 style="margin:12px 0 6px">Top sources / medium (7d)</h4>
    ${listHtml(ga.topSources)}
    <h4 style="margin:12px 0 6px">Organic landing pages (7d)</h4>
    ${listHtml(ga.organicLandingPages, "No organic landings yet.")}
  `;
}

export function formatSeoDigest(
  report: SeoDailyReport,
  ga?: GaDailyReport | null,
  gsc?: GscDailyReport | null,
) {
  const date = report.checkedAt.slice(0, 10);
  const statusLabel =
    report.failing.length === 0
      ? "All clear"
      : `${report.failing.length} URL issue(s)`;

  const gscClicks = gsc?.totals?.clicks;
  const trafficHint =
    typeof gscClicks === "number" && gscClicks > 0
      ? ` · ${gscClicks} Google clicks`
      : ga?.yesterday && ga.yesterday.sessions > 0
        ? ` · ${ga.yesterday.sessions} sess yesterday`
        : "";

  const subject = `[SEO daily] ${statusLabel}${trafficHint} · ${site.product} · ${date}`;

  const failLines =
    report.failing.length === 0
      ? ["None — all monitored URLs OK."]
      : report.failing.map(
          (f) =>
            `- ${f.path} → ${f.status ?? "ERR"}${f.error ? ` (${f.error})` : ""} ${f.url}`,
        );

  const kw = report.focus.keywords.slice(0, 8).map((k) => `- ${k}`);

  const text = [
    `CloudGen / SmartPatrol — daily SEO + Analytics digest (${date})`,
    "",
    `Health: ${report.okCount}/${report.total} OK`,
    `Focus cluster today: ${report.focus.cluster}`,
    `Primary page: ${report.focus.primaryUrl}`,
    "",
    "Failing URLs:",
    ...failLines,
    "",
    ...gscTextBlock(gsc),
    "",
    ...gaTextBlock(ga),
    "",
    "Today's keyword focus (optimize titles/H1/FAQ or a short guide):",
    ...kw,
    "",
    "Search Console links:",
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
    <div style="font-family:Segoe UI,Arial,sans-serif;line-height:1.5;color:#1a1f2c;max-width:720px">
      <h2 style="margin:0 0 8px">Daily SEO + Analytics digest</h2>
      <p style="margin:0 0 16px;color:#5c6b7a">${escapeHtml(date)} · ${escapeHtml(site.product)}</p>
      <p><strong>Health:</strong> ${report.okCount}/${report.total} OK</p>
      <p><strong>Focus cluster:</strong> ${escapeHtml(report.focus.cluster)}<br/>
         <strong>Primary page:</strong> <code>${escapeHtml(report.focus.primaryUrl)}</code></p>
      <h3 style="margin:20px 0 8px">Failing URLs</h3>
      ${failHtml}
      <h3 style="margin:20px 0 8px">Google Search keywords</h3>
      ${gscHtmlBlock(gsc)}
      <h3 style="margin:20px 0 8px">Google Analytics</h3>
      ${gaHtmlBlock(ga)}
      <h3 style="margin:20px 0 8px">Keyword focus today</h3>
      ${kwHtml}
      <h3 style="margin:20px 0 8px">Search Console links</h3>
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

export async function sendSeoDailyDigest(
  report: SeoDailyReport,
  ga?: GaDailyReport | null,
  gsc?: GscDailyReport | null,
) {
  const { subject, text, html } = formatSeoDigest(report, ga, gsc);
  // Prefer explicit SEO_DIGEST_TO; otherwise sales@ only (never auto-CC founder).
  const to =
    process.env.SEO_DIGEST_TO?.trim() || site.email;
  return sendSimpleEmail({ to, subject, text, html });
}
