export type SupportedCurrency = "AED" | "USD" | "INR" | "GBP" | "EUR";

export const CURRENCY_RATES_TO_AED: Record<SupportedCurrency, number> = {
  AED: 1,
  USD: 3.6725,
  INR: 0.044,
  GBP: 4.65,
  EUR: 3.98,
};

export function convertToAed(amount: number, currency: SupportedCurrency): number {
  return Math.round(amount * CURRENCY_RATES_TO_AED[currency]);
}

export function convertFromAed(amountAed: number, currency: SupportedCurrency): number {
  const rate = CURRENCY_RATES_TO_AED[currency];
  return Math.round(amountAed / rate);
}

export function formatCurrency(amount: number, currency: SupportedCurrency): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
