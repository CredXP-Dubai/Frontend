import type { SupportedCurrency } from "./currency";
import { convertFromAed } from "./currency";

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "commercial";

export interface BudgetRange {
  id: string;
  label: string;
  minAed: number;
  maxAed: number | null;
}

const BUDGET_RANGES_AED: BudgetRange[] = [
  { id: "under-1m", label: "Under 1M", minAed: 0, maxAed: 1_000_000 },
  { id: "1m-2m", label: "1M – 2M", minAed: 1_000_000, maxAed: 2_000_000 },
  { id: "2m-5m", label: "2M – 5M", minAed: 2_000_000, maxAed: 5_000_000 },
  { id: "5m-10m", label: "5M – 10M", minAed: 5_000_000, maxAed: 10_000_000 },
  { id: "10m-plus", label: "10M+", minAed: 10_000_000, maxAed: null },
];

export function getBudgetRangesForCurrency(currency: SupportedCurrency): BudgetRange[] {
  return BUDGET_RANGES_AED.map((range) => ({
    ...range,
    label: formatRangeLabel(range, currency),
  }));
}

function formatRangeLabel(range: BudgetRange, currency: SupportedCurrency): string {
  const min = convertFromAed(range.minAed, currency);
  const max = range.maxAed ? convertFromAed(range.maxAed, currency) : null;
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`;

  if (range.maxAed === null) return `${fmt(min)}+`;
  if (range.minAed === 0) return `Under ${fmt(max!)}`;
  return `${fmt(min)} – ${fmt(max!)}`;
}

export function resolveBudgetRange(id: string): BudgetRange | undefined {
  return BUDGET_RANGES_AED.find((r) => r.id === id);
}

export const PROPERTY_TYPES: { id: PropertyType; label: string }[] = [
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "townhouse", label: "Townhouse" },
  { id: "penthouse", label: "Penthouse" },
  { id: "commercial", label: "Commercial" },
];
