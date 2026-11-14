import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";
import { BillingCycle, PlanId } from "@/lib/pricing";
import { getRazorpayKeyId, razorpayConfigured } from "@/lib/razorpay";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Subscribe to SmartPatrol and pay securely online with Razorpay.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; guards?: string; billing?: string }>;
}) {
  const params = await searchParams;
  const plan = (["base", "pro", "gold"].includes(params.plan || "")
    ? params.plan
    : "pro") as PlanId;
  const guards = Math.min(100, Math.max(1, Number(params.guards || 8) || 8));
  const billing = (params.billing === "annual" ? "annual" : "monthly") as BillingCycle;

  return (
    <div className="shell py-12 pb-16">
      <CheckoutClient
        initialPlan={plan}
        initialGuards={guards}
        initialBilling={billing}
        razorpayKeyId={getRazorpayKeyId()}
        razorpayReady={razorpayConfigured()}
      />
    </div>
  );
}
