import { useQuery } from "@tanstack/react-query";
import { listProperties } from "@/lib/api/properties";
import { queryKeys } from "@/lib/query/keys";
import type { PropertyListParams } from "@/types/api";

export function useProperties(params?: PropertyListParams) {
  return useQuery({
    queryKey: queryKeys.properties.list(params as Record<string, unknown>),
    queryFn: () => listProperties(params),
    retry: false,
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: () => listProperties({ featured: true, limit, page: 1 }),
    retry: false,
  });
}
