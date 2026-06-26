"use client";

import { useFeaturedProperties } from "@/hooks/useProperties";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProperties() {
  const { data, isLoading, isError, error, refetch } = useFeaturedProperties(6);

  return (
    <section
      className="mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="featured-heading"
    >
      <h2 id="featured-heading" className="sr-only">
        Featured Properties
      </h2>
      <SectionHeader
        eyebrow="Curated Selection"
        title="Featured Properties"
        subtitle="Handpicked residences from Dubai's most prestigious developers and landmark destinations."
        action={{ label: "View All Properties", href: "/properties" }}
      />

      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        emptyTitle="No featured properties"
        emptyMessage="Featured listings will appear when available from the API."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data.map((property, index) => (
            <Reveal key={property.slug} delay={index * 0.08}>
              <PropertyCard property={property} featured />
            </Reveal>
          ))}
        </div>
      </CatalogPageState>
    </section>
  );
}
