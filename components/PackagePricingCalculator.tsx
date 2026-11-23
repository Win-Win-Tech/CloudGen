"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_PRICE_DISPLAY,
  PRICE_DISPLAY_OPTIONS,
  checkoutCurrencyForDisplay,
  formatPriceDisplay,
  isLocalDisplayCurrency,
  type PriceDisplayCode,
} from "@/lib/fxDisplay";
import {
  ANNUAL_MONTHS_CHARGED,
  CODE_STEPS,
  formatUSD,
  formatINR,
  GST_PERCENT_LABEL,
  packageDimensions,
  quotePackage,
  qtySummary,
  RATE_CARD,
  SITE_STEPS,
  SOLUTION_PACKAGES,
  USER_STEPS,
  usdToInr,
  type PackageBilling,
  type SolutionPackageId,
} from "@/lib/solutions";

const PAID_PACKAGES = SOLUTION_PACKAGES.filter((p) => !p.quoteOnly);
const QUOTE_PACKAGES = SOLUTION_PACKAGES.filter((p) => p.quoteOnly);

function stepIndex(steps: readonly number[], value: number) {
  const idx = steps.findIndex((s) => s === value);
  return idx >= 0 ? idx : 0;
}

function CapacitySlider({
  label,
  value,
  unit,
  index,
  onIndexChange,
  ariaLabel,
}: {
  label: string;
  value: number;
  unit: string;
  index: number;
  onIndexChange: (index: number) => void;
  ariaLabel: string;
}) {
  return (
    <label className="block">
      <div className="mb-3 flex items-end justify-between gap-3">
        <span className="text-sm font-semibold text-[var(--navy)]">{label}</span>
        <span className="display text-2xl font-extrabold">
          {value}
          <span className="ml-1 text-sm font-semibold text-[var(--steel)]">{unit}</span>
        </span>
      </div>
      <input
        className="range"
        type="range"
        min={0}
        max={SITE_STEPS.length - 1}
        step={1}
        value={index}
        onChange={(e) => onIndexChange(Number(e.target.value))}
        aria-label={ariaLabel}
      />
      <div className="mt-2 flex justify-between text-[11px] font-medium text-[var(--steel)]">
        {SITE_STEPS.map((n) => (
          <button
            key={n}
            type="button"
            className="hover:text-[var(--teal-deep)]"
            onClick={() => onIndexChange(stepIndex(SITE_STEPS, n))}
          >
            {n}
          </button>
        ))}
      </div>
    </label>
  );
}

function formatShown(usdAmount: number, display: PriceDisplayCode) {
  return formatPriceDisplay(usdAmount, display, formatUSD, formatINR, usdToInr);
}

export function PackagePricingCalculator() {
  const [packageId, setPackageId] = useState<SolutionPackageId>("site-ops");
  const [billing, setBilling] = useState<PackageBilling>("annual");
  const [priceDisplay, setPriceDisplay] =
    useState<PriceDisplayCode>(DEFAULT_PRICE_DISPLAY);
  const [userIdx, setUserIdx] = useState(0);
  const [codeIdx, setCodeIdx] = useState(0);
  const [visitorSiteIdx, setVisitorSiteIdx] = useState(0);
  const [vehicleSiteIdx, setVehicleSiteIdx] = useState(0);

  const currency = checkoutCurrencyForDisplay(priceDisplay);
  const dims = packageDimensions(packageId);
  const qty = useMemo(
    () => ({
      users: USER_STEPS[userIdx] ?? RATE_CARD.faceUsersBase,
      codes: CODE_STEPS[codeIdx] ?? RATE_CARD.qrCodesBase,
      visitorSites: SITE_STEPS[visitorSiteIdx] ?? 1,
      vehicleSites: SITE_STEPS[vehicleSiteIdx] ?? 1,
    }),
    [userIdx, codeIdx, visitorSiteIdx, vehicleSiteIdx],
  );

  const quote = useMemo(
    () => quotePackage(packageId, billing, qty, currency),
    [packageId, billing, qty, currency],
  );

  const selected = quote.pkg;
  const hasCapacity =
    dims.users || dims.codes || dims.visitorSites || dims.vehicleSites;
  const atOnlineCap =
    (dims.users && userIdx === USER_STEPS.length - 1) ||
    (dims.codes && codeIdx === CODE_STEPS.length - 1) ||
    (dims.visitorSites && visitorSiteIdx === SITE_STEPS.length - 1) ||
    (dims.vehicleSites && vehicleSiteIdx === SITE_STEPS.length - 1);

  function selectPackage(id: SolutionPackageId) {
    setPackageId(id);
    setUserIdx(0);
    setCodeIdx(0);
    setVisitorSiteIdx(0);
    setVehicleSiteIdx(0);
  }

  const checkoutHref =
    !quote.needsQuote && quote.inrDue != null
      ? `/checkout?package=${packageId}&billing=${billing}&currency=${currency}&users=${qty.users}&codes=${qty.codes}&visitorSites=${qty.visitorSites}&vehicleSites=${qty.vehicleSites}`
      : `/demo?interest=${encodeURIComponent(selected.name + " quote")}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--line)] bg-[linear-gradient(165deg,#ffffff_0%,#f4f8fb_100%)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--steel)]">
            Billing cycle
          </p>
          <div
            className="mt-2 inline-flex rounded-lg border border-[var(--line)] bg-white p-1 shadow-sm"
            role="group"
            aria-label="Billing cycle"
          >
            <button
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                billing === "monthly"
                  ? "bg-[var(--ink)] text-white shadow-sm"
                  : "text-[var(--steel)] hover:text-[var(--navy)]"
              }`}
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-bold transition ${
                billing === "annual"
                  ? "bg-[var(--ink)] text-white shadow-sm"
                  : "text-[var(--steel)] hover:text-[var(--navy)]"
              }`}
              onClick={() => setBilling("annual")}
              aria-pressed={billing === "annual"}
            >
              Annual
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  billing === "annual"
                    ? "bg-[#d4af55] text-[var(--ink)]"
                    : "bg-[var(--mist)] text-[var(--teal-deep)]"
                }`}
              >
                2 months free
              </span>
            </button>
          </div>
          <p className="mt-2 text-xs text-[var(--steel)]">
            {billing === "annual"
              ? `Pay for ${ANNUAL_MONTHS_CHARGED} months · get 12 months access`
              : "Billed every month · switch to Annual anytime"}
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-2 sm:justify-end"
          role="group"
          aria-label="Price display currency"
        >
          <span className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Currency
          </span>
          {PRICE_DISPLAY_OPTIONS.map((c) => {
            const active = priceDisplay === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setPriceDisplay(c.code)}
                className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-wide transition ${
                  active
                    ? "border-[var(--teal-deep)] bg-[var(--teal-deep)] text-white"
                    : "border-[var(--line)] bg-white text-[var(--steel)] hover:border-[var(--teal)] hover:text-[var(--navy)]"
                }`}
              >
                {c.code}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="display text-lg font-extrabold sm:text-xl">
          1 · Choose package
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PAID_PACKAGES.map((pkg) => {
            const active = packageId === pkg.id;
            const fromQuote = quotePackage(pkg.id, billing, undefined, currency);
            const fromUsd = fromQuote.usdPeriod ?? (billing === "annual" ? pkg.usdAnnual : pkg.usdMonthly) ?? 0;
            const monthlyUsd = pkg.usdMonthly ?? 0;
            const showAnnualSave =
              billing === "annual" && monthlyUsd > 0 && fromUsd > 0;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => selectPackage(pkg.id)}
                className={`card-panel relative flex flex-col p-3.5 text-left transition ${
                  active
                    ? "ring-2 ring-[var(--teal)] shadow-[0_12px_28px_rgba(15,143,154,0.12)]"
                    : "hover:border-[var(--teal)]"
                }`}
              >
                {pkg.popular ? (
                  <span className="absolute -top-2 right-2 rounded-full bg-[var(--orange)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                ) : null}
                <p className="display text-base font-extrabold leading-snug">{pkg.name}</p>
                <p className="mt-1.5 display text-xl font-extrabold text-[var(--ink)]">
                  {formatShown(fromUsd, priceDisplay)}
                  <span className="ml-1 text-xs font-semibold text-[var(--steel)]">
                    /{billing === "annual" ? "yr" : "mo"}
                    {isLocalDisplayCurrency(priceDisplay) ? " · approx" : ""}
                  </span>
                </p>
                {showAnnualSave ? (
                  <p className="mt-1 text-[11px] font-semibold text-[var(--teal-deep)]">
                    Equals {formatShown(fromUsd / 12, priceDisplay)}/mo · save 2 months
                  </p>
                ) : null}
                <p className="mt-1 text-[11px] text-[var(--steel)]">{pkg.unitLimit}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUOTE_PACKAGES.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/demo?interest=${encodeURIComponent(pkg.name + " quote")}`}
              className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--navy)] transition hover:border-[var(--teal)]"
            >
              Quote · {pkg.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="card-panel p-4 sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start xl:grid-cols-[1.2fr_22rem]">
          <div>
            <h2 className="display text-lg font-extrabold sm:text-xl">
              2 · Capacity
              {atOnlineCap ? (
                <span className="ml-2 text-sm font-semibold text-[var(--orange-deep)]">
                  · need more? request a quote
                </span>
              ) : null}
            </h2>
            <p className="mt-1 text-xs text-[var(--steel)]">
              {selected.name} · {selected.unitLimit}
            </p>
            <div className="mt-4 space-y-5">
            {dims.users ? (
              <label className="block">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <span className="text-sm font-semibold text-[var(--navy)]">
                    Face users
                  </span>
                  <span className="display text-2xl font-extrabold">
                    {qty.users}
                    <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                      users
                    </span>
                  </span>
                </div>
                <input
                  className="range"
                  type="range"
                  min={0}
                  max={USER_STEPS.length - 1}
                  step={1}
                  value={userIdx}
                  onChange={(e) => setUserIdx(Number(e.target.value))}
                  aria-label="Number of face users"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-[var(--steel)]">
                  {USER_STEPS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="hover:text-[var(--teal-deep)]"
                      onClick={() => setUserIdx(stepIndex(USER_STEPS, n))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </label>
            ) : null}

            {dims.codes ? (
              <label className="block">
                <div className="mb-3 flex items-end justify-between gap-3">
                  <span className="text-sm font-semibold text-[var(--navy)]">
                    QR checkpoint codes
                  </span>
                  <span className="display text-2xl font-extrabold">
                    {qty.codes}
                    <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                      codes
                    </span>
                  </span>
                </div>
                <input
                  className="range"
                  type="range"
                  min={0}
                  max={CODE_STEPS.length - 1}
                  step={1}
                  value={codeIdx}
                  onChange={(e) => setCodeIdx(Number(e.target.value))}
                  aria-label="Number of QR codes"
                />
                <div className="mt-2 flex justify-between text-[11px] font-medium text-[var(--steel)]">
                  {CODE_STEPS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="hover:text-[var(--teal-deep)]"
                      onClick={() => setCodeIdx(stepIndex(CODE_STEPS, n))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </label>
            ) : null}

            {dims.visitorSites ? (
              <CapacitySlider
                label="Visitor sites"
                value={qty.visitorSites}
                unit={qty.visitorSites === 1 ? "site" : "sites"}
                index={visitorSiteIdx}
                onIndexChange={setVisitorSiteIdx}
                ariaLabel="Number of visitor sites"
              />
            ) : null}

            {dims.vehicleSites ? (
              <CapacitySlider
                label="Vehicle sites"
                value={qty.vehicleSites}
                unit={qty.vehicleSites === 1 ? "site" : "sites"}
                index={vehicleSiteIdx}
                onIndexChange={setVehicleSiteIdx}
                ariaLabel="Number of vehicle sites"
              />
            ) : null}

            {!hasCapacity ? (
              <p className="rounded-md bg-[var(--mist)] px-3 py-2 text-sm text-[var(--steel)]">
                Scoped per engagement — request a quote.
              </p>
            ) : null}
            </div>
          </div>

          <aside className="rounded-xl border border-[var(--line)] bg-[linear-gradient(165deg,#ffffff_0%,#f3f8fb_100%)] p-4 lg:sticky lg:top-24">
            <p className="display text-base font-extrabold">3 · Subscription</p>
            <p className="mt-1 text-xs text-[var(--steel)]">{qtySummary(dims, qty)}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-white px-2.5 py-1.5 text-xs font-bold text-[var(--navy)]">
              {billing === "annual" ? "Annual billing" : "Monthly billing"}
              {billing === "annual" ? (
                <span className="rounded-full bg-[rgba(212,175,85,0.2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--teal-deep)]">
                  2 months free
                </span>
              ) : null}
            </p>

            {quote.needsQuote || quote.usdPeriod == null || quote.inrPeriod == null ? (
              <p className="display mt-4 text-2xl font-extrabold">Custom quote</p>
            ) : (
              <>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-[var(--steel)]">
                  {billing === "annual"
                    ? `Annual · ${ANNUAL_MONTHS_CHARGED} mo billed`
                    : "Monthly"}{" "}
                  · {currency === "USD" ? "LUT" : "GST"}
                  {isLocalDisplayCurrency(priceDisplay) ? ` · ${priceDisplay}` : ""}
                </p>
                <p className="display text-3xl font-extrabold text-[var(--ink)]">
                  {formatShown(quote.usdPeriod, priceDisplay)}
                  <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                    /{billing === "annual" ? "yr" : "mo"}
                  </span>
                </p>
                {billing === "annual" ? (
                  <p className="mt-0.5 text-sm text-[var(--teal-deep)]">
                    ≈ {formatShown(quote.usdPeriod / 12, priceDisplay)}/mo effective
                  </p>
                ) : null}
                {quote.usdListPeriod != null &&
                quote.usdListPeriod > quote.usdPeriod ? (
                  <p className="mt-0.5 text-sm text-[var(--steel)] line-through">
                    List {formatShown(quote.usdListPeriod, priceDisplay)}
                  </p>
                ) : null}
                <p className="mt-1.5 text-sm font-semibold text-[var(--navy)]">
                  + setup {formatShown(quote.usdSetup!, priceDisplay)}
                </p>
                {currency === "INR" && quote.inrGst != null && quote.inrGst > 0 ? (
                  <p className="mt-0.5 text-sm text-[var(--navy)]">
                    + GST {GST_PERCENT_LABEL} {formatINR(quote.inrGst)}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-[var(--navy)]">GST Nil (LUT)</p>
                )}
                <p className="mt-1.5 text-sm font-bold text-[var(--ink)]">
                  Due {formatINR(quote.inrDue!)}
                </p>
              </>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <Link href={checkoutHref} className="btn-primary w-full text-center">
                {quote.needsQuote ? "Request quote" : "Subscribe"}
              </Link>
              <Link
                href={`/demo?interest=${encodeURIComponent(selected.name + " package")}`}
                className="btn-outline w-full text-center"
              >
                Request demo
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
