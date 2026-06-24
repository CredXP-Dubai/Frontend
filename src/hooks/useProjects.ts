import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/api/projects";
import { queryKeys } from "@/lib/query/keys";
import type { ProjectListParams } from "@/types/api";

export function useProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params as Record<string, unknown>),
    queryFn: () => listProjects(params),
    retry: false,
  });
}
