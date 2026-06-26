import { useQuery } from "@tanstack/react-query";
import {
  getProjectBySlug,
  listFeaturedProjects,
  listProjects,
} from "@/lib/api/projects";
import { queryKeys } from "@/lib/query/keys";
import type { ProjectListParams } from "@/types/catalog";

export function useProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params as Record<string, unknown>),
    queryFn: () => listProjects(params),
  });
}

export function useFeaturedProjects(limit = 6) {
  return useQuery({
    queryKey: queryKeys.projects.featured(limit),
    queryFn: () => listFeaturedProjects(limit),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: () => getProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}
