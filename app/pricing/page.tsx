import type { Metadata } from "next";
import { PricingCalculator } from "@/components/PricingCalculator";
import { COMPARISON } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "SmartPatrol pricelist — Base, Pro and Gold packages with guard-count slider, annual discount and Razorpay subscription checkout.",
};

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <span className="font-bold text-[var(--teal-deep)]">✓</span>;
  if (value === false) return <span className="text-[var(--line)]">—</span>;
  return <span className="text-sm font-medium text-[var(--navy)]">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell mx-auto max-w-3xl text-center">
          <p className="eyebrow">SmartPatrol pricelist</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Step 1: Choose the desired version
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            Pricing aligned with the published Base / Pro / Gold guard-tour model
            (from 2.64 / 5.07 / 9.53 EUR per guard / month). Drag the slider to set
            users, then subscribe online.
          </p>
        </div>
      </section>

      <section className="shell py-12">
        <PricingCalculator />
      </section>

      <section className="shell">
        <h2 className="display text-3xl font-extrabold">Plan comparison</h2>
        <p className="mt-2 max-w-2xl text-[var(--steel)]">
          Feature matrix adapted from the standard guard-tour comparison model for
          SmartPatrol packages.
        </p>
        <div className="mt-8 space-y-8">
          {COMPARISON.map((group) => (
            <div key={group.group} className="card-panel overflow-x-auto">
              <div className="border-b border-[var(--line)] bg-[#f8fafc] px-4 py-3">
                <h3 className="font-bold">{group.group}</h3>
              </div>
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--steel)]">
                    <th className="px-4 py-3 font-semibold">Feature</th>
                    <th className="px-4 py-3 font-semibold">Base</th>
                    <th className="px-4 py-3 font-semibold">Pro</th>
                    <th className="px-4 py-3 font-semibold">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.name} className="border-b border-[var(--line)] last:border-0">
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3">
                        <Cell value={row.base} />
                      </td>
                      <td className="px-4 py-3">
                        <Cell value={row.pro} />
                      </td>
                      <td className="px-4 py-3">
                        <Cell value={row.gold} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
