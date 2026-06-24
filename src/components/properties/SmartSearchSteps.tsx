"use client";

import type { SupportedCurrency } from "@/lib/search/currency";
import { CURRENCY_RATES_TO_AED } from "@/lib/search/currency";
import {
  PROPERTY_TYPES,
  getBudgetRangesForCurrency,
  type PropertyType,
} from "@/lib/search/budgetRanges";
import { theme } from "@/styles/theme";

interface SmartSearchStepsProps {
  currency: SupportedCurrency | "";
  budgetRangeId: string;
  propertyType: PropertyType | "";
  onCurrencyChange: (currency: SupportedCurrency | "") => void;
  onBudgetChange: (id: string) => void;
  onPropertyTypeChange: (type: PropertyType | "") => void;
}

const stepLabelClass =
  "mb-2 text-[0.65rem] font-semibold tracking-[0.18em] text-[#C8102E] uppercase";

const DEFAULT_CURRENCY: SupportedCurrency = "AED";

export function SmartSearchSteps({
  currency,
  budgetRangeId,
  propertyType,
  onCurrencyChange,
  onBudgetChange,
  onPropertyTypeChange,
}: SmartSearchStepsProps) {
  const displayCurrency = currency || DEFAULT_CURRENCY;
  const budgetRanges = getBudgetRangesForCurrency(displayCurrency);

  return (
    <div className="mb-5 grid gap-4 border-b border-black/10 pb-5">
      <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-black/45 uppercase">
        Smart Search — refine your search using any combination of filters
      </p>

      <div>
        <p className={stepLabelClass}>Step 1 — Currency</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CURRENCY_RATES_TO_AED) as SupportedCurrency[]).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onCurrencyChange(currency === code ? "" : code)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium tracking-wide uppercase transition-colors ${
                currency === code
                  ? "border-[#C8102E] bg-[#C8102E] text-white"
                  : "border-black/15 bg-white text-black/70 hover:border-[#C8102E]"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
        {!currency && (
          <p className="mt-2 text-xs text-black/40">Defaults to AED when not selected</p>
        )}
      </div>

      <div>
        <p className={stepLabelClass}>Step 2 — Budget</p>
        <select
          value={budgetRangeId}
          onChange={(e) => onBudgetChange(e.target.value)}
          className={theme.components.input.light}
          aria-label="Budget range"
        >
          <option value="">Any budget</option>
          {budgetRanges.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label} ({displayCurrency})
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className={stepLabelClass}>Step 3 — Property Type</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() =>
                onPropertyTypeChange(propertyType === type.id ? "" : type.id)
              }
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                propertyType === type.id
                  ? "border-[#C8102E] bg-[#C8102E] text-white"
                  : "border-black/15 bg-white text-black/70 hover:border-[#C8102E]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
