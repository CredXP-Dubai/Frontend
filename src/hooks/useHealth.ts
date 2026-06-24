import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    staleTime: 30_000,
  });
}
