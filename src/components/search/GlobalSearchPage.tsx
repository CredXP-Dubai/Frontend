"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { DeveloperCard } from "@/components/catalog/DeveloperCard";
import { ProjectCard } from "@/components/catalog/ProjectCard";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { theme } from "@/styles/theme";

function GlobalSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);

  const { data, isLoading, isError, error, refetch, isFetching } = useGlobalSearch({
    q: initialQ || undefined,
    limit: 12,
  });

  const hasQuery = Boolean(initialQ.trim());
  const isEmpty =
    hasQuery &&
    !isLoading &&
    !isError &&
    (data?.developers.length ?? 0) === 0 &&
    (data?.projects.length ?? 0) === 0 &&
    (data?.properties.length ?? 0) === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <main className="bg-white pt-24">
      <div className={theme.components.section.wrapper}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <h1 className={theme.components.section.title}>Global Search</h1>
        <p className={theme.components.section.subtitle}>
          Search developers, projects, and properties using backend list filters.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-2xl gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, area, or project"
            className={`flex-1 ${theme.components.input.light}`}
            aria-label="Global search"
          />
          <button
            type="submit"
            disabled={isFetching}
            className="rounded-xl bg-[#C8102E] px-6 py-3 text-sm font-medium tracking-[0.12em] text-white uppercase hover:bg-[#9B0C24] disabled:opacity-50"
          >
            Search
          </button>
        </form>

        <p className="mt-4 max-w-2xl text-xs text-black/45">
          No unified search endpoint exists — results combine{" "}
          <code className="text-black/60">GET /developers</code>,{" "}
          <code className="text-black/60">GET /projects</code>, and{" "}
          <code className="text-black/60">GET /properties</code> with client-side name filtering.
        </p>

        {!hasQuery ? (
          <p className="mt-12 text-sm text-black/55">Enter a search term to begin.</p>
        ) : (
          <CatalogPageState
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            isEmpty={isEmpty}
            emptyTitle="No results found"
            emptyMessage="Try a different search term or browse listings directly."
          >
            {data && (
              <div className="mt-12 space-y-16">
                {data.developers.length > 0 && (
                  <section>
                    <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                      Developers
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                      {data.developers.map((d) => (
                        <DeveloperCard key={d.slug} developer={d} />
                      ))}
                    </div>
                  </section>
                )}
                {data.projects.length > 0 && (
                  <section>
                    <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                      Projects
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {data.projects.map((p) => (
                        <ProjectCard key={p.slug} project={p} />
                      ))}
                    </div>
                  </section>
                )}
                {data.properties.length > 0 && (
                  <section>
                    <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                      Properties
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                      {data.properties.map((p) => (
                        <PropertyCard key={p.slug} property={p} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </CatalogPageState>
        )}
      </div>
      <Footer />
    </main>
  );
}

export function GlobalSearchPage() {
  return (
    <Suspense>
      <GlobalSearchContent />
    </Suspense>
  );
}
