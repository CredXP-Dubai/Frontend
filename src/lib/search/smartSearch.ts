import type { PropertyListParams, PropertySort } from "@/types/catalog";
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
  cursor?: string;
  limit?: number;
  sort?: PropertySort;
}

export function hasActiveSearchFilters(params: PropertyListParams): boolean {
  return Boolean(
    params.area ||
      params.city ||
      params.propertyTypeCode ||
      params.bedrooms ||
      params.priceMin ||
      params.priceMax ||
      params.developerSlug ||
      params.projectSlug ||
      params.availability,
  );
}

/**
 * Maps form state to backend property search query params.
 */
export function buildPropertySearchParams(
  state: PropertySearchFormState,
): PropertyListParams {
  const params: PropertyListParams = {
    cursor: state.cursor,
    limit: state.limit ?? 12,
    sort: state.sort,
  };

  const search = state.search?.trim();
  if (search) params.area = search;

  const location = state.location?.trim();
  if (location) params.city = location;

  if (state.bedrooms) params.bedrooms = state.bedrooms;

  if (state.propertyType) {
    params.propertyTypeCode = state.propertyType.toUpperCase();
  }

  if (state.budgetRangeId) {
    const range = resolveBudgetRange(state.budgetRangeId);
    if (range) {
      if (range.minAed) params.priceMin = range.minAed;
      if (range.maxAed) params.priceMax = range.maxAed;
    }
  }

  if (!hasActiveSearchFilters(params) && !params.sort) {
    params.sort = "newest";
  }

  return params;
}
