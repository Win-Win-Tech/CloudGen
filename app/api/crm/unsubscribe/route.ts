import { NextResponse } from "next/server";
import {
  unsubscribeContact,
  verifyUnsubscribeToken,
} from "@/lib/crm";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.trim() || "";
  const token = url.searchParams.get("token")?.trim() || "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return new NextResponse(
      `<!doctype html><html><body style="font-family:system-ui;padding:2rem">
        <h1>Invalid unsubscribe link</h1>
        <p>Please contact <a href="mailto:${site.email}">${site.email}</a> if you need help.</p>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  await unsubscribeContact(email);

  return new NextResponse(
    `<!doctype html><html><body style="font-family:system-ui;padding:2rem;max-width:32rem">
      <h1>You are unsubscribed</h1>
      <p>${email} will no longer receive automated ${site.product} follow-up emails.</p>
      <p><a href="${site.url}">Back to ${site.company}</a></p>
    </body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
