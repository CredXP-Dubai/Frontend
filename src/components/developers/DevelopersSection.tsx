"use client";

import { useDevelopers } from "@/hooks/useDevelopers";
import { ApiState } from "@/components/ui/ApiState";

export function DevelopersSection() {
  const { data, isLoading, isError, error } = useDevelopers({ limit: 12 });

  return (
    <section
      id="developers"
      className="developers-section"
      aria-labelledby="developers-heading"
    >
      <div className="developers-section__header">
        <p className="section-eyebrow">Partners</p>
        <h2 id="developers-heading" className="section-heading">
          Top Developers in Dubai
        </h2>
      </div>

      <ApiState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && (data?.data?.length ?? 0) === 0}
        loadingMessage="Loading developers…"
        emptyTitle="No developers listed"
        emptyMessage="Developer profiles will appear when the API is live."
      >
        <div className="developer-grid">
          {data?.data.map((developer) => (
            <article key={developer.id} className="developer-card">
              <div className="developer-card__logo">
                {developer.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={developer.logoUrl} alt={developer.name} />
                ) : (
                  <span className="developer-card__initial">
                    {developer.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="developer-card__name">{developer.name}</h3>
              {developer.description && (
                <p className="developer-card__desc">{developer.description}</p>
              )}
              {developer.projectCount != null && (
                <p className="developer-card__meta">
                  {developer.projectCount} projects
                </p>
              )}
            </article>
          ))}
        </div>
      </ApiState>
    </section>
  );
}
