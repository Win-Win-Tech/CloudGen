import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";
import { BillingCycle, PlanId } from "@/lib/pricing";
import { getRazorpayKeyId, razorpayConfigured } from "@/lib/razorpay";
import { SOLUTION_PACKAGES, SolutionPackageId } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Subscribe to SmartPatrol and pay securely online with Razorpay.",
  robots: { index: false, follow: false },
};

const PACKAGE_IDS = SOLUTION_PACKAGES.map((p) => p.id);

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{
    plan?: string;
    package?: string;
    guards?: string;
    billing?: string;
    users?: string;
    codes?: string;
    sites?: string;
    visitorSites?: string;
    vehicleSites?: string;
  }>;
}) {
  const params = await searchParams;
  const billing = (params.billing === "annual" ? "annual" : "monthly") as BillingCycle;
  const packageId = PACKAGE_IDS.includes(params.package as SolutionPackageId)
    ? (params.package as SolutionPackageId)
    : null;
  const plan = (["base", "pro", "gold"].includes(params.plan || "")
    ? params.plan
    : "pro") as PlanId;
  const guards = Math.min(100, Math.max(1, Number(params.guards || 8) || 8));
  const users = Math.min(500, Math.max(1, Number(params.users || 25) || 25));
  const codes = Math.min(500, Math.max(1, Number(params.codes || 20) || 20));
  const sharedSites = Math.min(50, Math.max(1, Number(params.sites || 1) || 1));
  const visitorSites = Math.min(
    50,
    Math.max(1, Number(params.visitorSites || sharedSites) || sharedSites),
  );
  const vehicleSites = Math.min(
    50,
    Math.max(1, Number(params.vehicleSites || sharedSites) || sharedSites),
  );

  return (
    <div className="shell py-12 pb-16">
      <CheckoutClient
        mode={packageId ? "package" : "plan"}
        initialPlan={plan}
        initialPackage={packageId || "site-ops"}
        initialGuards={guards}
        initialUsers={users}
        initialCodes={codes}
        initialVisitorSites={visitorSites}
        initialVehicleSites={vehicleSites}
        initialBilling={billing}
        razorpayKeyId={getRazorpayKeyId()}
        razorpayReady={razorpayConfigured()}
      />
    </div>
  );
}
