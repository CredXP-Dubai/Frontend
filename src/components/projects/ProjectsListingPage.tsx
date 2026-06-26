"use client";

import { useMemo, useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { CursorPagination } from "@/components/catalog/CursorPagination";
import { ProjectCard } from "@/components/catalog/ProjectCard";
import { ProjectFilters } from "@/components/catalog/ProjectFilters";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectListParams } from "@/types/catalog";
import { theme } from "@/styles/theme";

const DEFAULT_PARAMS: ProjectListParams = { limit: 12 };

export function ProjectsListingPage() {
  const [params, setParams] = useState<ProjectListParams>(DEFAULT_PARAMS);
  const queryParams = useMemo(() => params, [params]);
  const { data, isLoading, isError, error, refetch, isFetching } = useProjects(queryParams);

  return (
    <main className="bg-white pt-24">
      <div className={theme.components.section.wrapper}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
        <h1 className={theme.components.section.title}>Dubai Projects</h1>
        <p className={theme.components.section.subtitle}>
          Discover off-plan and under-construction projects across Dubai&apos;s prime locations.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <ProjectFilters
            params={params}
            onChange={setParams}
            onReset={() => setParams(DEFAULT_PARAMS)}
          />

          <div>
            <CatalogPageState
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => refetch()}
              isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
              emptyTitle="No projects found"
              emptyMessage="Try adjusting your filters."
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {data?.data.map((project, index) => (
                  <Reveal key={project.slug} delay={(index % 2) * 0.08}>
                    <ProjectCard project={project} />
                  </Reveal>
                ))}
              </div>
              <CursorPagination
                hasMore={Boolean(data?.meta.hasMore)}
                isLoading={isFetching}
                itemCount={data?.data.length ?? 0}
                onLoadMore={() =>
                  setParams((prev) => ({ ...prev, cursor: data?.meta.nextCursor ?? undefined }))
                }
              />
            </CatalogPageState>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
