import Razorpay from "razorpay";
import crypto from "node:crypto";

function looksLikePlaceholder(value: string) {
  const v = value.trim().toLowerCase();
  return (
    !v ||
    v.includes("xxxxxxxx") ||
    v.includes("your_") ||
    v.includes("replace") ||
    /^rzp_(live|test)_x+$/i.test(v) ||
    v === "rzp_live_xxx" ||
    v === "rzp_test_xxx"
  );
}

export function getRazorpayKeyId() {
  return process.env.RAZORPAY_KEY_ID?.trim() || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";
}

export function getRazorpayKeySecret() {
  return process.env.RAZORPAY_KEY_SECRET?.trim() || "";
}

export function razorpayConfigured() {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  return Boolean(
    keyId &&
      keySecret &&
      !looksLikePlaceholder(keyId) &&
      !looksLikePlaceholder(keySecret) &&
      (keyId.startsWith("rzp_live_") || keyId.startsWith("rzp_test_")),
  );
}

export function getRazorpay() {
  const key_id = getRazorpayKeyId();
  const key_secret = getRazorpayKeySecret();
  if (!razorpayConfigured()) {
    throw new Error("Razorpay keys are not configured");
  }
  return new Razorpay({ key_id, key_secret });
}

export function verifyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = getRazorpayKeySecret();
  if (!secret || looksLikePlaceholder(secret)) return false;
  const body = `${input.orderId}|${input.paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === input.signature;
}
