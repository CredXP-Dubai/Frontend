import { useQuery } from "@tanstack/react-query";
import { listDevelopers } from "@/lib/api/developers";
import { listProjects } from "@/lib/api/projects";
import { listProperties } from "@/lib/api/properties";
import { queryKeys } from "@/lib/query/keys";

export interface GlobalSearchParams {
  q?: string;
  city?: string;
  area?: string;
  limit?: number;
}

export function useGlobalSearch(params: GlobalSearchParams) {
  const area = params.area?.trim() || params.q?.trim();
  const city = params.city?.trim();
  const limit = params.limit ?? 6;

  return useQuery({
    queryKey: queryKeys.search.global(params as Record<string, unknown>),
    queryFn: async () => {
      const [developers, projects, properties] = await Promise.all([
        listDevelopers({ limit }),
        listProjects({ city, area, limit }),
        listProperties({ city, area, limit, sort: "newest" }),
      ]);

      const q = params.q?.trim().toLowerCase();
      const filterByName = <T extends { name: string; slug: string }>(items: T[]) => {
        if (!q) return items;
        return items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q),
        );
      };

      return {
        developers: filterByName(developers.data),
        projects: filterByName(projects.data),
        properties: q
          ? properties.data.filter(
              (p) =>
                p.unitNumber.toLowerCase().includes(q) ||
                p.slug.includes(q) ||
                p.project.name.toLowerCase().includes(q) ||
                p.developer.name.toLowerCase().includes(q),
            )
          : properties.data,
      };
    },
    enabled: Boolean(area || city || params.q),
  });
}
