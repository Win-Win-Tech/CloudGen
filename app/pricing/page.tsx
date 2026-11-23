import type { Metadata } from "next";
import { PackagePricingCalculator } from "@/components/PackagePricingCalculator";
import { PlanComparison } from "@/components/PlanComparison";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "SmartPatrol Pricing | Guard Tour & Attendance Packages India",
  description: `${site.product} pricing — Attendance, Checkpoint, Visitor, Vehicle, Workforce Duo, Gate Duo and Site Ops Suite. USD LUT or INR GST. Ticket Complaints Tracking included.`,
  keywords: [
    "SmartPatrol pricing",
    "Smart Patrol packages",
    "guard tour software pricing India",
    "security workforce software subscription",
  ],
};

export default function PricingPage() {
  return (
    <div className="pb-12">
      <section className="border-b border-[var(--line)] bg-white py-6">
        <div className="shell">
          <h1 className="display text-2xl font-extrabold sm:text-3xl">Pricing</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--steel)]">
            Choose Monthly or Annual (2 months free), then pick a currency — package
            amounts update instantly for USD, INR and local estimates.
          </p>
        </div>
      </section>

      <section className="shell py-6">
        <PackagePricingCalculator />
      </section>

      <section className="shell border-t border-[var(--line)] py-10">
        <PlanComparison />
      </section>
    </div>
  );
}
