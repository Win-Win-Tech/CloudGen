import type { Metadata } from "next";
import { PackagePricingCalculator } from "@/components/PackagePricingCalculator";
import { PlanComparison } from "@/components/PlanComparison";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${site.product} USD packages — drag users, QR codes and sites for pro-rata pricing on Smart Patrol Attendance, Checkpoint, Visitor, Vehicle, Duo bundles and Site Ops Suite.`,
};

export default function PricingPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell mx-auto max-w-3xl text-center">
          <p className="eyebrow">SmartPatrol pricelist · USD</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            Choose a package, pick USD (LUT export) or INR (domestic + GST), drag
            capacity beyond the base band, and pay pro-rata. In USD mode, see an
            approximate MYR/SGD/AED (and more) conversion for planning. Ticket Complaints
            Tracking is included on every package. Vision AI, Industry Suite and Custom
            Build are quote-only.
          </p>
        </div>
      </section>

      <section className="shell py-12">
        <PackagePricingCalculator />
      </section>

      <section className="shell border-t border-[var(--line)] py-14">
        <PlanComparison />
      </section>
    </div>
  );
}
