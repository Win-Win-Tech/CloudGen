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
    <div className="space-y-10">
      <div className="card-panel space-y-3 p-4 sm:p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Display currency
          </p>
          <p className="mt-1 text-sm text-[var(--navy)]">
            Prices show in one currency. USD/INR set checkout tax; other codes are
            planning estimates. Razorpay still collects INR.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Price display currency"
        >
          {PRICE_DISPLAY_OPTIONS.map((c) => {
            const active = priceDisplay === c.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setPriceDisplay(c.code)}
                className={`rounded-md border px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition ${
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
        <p className="eyebrow">Step 1</p>
        <h2 className="display mt-1 text-2xl font-extrabold sm:text-3xl">
          Choose the desired package
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PAID_PACKAGES.map((pkg) => {
            const active = packageId === pkg.id;
            const fromQuote = quotePackage(pkg.id, "monthly", undefined, currency);
            const fromUsd = fromQuote.usdPeriod ?? pkg.usdMonthly ?? 0;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => selectPackage(pkg.id)}
                className={`card-panel relative flex flex-col p-5 text-left transition ${
                  active
                    ? "ring-2 ring-[var(--teal)] shadow-[0_12px_28px_rgba(15,143,154,0.12)]"
                    : "hover:border-[var(--teal)]"
                }`}
              >
                {pkg.popular ? (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--orange)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                ) : null}
                <p className="display text-lg font-extrabold leading-snug">{pkg.name}</p>
                <p className="mt-2 text-xs text-[var(--steel)]">
                  from{isLocalDisplayCurrency(priceDisplay) ? " · approx" : ""}
                </p>
                <p className="display text-2xl font-extrabold text-[var(--ink)]">
                  {formatShown(fromUsd, priceDisplay)}
                  <span className="ml-1 text-xs font-semibold text-[var(--steel)]">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-xs text-[var(--steel)]">{pkg.unitLimit}</p>
              </button>
            );
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {QUOTE_PACKAGES.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/demo?interest=${encodeURIComponent(pkg.name + " quote")}`}
              className="card-panel flex flex-col p-4 transition hover:border-[var(--teal)]"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
                Quote
              </p>
              <p className="display mt-1 text-base font-extrabold">{pkg.name}</p>
              <p className="mt-1 text-xs text-[var(--steel)]">{pkg.blurb}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="card-panel p-6 sm:p-8">
        <p className="eyebrow">Step 2</p>
        <h2 className="display mt-1 text-2xl font-extrabold sm:text-3xl">
          Select capacity on the slider
          {atOnlineCap ? (
            <span className="ml-2 text-base font-semibold text-[var(--orange-deep)]">
              · need more? request a quote
            </span>
          ) : null}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--steel)]">
          Drag to scale beyond the base band ({selected.unitLimit}). Gate Duo and
          Site Ops let you set Visitor and Vehicle site counts independently.
          Bundle discounts stay applied on Duo and Site Ops packages.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-7">
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
              <p className="rounded-md bg-[var(--mist)] px-4 py-3 text-sm text-[var(--steel)]">
                This package is scoped per engagement — request a quote for pricing.
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[linear-gradient(165deg,#ffffff_0%,#f3f8fb_100%)] p-6">
            <p className="text-sm font-semibold text-[var(--navy)]">{selected.name}</p>
            <p className="mt-1 text-xs text-[var(--steel)]">
              {qtySummary(dims, qty)}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <div className="inline-flex rounded-md border border-[var(--line)] bg-white p-1">
                <button
                  type="button"
                  className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    billing === "annual"
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--steel)]"
                  }`}
                  onClick={() => setBilling("annual")}
                >
                  Annually
                </button>
                <button
                  type="button"
                  className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                    billing === "monthly"
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--steel)]"
                  }`}
                  onClick={() => setBilling("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>

            {quote.needsQuote || quote.usdPeriod == null || quote.inrPeriod == null ? (
              <p className="display mt-6 text-3xl font-extrabold">Custom quote</p>
            ) : (
              <>
                <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-[var(--steel)]">
                  {billing === "annual"
                    ? `Billed annually · ${ANNUAL_MONTHS_CHARGED} months cost (2 free)`
                    : "Billed monthly"}{" "}
                  · {currency === "USD" ? "Export (LUT)" : "India (GST)"}
                  {isLocalDisplayCurrency(priceDisplay)
                    ? ` · shown in ${priceDisplay}`
                    : ""}
                </p>
                <p className="display text-4xl font-extrabold text-[var(--ink)]">
                  {formatShown(quote.usdPeriod, priceDisplay)}
                  <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                    /{billing === "annual" ? "yr" : "mo"}
                  </span>
                </p>
                {quote.usdListPeriod != null &&
                quote.usdListPeriod > quote.usdPeriod ? (
                  <p className="mt-1 text-sm text-[var(--steel)] line-through">
                    List {formatShown(quote.usdListPeriod, priceDisplay)}
                  </p>
                ) : null}
                <p className="mt-2 text-sm font-semibold text-[var(--navy)]">
                  + setup {formatShown(quote.usdSetup!, priceDisplay)} (one-time)
                </p>
                {currency === "INR" && quote.inrGst != null && quote.inrGst > 0 ? (
                  <p className="mt-1 text-sm text-[var(--navy)]">
                    + GST {GST_PERCENT_LABEL} {formatINR(quote.inrGst)}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-[var(--navy)]">GST Nil (LUT)</p>
                )}
                <p className="mt-2 text-sm font-bold text-[var(--ink)]">
                  Razorpay due {formatINR(quote.inrDue!)}
                </p>
                <p className="mt-1 text-xs text-[var(--steel)]">
                  {isLocalDisplayCurrency(priceDisplay)
                    ? `${priceDisplay} is an estimate for planning. Checkout uses ${currency} tax mode; Razorpay collects INR.`
                    : currency === "USD"
                      ? "USD list → INR at checkout. Export under LUT — no GST."
                      : "Domestic INR billing with 18% GST. Paid via Razorpay in INR."}
                </p>
              </>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={checkoutHref}
                className="btn-primary w-full text-center"
              >
                {quote.needsQuote ? "Request quote" : "Subscribe"}
              </Link>
              <Link
                href={`/demo?interest=${encodeURIComponent(selected.name + " package")}`}
                className="btn-outline w-full text-center"
              >
                Request demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
