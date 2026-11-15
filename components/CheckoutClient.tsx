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

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  initialPlan: PlanId;
  initialGuards: number;
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
  initialPlan,
  initialGuards,
  initialBilling,
  razorpayKeyId,
  razorpayReady,
}: Props) {
  const [planId] = useState<PlanId>(initialPlan);
  const [guards] = useState(initialGuards);
  const [billing] = useState<BillingCycle>(initialBilling);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "paid" | "error">("idle");
  const [message, setMessage] = useState("");

  const quote = useMemo(
    () => quotePlan(planId, guards, billing),
    [planId, guards, billing],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (quote.needsQuote || !quote.inrDue) {
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
        body: JSON.stringify({
          planId,
          guards,
          billing,
          fullName,
          email,
          phone,
          organization,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Could not create payment order");
      }

      if (orderData.mode === "demo") {
        setStatus("paid");
        setMessage(
          `Demo checkout recorded for ${quote.plan.name}. Add Razorpay keys to enable live payments. Reference: ${orderData.subscriptionId}`,
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
        description: `${quote.plan.name} · ${guards} guards · ${billing}`,
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
            `Payment successful. Subscription ${verifyData.subscriptionId} is active.`,
          );
        },
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
            <dt className="text-[var(--steel)]">Plan</dt>
            <dd className="font-semibold">{quote.plan.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--steel)]">Guards</dt>
            <dd className="font-semibold">{guards}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--steel)]">Billing</dt>
            <dd className="font-semibold capitalize">{billing}</dd>
          </div>
          {!quote.needsQuote ? (
            <>
              <div className="flex justify-between gap-4 border-t border-[var(--line)] pt-3">
                <dt className="text-[var(--steel)]">List price</dt>
                <dd className="font-semibold">{formatEUR(quote.eurDue!)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--steel)]">Pay with Razorpay</dt>
                <dd className="display text-2xl font-extrabold text-[var(--teal-deep)]">
                  {formatINR(quote.inrDue!)}
                </dd>
              </div>
            </>
          ) : null}
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-[var(--steel)]">
          Online payments are processed by Razorpay for {site.company}. EUR package
          pricing follows the QR-Patrol-style pricelist; INR is charged at the
          configured conversion rate for Indian checkout.
        </p>
        {!razorpayReady ? (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
            Live Razorpay keys are not set yet. Checkout will run in demo mode until
            secrets are configured.
          </p>
        ) : null}
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
          <input className="input mt-1" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Organization
          <input className="input mt-1" required value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </label>
        <button className="btn-primary w-full" type="submit" disabled={status === "paying"}>
          {status === "paying" ? "Preparing payment…" : "Pay subscription with Razorpay"}
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
