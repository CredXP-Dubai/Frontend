"use client";

import { useFeaturedProperties } from "@/hooks/useProperties";
import { ApiState } from "@/components/ui/ApiState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyCard } from "./PropertyCard";

export function FeaturedProperties() {
  const { data, isLoading, isError, error } = useFeaturedProperties(6);

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
      />

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading featured properties…"
        emptyTitle="No featured properties"
        emptyMessage="Featured listings will appear when the properties API is live."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data.map((property, index) => (
            <Reveal key={property.id} delay={index * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </ApiState>
    </section>
  );
}
