import { useQuery } from "@tanstack/react-query";
import {
  getDeveloperBySlug,
  listDevelopers,
  listFeaturedDevelopers,
} from "@/lib/api/developers";
import { queryKeys } from "@/lib/query/keys";
import type { DeveloperListParams } from "@/types/catalog";

export function useDevelopers(params?: DeveloperListParams) {
  return useQuery({
    queryKey: queryKeys.developers.list(params as Record<string, unknown>),
    queryFn: () => listDevelopers(params),
  });
}

export function useFeaturedDevelopers(limit = 8) {
  return useQuery({
    queryKey: queryKeys.developers.featured(limit),
    queryFn: () => listFeaturedDevelopers(limit),
  });
}

export function useDeveloper(slug: string) {
  return useQuery({
    queryKey: queryKeys.developers.detail(slug),
    queryFn: () => getDeveloperBySlug(slug),
    enabled: Boolean(slug),
  });
}
