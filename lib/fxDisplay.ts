/**
 * Approximate FX helpers for display-only local currency hints.
 * Not used for charging — Razorpay still settles via INR/USD checkout logic.
 */

export type DisplayCurrencyCode =
  | "MYR"
  | "SGD"
  | "AED"
  | "SAR"
  | "GBP"
  | "EUR"
  | "AUD"
  | "IDR";

/** Includes checkout currencies plus local estimate codes. */
export type PriceDisplayCode = "USD" | "INR" | DisplayCurrencyCode;

export type DisplayCurrency = {
  code: DisplayCurrencyCode;
  label: string;
  /** Approx units of this currency per 1 USD. */
  perUsd: number;
  locale: string;
};

/** Indicative mid-market style rates — update periodically. */
export const DISPLAY_CURRENCIES: DisplayCurrency[] = [
  { code: "MYR", label: "Malaysia (MYR)", perUsd: 4.45, locale: "en-MY" },
  { code: "SGD", label: "Singapore (SGD)", perUsd: 1.34, locale: "en-SG" },
  { code: "AED", label: "UAE (AED)", perUsd: 3.67, locale: "en-AE" },
  { code: "SAR", label: "Saudi (SAR)", perUsd: 3.75, locale: "en-SA" },
  { code: "GBP", label: "UK (GBP)", perUsd: 0.79, locale: "en-GB" },
  { code: "EUR", label: "Europe (EUR)", perUsd: 0.92, locale: "en-IE" },
  { code: "AUD", label: "Australia (AUD)", perUsd: 1.54, locale: "en-AU" },
  { code: "IDR", label: "Indonesia (IDR)", perUsd: 16200, locale: "id-ID" },
];

export const PRICE_DISPLAY_OPTIONS: {
  code: PriceDisplayCode;
  label: string;
}[] = [
  { code: "USD", label: "USD · LUT" },
  { code: "INR", label: "INR · GST" },
  ...DISPLAY_CURRENCIES.map((c) => ({
    code: c.code as PriceDisplayCode,
    label: `${c.code} · ${c.label.split(" (")[0]}`,
  })),
];

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrencyCode = "MYR";
export const DEFAULT_PRICE_DISPLAY: PriceDisplayCode = "USD";

export function getDisplayCurrency(code: string | null | undefined) {
  const upper = (code || DEFAULT_DISPLAY_CURRENCY).toUpperCase();
  return (
    DISPLAY_CURRENCIES.find((c) => c.code === upper) ??
    DISPLAY_CURRENCIES[0]!
  );
}

export function isLocalDisplayCurrency(
  code: PriceDisplayCode,
): code is DisplayCurrencyCode {
  return code !== "USD" && code !== "INR";
}

export function checkoutCurrencyForDisplay(
  code: PriceDisplayCode,
): "USD" | "INR" {
  return code === "INR" ? "INR" : "USD";
}

export function usdToDisplayAmount(usd: number, code: DisplayCurrencyCode) {
  const fx = getDisplayCurrency(code);
  return usd * fx.perUsd;
}

export function formatDisplayCurrency(amount: number, code: DisplayCurrencyCode) {
  const fx = getDisplayCurrency(code);
  const fractionDigits = code === "IDR" ? 0 : amount >= 100 ? 0 : 2;
  return new Intl.NumberFormat(fx.locale, {
    style: "currency",
    currency: fx.code,
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatApproxFromUsd(usd: number, code: DisplayCurrencyCode) {
  return formatDisplayCurrency(usdToDisplayAmount(usd, code), code);
}

/** Format a USD amount in the selected price-display currency (USD / INR / local). */
export function formatPriceDisplay(
  usdAmount: number,
  code: PriceDisplayCode,
  formatUsd: (n: number) => string,
  formatInr: (n: number) => string,
  usdToInr: (n: number) => number,
) {
  if (code === "USD") return formatUsd(usdAmount);
  if (code === "INR") return formatInr(usdToInr(usdAmount));
  return formatApproxFromUsd(usdAmount, code);
}
