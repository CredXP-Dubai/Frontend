import { useQuery } from "@tanstack/react-query";
import { listDevelopers } from "@/lib/api/developers";
import { queryKeys } from "@/lib/query/keys";
import type { DeveloperListParams } from "@/types/api";

export function useDevelopers(params?: DeveloperListParams) {
  return useQuery({
    queryKey: queryKeys.developers.list(params as Record<string, unknown>),
    queryFn: () => listDevelopers(params),
    retry: false,
  });
}
