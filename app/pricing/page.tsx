import type { Metadata } from "next";
import { PackagePricingCalculator } from "@/components/PackagePricingCalculator";
import { PlanComparison } from "@/components/PlanComparison";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${site.product} packages — drag users, QR codes and sites for pro-rata pricing on Smart Patrol Attendance, Checkpoint, Visitor, Vehicle, Duo bundles and Site Ops Suite.`,
};

export default function PricingPage() {
  return (
    <div className="pb-12">
      <section className="border-b border-[var(--line)] bg-white py-6">
        <div className="shell">
          <h1 className="display text-2xl font-extrabold sm:text-3xl">Pricing</h1>
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
