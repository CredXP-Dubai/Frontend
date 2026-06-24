"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { ApiState } from "@/components/ui/ApiState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import type { PropertyListParams } from "@/types/api";
import { PropertyCard } from "./PropertyCard";
import { PropertySearch } from "./PropertySearch";

const DEFAULT_PARAMS: PropertyListParams = { page: 1, limit: 12 };

export function PropertyListings() {
  const [params, setParams] = useState<PropertyListParams>(DEFAULT_PARAMS);
  const { data, isLoading, isFetching, isError, error } = useProperties(params);

  return (
    <section
      id="properties"
      className="mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="listings-heading"
    >
      <SectionHeader
        eyebrow="Exclusive Collection"
        title="Property Listings"
        subtitle="Explore investment-grade residences across Dubai Marina, Downtown, Palm Jumeirah, and beyond."
      />

      <Reveal className="mb-10">
        <PropertySearch
          onSearch={setParams}
          isSearching={isFetching && !isLoading}
        />
      </Reveal>

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading properties from API…"
        emptyTitle="No properties found"
        emptyMessage="Try adjusting your search filters."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data.map((property, index) => (
            <Reveal key={property.id} delay={(index % 3) * 0.08}>
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
        {data?.meta && data.meta.totalPages > 1 && (
          <p className="mt-10 text-center text-sm text-[rgba(255,255,255,0.45)]">
            Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} properties
          </p>
        )}
      </ApiState>
    </section>
  );
}
