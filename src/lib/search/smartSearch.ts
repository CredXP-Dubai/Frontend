import type { PropertyListParams } from "@/types/api";
import type { SupportedCurrency } from "./currency";
import { resolveBudgetRange, type PropertyType } from "./budgetRanges";

export interface SmartSearchCriteria {
  currency?: SupportedCurrency;
  budgetRangeId?: string;
  propertyType?: PropertyType;
}

export interface PropertySearchFormState extends SmartSearchCriteria {
  search?: string;
  location?: string;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

const DEFAULT_CURRENCY: SupportedCurrency = "AED";

/** @deprecated Use hasActiveSearchFilters — kept for analytics if needed */
export function isSmartSearchComplete(
  criteria: Partial<SmartSearchCriteria>,
): criteria is Required<SmartSearchCriteria> {
  return Boolean(criteria.currency && criteria.budgetRangeId && criteria.propertyType);
}

export function hasActiveSearchFilters(params: PropertyListParams): boolean {
  return Boolean(
    params.search ||
      params.location ||
      params.type ||
      params.budget ||
      params.currency ||
      params.bedrooms ||
      params.minPrice ||
      params.maxPrice ||
      params.developerId ||
      params.projectId,
  );
}

/**
 * Builds API query params — only includes fields that have values.
 * Currency defaults to AED when a budget filter is applied.
 */
export function buildPropertySearchParams(
  state: PropertySearchFormState,
): PropertyListParams {
  const params: PropertyListParams = {
    page: state.page ?? 1,
    limit: state.limit ?? 12,
  };

  const search = state.search?.trim();
  if (search) params.search = search;

  const location = state.location?.trim();
  if (location) params.location = location;

  if (state.bedrooms) params.bedrooms = state.bedrooms;

  if (state.propertyType) params.type = state.propertyType;

  if (state.budgetRangeId) {
    const range = resolveBudgetRange(state.budgetRangeId);
    if (range) {
      params.budget = range.maxAed ?? range.minAed;
      params.currency = state.currency ?? DEFAULT_CURRENCY;
    }
  } else if (state.currency) {
    params.currency = state.currency;
  }

  if (!hasActiveSearchFilters(params)) {
    params.sort = "featured,-createdAt";
  }

  return params;
}
