import type { Metadata } from "next";
import Link from "next/link";
import { PricingCalculator } from "@/components/PricingCalculator";
import { SolutionPackages } from "@/components/SolutionPackages";
import { COMPARISON } from "@/lib/pricing";
import { formatUSD, SOLUTION_PACKAGES } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "SmartPatrol USD solution packages plus Base / Pro / Gold guard-count plans with annual discount and Razorpay checkout.",
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
            Solution packages in USD
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            Competitive monthly and annual USD pricing for Essentials, Operations,
            Vision AI, Industry Apps and Enterprise — covering all fifteen CloudGen
            solutions from the SmartPatrol catalog.
          </p>
        </div>
      </section>

      <section className="shell py-12">
        <SolutionPackages showCatalogHint={false} />

        <div className="mt-10 overflow-x-auto rounded-xl border border-[var(--line)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[#f8fafc] text-[var(--steel)]">
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Monthly USD</th>
                <th className="px-4 py-3 font-semibold">Annual USD</th>
                <th className="px-4 py-3 font-semibold">Setup USD</th>
                <th className="px-4 py-3 font-semibold">Solutions</th>
              </tr>
            </thead>
            <tbody>
              {SOLUTION_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3 font-bold text-[var(--ink)]">
                    {pkg.name}
                    {pkg.popular ? (
                      <span className="ml-2 text-xs font-semibold text-[var(--orange)]">
                        Popular
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{formatUSD(pkg.usdMonthly)}</td>
                  <td className="px-4 py-3">{formatUSD(pkg.usdAnnual)}</td>
                  <td className="px-4 py-3">{formatUSD(pkg.usdSetup)}</td>
                  <td className="px-4 py-3 text-[var(--steel)]">
                    {pkg.solutionIds.length} included
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-[var(--steel)]">
          Need a custom mix?{" "}
          <Link href="/demo?interest=Custom+solution+mix" className="font-semibold text-[var(--teal-deep)]">
            Talk to sales
          </Link>{" "}
          for site-count discounts and camera add-ons.
        </p>
      </section>

      <section className="border-y border-[var(--line)] bg-[#f7fafc] py-12">
        <div className="shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="eyebrow">Guard-tour subscriptions</p>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Base · Pro · Gold by guard count
            </h2>
            <p className="mt-3 text-[var(--steel)]">
              Prefer per-guard SaaS licensing? Use the classic Base / Pro / Gold
              model (EUR list, paid in INR via Razorpay) with the guard slider.
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      <section className="shell pt-12">
        <h2 className="display text-3xl font-extrabold">Guard plan comparison</h2>
        <p className="mt-2 max-w-2xl text-[var(--steel)]">
          How the fifteen CloudGen solutions map onto per-guard Base, Pro and Gold —
          workforce, security ops, command centre, CCTV AI, industry apps and reporting.
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
