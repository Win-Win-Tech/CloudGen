"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BillingCycle,
  formatEUR,
  formatINR,
  PlanId,
  quotePlan,
} from "@/lib/pricing";
import { site } from "@/lib/site";
import {
  formatUSD,
  quotePackage,
  SolutionPackageId,
  USD_TO_INR,
} from "@/lib/solutions";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: Record<string, unknown>) => void) => void;
    };
  }
}

type Props = {
  mode: "plan" | "package";
  initialPlan?: PlanId;
  initialPackage?: SolutionPackageId;
  initialGuards?: number;
  initialBilling: BillingCycle;
  razorpayKeyId: string;
  razorpayReady: boolean;
};

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutClient({
  mode,
  initialPlan = "pro",
  initialPackage = "operations",
  initialGuards = 8,
  initialBilling,
  razorpayKeyId,
  razorpayReady,
}: Props) {
  const [planId] = useState<PlanId>(initialPlan);
  const [packageId] = useState<SolutionPackageId>(initialPackage);
  const [guards] = useState(initialGuards);
  const [billing] = useState<BillingCycle>(initialBilling);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");

  const planQuote = useMemo(
    () => quotePlan(planId, guards, billing),
    [planId, guards, billing],
  );
  const packageQuote = useMemo(
    () => quotePackage(packageId, billing),
    [packageId, billing],
  );

  const summary =
    mode === "package"
      ? {
          title: packageQuote.pkg.name,
          subtitle: `${packageQuote.pkg.solutionIds.length} solutions · ${billing}`,
          listLabel: "USD total (period + setup)",
          listValue: formatUSD(packageQuote.usdDue),
          payInr: packageQuote.inrDue,
          detail: `Period ${formatUSD(packageQuote.usdPeriod)} + setup ${formatUSD(packageQuote.usdSetup)} · FX ≈ ₹${USD_TO_INR}/USD`,
          canPay: true,
        }
      : {
          title: planQuote.plan.name,
          subtitle: `${guards} guards · ${billing}`,
          listLabel: "List price",
          listValue: planQuote.needsQuote ? "Custom quote" : formatEUR(planQuote.eurDue!),
          payInr: planQuote.inrDue,
          detail:
            "EUR package pricing; INR charged via Razorpay at the configured conversion rate.",
          canPay: !planQuote.needsQuote && Boolean(planQuote.inrDue),
        };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!summary.canPay || !summary.payInr) {
      setStatus("error");
      setMessage("This selection needs a custom quote. Please contact sales.");
      return;
    }

    setStatus("paying");
    setMessage("");

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "package"
            ? {
                packageId,
                billing,
                fullName,
                email,
                phone,
                organization,
              }
            : {
                planId,
                guards,
                billing,
                fullName,
                email,
                phone,
                organization,
              },
        ),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Could not create payment order");
      }

      if (orderData.mode === "demo") {
        setStatus("paid");
        setMessage(
          `Demo checkout recorded for ${summary.title}. Add live Razorpay keys in .env.local / Vercel to enable real payments. Reference: ${orderData.subscriptionId}`,
        );
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        throw new Error("Unable to load Razorpay Checkout");
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId || orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: site.company,
        description: orderData.description || `${summary.title} · ${summary.subtitle}`,
        order_id: orderData.orderId,
        prefill: { name: fullName, email, contact: phone },
        theme: { color: "#0f8f9a" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subscriptionId: orderData.subscriptionId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setStatus("error");
            setMessage(verifyData.error || "Payment verification failed");
            return;
          }
          setStatus("paid");
          setMessage(
            `Payment successful. Subscription ${verifyData.subscriptionId} is active. Payment ID: ${verifyData.paymentId}`,
          );
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setMessage("Payment window closed. You can try again when ready.");
          },
        },
      });

      rzp.on("payment.failed", (response) => {
        const err = response.error as { description?: string } | undefined;
        setStatus("error");
        setMessage(err?.description || "Payment failed. Please try again.");
      });

      rzp.open();
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Checkout failed");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="card-panel h-fit p-6">
        <p className="eyebrow">Order summary</p>
        <h1 className="display mt-2 text-3xl font-extrabold">Checkout</h1>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--steel)]">
              {mode === "package" ? "Package" : "Plan"}
            </dt>
            <dd className="font-semibold">{summary.title}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--steel)]">Details</dt>
            <dd className="font-semibold capitalize text-right">{summary.subtitle}</dd>
          </div>
          {summary.canPay ? (
            <>
              <div className="flex justify-between gap-4 border-t border-[var(--line)] pt-3">
                <dt className="text-[var(--steel)]">{summary.listLabel}</dt>
                <dd className="font-semibold">{summary.listValue}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--steel)]">Pay with Razorpay</dt>
                <dd className="display text-2xl font-extrabold text-[var(--teal-deep)]">
                  {formatINR(summary.payInr!)}
                </dd>
              </div>
            </>
          ) : null}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-[var(--steel)]">
          {summary.detail} Online payments are processed securely by Razorpay for{" "}
          {site.company}.
        </p>
        {!razorpayReady ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            Live Razorpay keys are not set yet. Checkout will run in demo mode until
            you add <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in
            `.env.local` (and Vercel env for production).
          </p>
        ) : (
          <p className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-900">
            Razorpay is connected. You will be charged in INR via UPI / cards / netbanking.
          </p>
        )}
      </aside>

      <form className="card-panel space-y-4 p-6" onSubmit={onSubmit}>
        <p className="eyebrow">Billing details</p>
        <h2 className="display text-2xl font-bold">Subscriber information</h2>
        <label className="block text-sm font-semibold">
          Full name
          <input className="input mt-1" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Work email
          <input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Mobile
          <input className="input mt-1" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Organization
          <input className="input mt-1" required value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </label>
        <button className="btn-primary w-full" type="submit" disabled={status === "paying" || !summary.canPay}>
          {status === "paying"
            ? "Preparing payment…"
            : `Pay ${summary.payInr ? formatINR(summary.payInr) : ""} with Razorpay`}
        </button>
        {message ? (
          <p
            className={`rounded-md px-3 py-2 text-sm ${
              status === "paid"
                ? "bg-emerald-50 text-emerald-900"
                : status === "error"
                  ? "bg-rose-50 text-rose-900"
                  : "bg-slate-50 text-slate-800"
            }`}
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
