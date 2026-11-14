"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BillingCycle,
  formatEUR,
  formatINR,
  GUARD_TIERS,
  PLANS,
  PlanId,
  quotePlan,
} from "@/lib/pricing";

type Props = {
  initialPlan?: PlanId;
  compact?: boolean;
};

export function PricingCalculator({ initialPlan = "pro", compact = false }: Props) {
  const [planId, setPlanId] = useState<PlanId>(initialPlan);
  const [guards, setGuards] = useState(8);
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const quote = useMemo(
    () => quotePlan(planId, guards, billing),
    [planId, guards, billing],
  );

  const checkoutHref = quote.needsQuote
    ? "/demo?interest=Enterprise+quote"
    : `/checkout?plan=${planId}&guards=${guards}&billing=${billing}`;

  return (
    <div className={compact ? "space-y-6" : "space-y-10"}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
          <button
            key={cycle}
            type="button"
            onClick={() => setBilling(cycle)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              billing === cycle
                ? "bg-[var(--ink)] text-white"
                : "bg-white text-[var(--navy)] border border-[var(--line)]"
            }`}
          >
            {cycle === "monthly" ? "Monthly" : "Annual · 15% off"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const active = plan.id === planId;
          const preview = quotePlan(plan.id, guards, billing);
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setPlanId(plan.id)}
              className={`card-panel relative p-5 text-left transition ${
                active ? "ring-2 ring-[var(--teal)]" : "hover:border-[var(--teal)]"
              }`}
            >
              {plan.popular ? (
                <span className="absolute -top-3 right-4 rounded-full bg-[var(--orange)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  Most popular
                </span>
              ) : null}
              <p className="display text-2xl font-extrabold">{plan.name}</p>
              <p className="mt-1 text-sm text-[var(--steel)]">{plan.blurb}</p>
              <p className="mt-4 text-sm text-[var(--steel)]">from</p>
              <p className="display text-3xl font-extrabold text-[var(--ink)]">
                {formatEUR(plan.fromPerGuard)}
                <span className="ml-1 text-sm font-semibold text-[var(--steel)]">
                  /guard/mo
                </span>
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--navy)]">
                {preview.needsQuote
                  ? "Request a quote"
                  : `${formatEUR(preview.eurMonthly!)} / month`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--navy)]">
                {plan.features.slice(0, compact ? 4 : 6).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--teal)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="card-panel mx-auto max-w-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Step 2</p>
            <h3 className="display mt-1 text-2xl font-bold">
              Select guard IDs
            </h3>
            <p className="mt-1 text-sm text-[var(--steel)]">
              Drag to choose how many users you need. Over 100 — request a quote.
            </p>
          </div>
          <div className="text-right">
            <p className="display text-4xl font-extrabold text-[var(--teal-deep)]">
              {guards}
            </p>
            <p className="text-sm font-semibold text-[var(--steel)]">guards</p>
          </div>
        </div>

        <input
          className="range mt-6"
          type="range"
          min={1}
          max={100}
          step={1}
          value={Math.min(guards, 100)}
          aria-label="Number of guards"
          onChange={(e) => setGuards(Number(e.target.value))}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {GUARD_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setGuards(tier.min)}
              className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${
                quote.tierId === tier.id
                  ? "border-[var(--teal)] bg-[rgba(15,143,154,0.08)] text-[var(--teal-deep)]"
                  : "border-[var(--line)] bg-white text-[var(--steel)]"
              }`}
            >
              {tier.label}
            </button>
          ))}
          <Link
            href="/demo?interest=Enterprise+quote+%3E100+guards"
            className="rounded-md bg-[var(--ink)] px-3 py-1.5 text-xs font-semibold text-white"
          >
            &gt;100 — Request a quote
          </Link>
        </div>

        <div className="mt-8 grid gap-4 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--steel)]">Selected plan</p>
            <p className="display text-2xl font-bold">
              {quote.plan.name} · {guards} guards
            </p>
            {!quote.needsQuote ? (
              <p className="mt-1 text-sm text-[var(--steel)]">
                ≈ {formatEUR(quote.perGuard!)} / guard / mo
                {billing === "annual" ? " (billed annually)" : ""}
              </p>
            ) : null}
          </div>
          <div className="sm:text-right">
            {quote.needsQuote ? (
              <p className="display text-3xl font-extrabold">Custom quote</p>
            ) : (
              <>
                <p className="display text-4xl font-extrabold">
                  {formatEUR(quote.eurDue!)}
                </p>
                <p className="text-sm font-semibold text-[var(--steel)]">
                  {billing === "monthly" ? "per month" : "billed annually"}
                </p>
                <p className="mt-1 text-sm text-[var(--steel)]">
                  Pay online via Razorpay · {formatINR(quote.inrDue!)}
                </p>
              </>
            )}
            <Link href={checkoutHref} className="btn-primary mt-4 inline-flex">
              {quote.needsQuote ? "Talk to sales" : "Continue to checkout"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
