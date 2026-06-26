"use client";

import { useFeaturedProjects } from "@/hooks/useProjects";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { ProjectCard } from "@/components/catalog/ProjectCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProjectsSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedProjects(6);

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="projects-heading"
    >
      <SectionHeader
        eyebrow="Landmark Destinations"
        title="Featured Projects"
        subtitle="Explore master-planned communities and branded residences across Dubai's prime corridors."
        action={{ label: "View All Projects", href: "/projects" }}
      />

      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        emptyTitle="No featured projects"
        emptyMessage="Featured projects will appear when available from the API."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.08}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </CatalogPageState>
    </section>
  );
}
