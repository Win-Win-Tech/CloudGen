import { NextResponse } from "next/server";
import { getRazorpayKeyId, getRazorpayKeySecret, razorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

function placeholderReason(value: string) {
  const v = value.trim().toLowerCase();
  if (!v) return "empty";
  if (v.includes("xxxxxxxx")) return "contains-xxxxxxxx";
  if (v.includes("your_")) return "contains-your_";
  if (v.includes("replace")) return "contains-replace";
  if (v === "rzp_live_xxx" || v === "rzp_test_xxx") return "xxx-placeholder";
  return null;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return NextResponse.json({
    configured: razorpayConfigured(),
    hasKeyId: Boolean(keyId),
    hasSecret: Boolean(keySecret),
    keyIdLen: keyId.length,
    keySecretLen: keySecret.length,
    keyIdPrefix: keyId ? keyId.slice(0, 9) : "",
    keyIdSuffixOk: /_[A-Za-z0-9]+$/.test(keyId),
    startsLive: keyId.startsWith("rzp_live_"),
    startsTest: keyId.startsWith("rzp_test_"),
    idPlaceholder: placeholderReason(keyId),
    secretPlaceholder: placeholderReason(keySecret),
  });
}
