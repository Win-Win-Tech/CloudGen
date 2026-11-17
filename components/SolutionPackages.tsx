import Link from "next/link";
import {
  formatUSD,
  SOLUTION_PACKAGES,
  solutionsForPackage,
} from "@/lib/solutions";

type Props = {
  showCatalogHint?: boolean;
};

export function SolutionPackages({ showCatalogHint = true }: Props) {
  return (
    <div className="space-y-8">
      {showCatalogHint ? (
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">SmartPatrol packages · USD</p>
          <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
            Pick the stack that matches your site
          </h2>
          <p className="mt-3 text-[var(--steel)]">
            Buy a single Smart Patrol module, combine Face + QR, or take Site Ops Suite.
            Ticket Complaints Tracking is included on every package. Vision AI, Industry
            Suite and Custom Build are quote-only. Choose USD (LUT) or INR (+GST) on Pricing /
            Checkout; Razorpay always collects INR.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {SOLUTION_PACKAGES.map((pkg) => {
          const included = solutionsForPackage(pkg);
          const quoteOnly = Boolean(pkg.quoteOnly);
          return (
            <article
              key={pkg.id}
              className={`card-panel relative flex flex-col p-6 ${
                pkg.popular ? "ring-2 ring-[var(--teal)]" : ""
              }`}
            >
              {pkg.popular ? (
                <span className="absolute -top-3 right-4 rounded-full bg-[var(--orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              ) : null}
              {quoteOnly ? (
                <span className="absolute -top-3 left-4 rounded-full bg-[var(--ink)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Quote
                </span>
              ) : null}
              <p className="display text-2xl font-extrabold">{pkg.name}</p>
              <p className="mt-1 text-sm text-[var(--steel)]">{pkg.blurb}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--teal-deep)]">
                {pkg.unitLimit}
              </p>

              {quoteOnly || pkg.usdMonthly == null ? (
                <p className="display mt-4 text-3xl font-extrabold text-[var(--ink)]">
                  Custom quote
                </p>
              ) : (
                <>
                  <p className="mt-4 text-sm text-[var(--steel)]">from</p>
                  <p className="display text-4xl font-extrabold text-[var(--ink)]">
                    {formatUSD(pkg.usdMonthly)}
                    <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                      /mo
                    </span>
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--navy)]">
                    {formatUSD(pkg.usdAnnual!)} / year · setup{" "}
                    {formatUSD(pkg.usdSetup!)}
                  </p>
                </>
              )}

              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--teal-deep)]">
                {pkg.bestFor}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--navy)]">
                {pkg.highlights.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--teal)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <details className="mt-4 rounded-lg border border-[var(--line)] bg-[#f8fafc] p-3">
                <summary className="cursor-pointer text-sm font-semibold text-[var(--navy)]">
                  Included solutions ({included.length})
                </summary>
                <ul className="mt-3 space-y-2 text-xs text-[var(--steel)]">
                  {included.map((solution) => (
                    <li key={solution.id}>
                      <span className="font-semibold text-[var(--navy)]">
                        {solution.platform}
                      </span>
                      {" — "}
                      {solution.name}
                    </li>
                  ))}
                </ul>
              </details>
              <div className="mt-5 flex flex-wrap gap-2">
                {quoteOnly ? (
                  <Link
                    href={`/demo?interest=${encodeURIComponent(pkg.name + " quote")}`}
                    className="btn-primary"
                  >
                    Request quote
                  </Link>
                ) : (
                  <Link
                    href={`/pricing`}
                    className="btn-primary"
                  >
                    Configure & pay
                  </Link>
                )}
                <Link
                  href={`/demo?interest=${encodeURIComponent(pkg.name + " package")}`}
                  className="btn-outline"
                >
                  Request demo
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
