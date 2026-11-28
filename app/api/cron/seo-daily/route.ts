import { NextResponse } from "next/server";
import { crmSnapshot, processDueFollowups } from "@/lib/crm";
import { fetchGaDailyReport, gaReportConfigured } from "@/lib/gaReport";
import { fetchGscDailyReport, gscReportConfigured } from "@/lib/gscReport";
import { mailConfigured, sendSimpleEmail } from "@/lib/mail";
import { runSeoHealthCheck } from "@/lib/seoDaily";
import { sendSeoDailyDigest } from "@/lib/seoDigestMail";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}

/**
 * Daily SEO + GA4 + Search Console + CRM follow-ups (Vercel Cron).
 * - URL health check
 * - Google Search Console keyword / click tables
 * - GA4 Data API traffic snapshot
 * - CRM nurture emails due today (day 2 / 5 / 10; day 0 also fires on form submit)
 * - Email digests
 *
 * Schedule: vercel.json → 30 3 * * * (09:00 IST)
 * CRM stays on this job so we do not exceed Hobby cron limits / intervals.
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [report, ga, gsc, crmRun] = await Promise.all([
    runSeoHealthCheck(),
    gaReportConfigured()
      ? fetchGaDailyReport()
      : Promise.resolve(null),
    gscReportConfigured()
      ? fetchGscDailyReport()
      : Promise.resolve(null),
    processDueFollowups(50).catch((err: unknown) => ({
      processed: 0,
      sent: 0,
      failed: 0,
      completed: 0,
      skipped: 0,
      details: [],
      error: err instanceof Error ? err.message : "CRM follow-up failed",
    })),
  ]);

  let mail: { sent: boolean; provider: string } = {
    sent: false,
    provider: "none",
  };

  if (mailConfigured()) {
    mail = await sendSeoDailyDigest(report, ga, gsc);
  }

  let crmSummaryMail: { sent: boolean; provider: string } = {
    sent: false,
    provider: "none",
  };
  const crmOk = !("error" in crmRun && crmRun.error);
  if (
    mailConfigured() &&
    crmOk &&
    (crmRun.sent > 0 || crmRun.failed > 0 || crmRun.completed > 0)
  ) {
    const snapshot = await crmSnapshot().catch(() => null);
    const lines = [
      `CloudGen CRM follow-up run (with SEO daily)`,
      "",
      `Processed: ${crmRun.processed}`,
      `Sent: ${crmRun.sent}`,
      `Failed: ${crmRun.failed}`,
      `Completed sequences: ${crmRun.completed}`,
      `Skipped: ${crmRun.skipped}`,
      "",
      "Details:",
      ...crmRun.details
        .slice(0, 30)
        .map(
          (d) =>
            `- ${d.email} · ${d.step} · ${d.status}${d.error ? ` (${d.error})` : ""}`,
        ),
      "",
      ...(snapshot
        ? [
            "CRM snapshot:",
            ...snapshot.stages.map((s) => `- ${s.stage}: ${s.count}`),
            `- Open sales tasks: ${snapshot.openTasks}`,
            `- Active sequences: ${snapshot.activeSequences}`,
            "",
          ]
        : []),
      site.url,
    ];
    crmSummaryMail = await sendSimpleEmail({
      to: process.env.CRM_DIGEST_TO?.trim() || site.email,
      subject: `[CRM] ${crmRun.sent} follow-up(s) sent · ${crmRun.completed} sequence(s) done`,
      text: lines.join("\n"),
      html: `<pre style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.45">${lines
        .map((l) =>
          l
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;"),
        )
        .join("\n")}</pre>`,
    });
  }

  return NextResponse.json({
    ok:
      report.failing.length === 0 &&
      !(ga?.error && !ga.yesterday) &&
      !(gsc?.error && !gsc.totals) &&
      crmOk &&
      crmRun.failed === 0,
    checkedAt: report.checkedAt,
    total: report.total,
    okCount: report.okCount,
    failing: report.failing.map((f) => ({
      path: f.path,
      status: f.status,
      error: f.error,
    })),
    focus: {
      cluster: report.focus.cluster,
      primaryUrl: report.focus.primaryUrl,
      keywords: report.focus.keywords.slice(0, 8),
    },
    searchConsole: gsc
      ? {
          configured: gsc.configured,
          siteUrl: gsc.siteUrl,
          startDate: gsc.startDate,
          endDate: gsc.endDate,
          error: gsc.error,
          totals: gsc.totals,
          topQueries: gsc.topQueries.slice(0, 10),
        }
      : { configured: false },
    analytics: ga
      ? {
          configured: ga.configured,
          propertyId: ga.propertyId,
          error: ga.error,
          yesterday: ga.yesterday,
          last7Days: ga.last7Days,
          topPages: ga.topPages.slice(0, 5),
          topChannels: ga.topChannels.slice(0, 5),
        }
      : { configured: false },
    crm: crmRun,
    crmSummaryMail,
    mail,
  });
}
