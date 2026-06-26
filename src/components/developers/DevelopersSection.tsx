"use client";

import { useFeaturedDevelopers } from "@/hooks/useDevelopers";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { DeveloperCard } from "@/components/catalog/DeveloperCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function DevelopersSection() {
  const { data, isLoading, isError, error, refetch } = useFeaturedDevelopers(8);

  return (
    <section
      id="developers"
      className="mx-auto w-full max-w-[1280px] bg-[#F7F7F7] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="developers-heading"
    >
      <SectionHeader
        eyebrow="Trusted Partners"
        title="Featured Developers"
        subtitle="Invest with confidence alongside Dubai's most respected names in luxury development."
        action={{ label: "View All Developers", href: "/developers" }}
      />

      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        emptyTitle="No developers listed"
        emptyMessage="Developer profiles will appear when available from the API."
        skeletonCount={4}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {data?.data.map((developer, index) => (
            <Reveal key={developer.slug} delay={index * 0.06}>
              <DeveloperCard developer={developer} />
            </Reveal>
          ))}
        </div>
      </CatalogPageState>
    </section>
  );
}
