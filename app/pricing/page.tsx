import type { Metadata } from "next";
import { SolutionPackages } from "@/components/SolutionPackages";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${site.product} INR packages — Smart Patrol Attendance, Checkpoint, Visitor, Vehicle, Duo bundles, Site Ops Suite, plus quote-only Vision AI, Industry Suite and Custom Build.`,
};

export default function PricingPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell mx-auto max-w-3xl text-center">
          <p className="eyebrow">SmartPatrol pricelist</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Pricing
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            Modular INR packages for Face, QR, Visitor and Vehicle — buy one module
            or a discounted bundle. Ticket Complaints Tracking is included on every
            package. Smart Patrol Vision AI, Industry Suite and Custom Build are
            quote-only.
          </p>
        </div>
      </section>

      <section className="shell py-12">
        <SolutionPackages showCatalogHint={false} />
      </section>
    </div>
  );
}
