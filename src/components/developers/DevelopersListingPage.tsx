"use client";

import { useMemo, useState } from "react";
import { useDevelopers } from "@/hooks/useDevelopers";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { CursorPagination } from "@/components/catalog/CursorPagination";
import { DeveloperCard } from "@/components/catalog/DeveloperCard";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { theme } from "@/styles/theme";

export function DevelopersListingPage() {
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const params = useMemo(() => ({ limit: 12, cursor }), [cursor]);
  const { data, isLoading, isError, error, refetch, isFetching } = useDevelopers(params);

  const developers = useMemo(() => {
    const items = data?.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q) ||
        d.slug.includes(q),
    );
  }, [data?.data, search]);

  return (
    <main className="bg-white pt-24">
      <div className={theme.components.section.wrapper}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Developers" }]} />
        <h1 className={theme.components.section.title}>Dubai Developers</h1>
        <p className={theme.components.section.subtitle}>
          Browse RERA-regulated developers and explore their active project portfolios.
        </p>

        <div className="mb-8 mt-8">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name (client-side on current page)"
            className={`max-w-md ${theme.components.input.light}`}
            aria-label="Search developers"
          />
          {search && (
            <p className="mt-2 text-xs text-black/45">
              Backend text search is not available — filtering current results only.
            </p>
          )}
        </div>

        <CatalogPageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          isEmpty={!isLoading && !isError && developers.length === 0}
          emptyTitle="No developers found"
          skeletonCount={8}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {developers.map((developer, index) => (
              <Reveal key={developer.slug} delay={(index % 4) * 0.06}>
                <DeveloperCard developer={developer} />
              </Reveal>
            ))}
          </div>
          <CursorPagination
            hasMore={Boolean(data?.meta.hasMore)}
            isLoading={isFetching}
            itemCount={developers.length}
            onLoadMore={() => setCursor(data?.meta.nextCursor ?? undefined)}
          />
        </CatalogPageState>
      </div>
      <Footer />
    </main>
  );
}
