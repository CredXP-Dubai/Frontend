import type {
  CagrInput,
  InvestmentComparisonInput,
  InvestmentComparisonResult,
  RentalYieldInput,
  RoiInput,
} from "@/types/domain";

export type {
  RoiInput,
  CagrInput,
  RentalYieldInput,
  InvestmentComparisonInput,
  InvestmentComparisonResult,
} from "@/types/domain";

export function calculateRoi(input: RoiInput): number {
  const costs = input.annualCostsAed ?? 0;
  const netAnnual = input.annualRentalIncomeAed - costs;
  if (input.purchasePriceAed <= 0) return 0;
  return (netAnnual / input.purchasePriceAed) * 100;
}

export function calculateCagr(input: CagrInput): number {
  if (input.initialValue <= 0 || input.years <= 0) return 0;
  return (Math.pow(input.finalValue / input.initialValue, 1 / input.years) - 1) * 100;
}

export function calculateRentalYield(input: RentalYieldInput): number {
  if (input.purchasePriceAed <= 0) return 0;
  return (input.annualRentalIncomeAed / input.purchasePriceAed) * 100;
}

export function compareDubaiVsIndia(
  input: InvestmentComparisonInput,
): InvestmentComparisonResult {
  const dubaiAnnual = (input.dubaiPriceAed * input.dubaiAnnualYieldPct) / 100;
  const indiaAnnual = (input.indiaPriceInr * input.indiaAnnualYieldPct) / 100;
  const fx = input.inrPerAed ?? 22.5;
  const indiaAnnualAed = indiaAnnual / fx;

  return {
    dubaiAnnualIncomeAed: dubaiAnnual,
    indiaAnnualIncomeAed: indiaAnnualAed,
    dubaiYieldPct: input.dubaiAnnualYieldPct,
    indiaYieldPct: input.indiaAnnualYieldPct,
    higherYieldMarket: dubaiAnnual >= indiaAnnualAed ? "dubai" : "india",
  };
}
