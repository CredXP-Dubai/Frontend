"use client";

import { useState } from "react";
import { useProperties } from "@/hooks/useProperties";
import { ApiState } from "@/components/ui/ApiState";
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
      className="property-listings"
      aria-labelledby="listings-heading"
    >
      <div className="property-listings__header">
        <p className="section-eyebrow">Exclusive Collection</p>
        <h2 id="listings-heading" className="section-heading">
          Property Listings
        </h2>
        <p className="section-subheading">
          Live inventory from the CredXP Dubai platform.
        </p>
      </div>

      <PropertySearch
        onSearch={setParams}
        isSearching={isFetching && !isLoading}
      />

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading properties from API…"
        emptyTitle="No properties found"
        emptyMessage="Try adjusting your search filters."
      >
        <div className="property-grid">
          {data?.data.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {data?.meta && data.meta.totalPages > 1 && (
          <p className="property-listings__pagination">
            Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total}{" "}
            properties
          </p>
        )}
      </ApiState>
    </section>
  );
}
