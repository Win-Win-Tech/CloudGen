import { NextResponse } from "next/server";
import { crmSnapshot, processDueFollowups } from "@/lib/crm";
import { mailConfigured, sendSimpleEmail } from "@/lib/mail";
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
 * Recurring CRM agent job:
 * - Sends due lead nurture emails (day 0 / 2 / 5 / 10)
 * - Creates sales follow-up tasks when a sequence finishes
 * - Emails sales@ a short run summary when work was done
 *
 * Schedule: vercel.json every 2 hours (minute 0).
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const run = await processDueFollowups(50);
  const snapshot = await crmSnapshot();

  let summaryMail: { sent: boolean; provider: string } = {
    sent: false,
    provider: "none",
  };

  if (mailConfigured() && (run.sent > 0 || run.failed > 0 || run.completed > 0)) {
    const lines = [
      `CloudGen CRM follow-up run`,
      "",
      `Processed: ${run.processed}`,
      `Sent: ${run.sent}`,
      `Failed: ${run.failed}`,
      `Completed sequences: ${run.completed}`,
      `Skipped: ${run.skipped}`,
      "",
      "Details:",
      ...run.details
        .slice(0, 30)
        .map((d) => `- ${d.email} · ${d.step} · ${d.status}${d.error ? ` (${d.error})` : ""}`),
      "",
      "CRM snapshot:",
      ...snapshot.stages.map((s) => `- ${s.stage}: ${s.count}`),
      `- Open sales tasks: ${snapshot.openTasks}`,
      `- Active sequences: ${snapshot.activeSequences}`,
      "",
      site.url,
    ];

    summaryMail = await sendSimpleEmail({
      to: process.env.CRM_DIGEST_TO?.trim() || site.email,
      subject: `[CRM] ${run.sent} follow-up(s) sent · ${run.completed} sequence(s) done`,
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
    ok: run.failed === 0,
    run,
    snapshot,
    summaryMail,
  });
}
