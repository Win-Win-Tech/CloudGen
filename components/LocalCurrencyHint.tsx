"use client";

import {
  DEFAULT_DISPLAY_CURRENCY,
  DISPLAY_CURRENCIES,
  formatApproxFromUsd,
  type DisplayCurrencyCode,
} from "@/lib/fxDisplay";

type Props = {
  /** USD period amount (subscription band). */
  usdPeriod: number;
  /** USD setup amount (one-time). */
  usdSetup?: number | null;
  /** Controlled selected local currency. */
  value?: DisplayCurrencyCode;
  onChange?: (code: DisplayCurrencyCode) => void;
  className?: string;
};

export function LocalCurrencyHint({
  usdPeriod,
  usdSetup = 0,
  value,
  onChange,
  className = "",
}: Props) {
  const code = value ?? DEFAULT_DISPLAY_CURRENCY;
  const setup = usdSetup ?? 0;

  return (
    <div
      className={`rounded-lg border border-dashed border-[var(--line)] bg-[#f8fafc] px-3 py-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
          Approx. in local currency
        </p>
        <label className="text-xs font-semibold text-[var(--navy)]">
          <span className="sr-only">Local currency</span>
          <select
            className="rounded-md border border-[var(--line)] bg-white px-2 py-1 text-xs font-semibold"
            value={code}
            onChange={(e) =>
              onChange?.(e.target.value as DisplayCurrencyCode)
            }
          >
            {DISPLAY_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-2 text-sm font-semibold text-[var(--ink)]">
        ≈ {formatApproxFromUsd(usdPeriod, code)}
        <span className="ml-1 text-xs font-medium text-[var(--steel)]">
          period
        </span>
      </p>
      {setup > 0 ? (
        <p className="mt-0.5 text-xs text-[var(--navy)]">
          + setup ≈ {formatApproxFromUsd(setup, code)} (one-time)
        </p>
      ) : null}
      <p className="mt-2 text-[11px] leading-relaxed text-[var(--steel)]">
        Estimate only for planning (e.g. Malaysia MYR). Your card bank may show a
        different amount. Charged amount follows USD/INR checkout — not this
        estimate.
      </p>
    </div>
  );
}
