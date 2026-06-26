"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { CursorPagination } from "@/components/catalog/CursorPagination";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import type { PropertyListParams } from "@/types/catalog";
import { hasActiveSearchFilters } from "@/lib/search/smartSearch";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { PropertySearch } from "./PropertySearch";

const DEFAULT_PARAMS: PropertyListParams = {
  limit: 12,
  sort: "newest",
};

export function PropertyListings() {
  const [params, setParams] = useState<PropertyListParams>(DEFAULT_PARAMS);
  const { data, isLoading, isFetching, isError, error, refetch } = useProperties(params);
  const showingAll = !hasActiveSearchFilters(params);

  return (
    <section
      id="properties"
      className="mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,7rem)]"
      aria-labelledby="listings-heading"
    >
      <SectionHeader
        eyebrow="Exclusive Collection"
        title={showingAll ? "All Available Properties" : "Property Listings"}
        subtitle={
          showingAll
            ? "Browse available units across Dubai from the live CredXP API."
            : "Explore investment-grade residences across Dubai Marina, Downtown, Palm Jumeirah, and beyond."
        }
        action={{ label: "Full Listings Page", href: "/properties" }}
      />

      <Reveal className="mb-10">
        <PropertySearch
          onSearch={setParams}
          isSearching={isFetching && !isLoading}
        />
      </Reveal>

      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        emptyTitle="No properties found"
        emptyMessage="Try adjusting your search filters."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data?.data.map((property, index) => (
            <Reveal key={property.slug} delay={(index % 3) * 0.08}>
              <PropertyCard property={property} />
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
    </section>
  );
}
