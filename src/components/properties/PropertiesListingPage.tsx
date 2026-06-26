"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProperties } from "@/hooks/useProperties";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { CursorPagination } from "@/components/catalog/CursorPagination";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { PropertyFilters } from "@/components/catalog/PropertyFilters";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { buildPropertySearchParams } from "@/lib/search/smartSearch";
import type { PropertyListParams } from "@/types/catalog";
import { theme } from "@/styles/theme";

const DEFAULT_PARAMS: PropertyListParams = { limit: 12, sort: "newest" };

function paramsFromSearchParams(searchParams: URLSearchParams): PropertyListParams {
  return {
    ...DEFAULT_PARAMS,
    city: searchParams.get("city") ?? undefined,
    area: searchParams.get("area") ?? undefined,
    developerSlug: searchParams.get("developerSlug") ?? undefined,
    projectSlug: searchParams.get("projectSlug") ?? undefined,
    propertyTypeCode: searchParams.get("propertyTypeCode") ?? undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    priceMin: searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined,
    priceMax: searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined,
    sort: (searchParams.get("sort") as PropertyListParams["sort"]) ?? "newest",
  };
}

export function PropertiesListingPage() {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<PropertyListParams>(() =>
    paramsFromSearchParams(searchParams),
  );

  useEffect(() => {
    setParams(paramsFromSearchParams(searchParams));
  }, [searchParams]);

  const queryParams = useMemo(() => params, [params]);
  const { data, isLoading, isError, error, refetch, isFetching } = useProperties(queryParams);

  return (
    <main className="bg-white pt-24">
      <div className={theme.components.section.wrapper}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Properties" }]} />
        <h1 className={theme.components.section.title}>Dubai Properties</h1>
        <p className={theme.components.section.subtitle}>
          Search investment-grade residences with real-time availability from the CredXP API.
        </p>

        <div className="mt-8">
          <PropertySearch
            onSearch={(next) => setParams(buildPropertySearchParams({ ...next, limit: 12 }))}
            isSearching={isFetching && !isLoading}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <PropertyFilters
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
              emptyTitle="No properties found"
              emptyMessage="Try adjusting your search filters."
            >
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                {data?.data.map((property, index) => (
                  <Reveal key={property.slug} delay={(index % 2) * 0.08}>
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
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
