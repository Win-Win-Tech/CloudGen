import { NextResponse } from "next/server";
import { mailConfigured } from "@/lib/mail";
import { sendSocialDailyDigest } from "@/lib/socialDigestMail";
import { getDailySocialPack } from "@/lib/socialPosts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}

/**
 * Daily social content pack (Vercel Cron).
 * Emails ready-to-post copy for LinkedIn, X, Facebook, Instagram, WhatsApp, YouTube.
 * Schedule: vercel.json → 0 4 * * * (09:30 IST)
 */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pack = getDailySocialPack();
  let mail: { sent: boolean; provider: string } = {
    sent: false,
    provider: "none",
  };

  if (mailConfigured()) {
    mail = await sendSocialDailyDigest(pack);
  }

  return NextResponse.json({
    ok: true,
    dateKey: pack.dateKey,
    theme: pack.theme,
    pageUrl: pack.pageUrl,
    networks: [
      "linkedin",
      "x",
      "facebook",
      "instagram",
      "whatsapp",
      "youtube",
    ],
    mail,
  });
}
