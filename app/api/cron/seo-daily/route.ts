import { NextResponse } from "next/server";
import { fetchGaDailyReport, gaReportConfigured } from "@/lib/gaReport";
import { fetchGscDailyReport, gscReportConfigured } from "@/lib/gscReport";
import { mailConfigured } from "@/lib/mail";
import { runSeoHealthCheck } from "@/lib/seoDaily";
import { sendSeoDailyDigest } from "@/lib/seoDigestMail";

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
 * Daily SEO + GA4 + Search Console automation (Vercel Cron).
 * - URL health check
 * - Google Search Console keyword / click tables
 * - GA4 Data API traffic snapshot
 * - Email digest
 *
 * Schedule: vercel.json → 30 3 * * * (09:00 IST)
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [report, ga, gsc] = await Promise.all([
    runSeoHealthCheck(),
    gaReportConfigured()
      ? fetchGaDailyReport()
      : Promise.resolve(null),
    gscReportConfigured()
      ? fetchGscDailyReport()
      : Promise.resolve(null),
  ]);

  let mail: { sent: boolean; provider: string } = {
    sent: false,
    provider: "none",
  };

  if (mailConfigured()) {
    mail = await sendSeoDailyDigest(report, ga, gsc);
  }

  return NextResponse.json({
    ok:
      report.failing.length === 0 &&
      !(ga?.error && !ga.yesterday) &&
      !(gsc?.error && !gsc.totals),
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
    mail,
  });
}
