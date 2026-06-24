"use client";

import { useState } from "react";
import { useFeaturedProperties } from "@/hooks/useProperties";
import { ApiState } from "@/components/ui/ApiState";
import { PropertyCard } from "./PropertyCard";

export function FeaturedProperties() {
  const { data, isLoading, isError, error } = useFeaturedProperties(6);

  return (
    <section className="featured-properties" aria-labelledby="featured-heading">
      <h2 id="featured-heading" className="section-heading">
        Featured Properties
      </h2>

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading featured properties…"
        emptyTitle="No featured properties"
        emptyMessage="Featured listings will appear when the properties API is live."
      >
        <div className="property-grid">
          {data?.data.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </ApiState>
    </section>
  );
}
