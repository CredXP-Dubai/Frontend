import { useQuery } from "@tanstack/react-query";
import {
  getPropertyBySlug,
  listFeaturedProperties,
  listProperties,
} from "@/lib/api/properties";
import { queryKeys } from "@/lib/query/keys";
import type { PropertyListParams } from "@/types/catalog";

export function useProperties(params?: PropertyListParams) {
  return useQuery({
    queryKey: queryKeys.properties.list(params as Record<string, unknown>),
    queryFn: () => listProperties(params),
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: queryKeys.properties.featured(limit),
    queryFn: () => listFeaturedProperties(limit),
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(slug),
    queryFn: () => getPropertyBySlug(slug),
    enabled: Boolean(slug),
  });
}
