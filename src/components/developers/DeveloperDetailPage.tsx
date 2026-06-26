"use client";

import Link from "next/link";
import { useDeveloper } from "@/hooks/useDevelopers";
import { useProjects } from "@/hooks/useProjects";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { Gallery } from "@/components/catalog/Gallery";
import { ProjectCard } from "@/components/catalog/ProjectCard";
import { CtaSection } from "@/components/catalog/CtaSection";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { theme } from "@/styles/theme";
import { getPrimaryMediaUrl } from "@/lib/format/catalog";

export function DeveloperDetailPage({ slug }: { slug: string }) {
  const { data: developer, isLoading, isError, error, refetch } = useDeveloper(slug);
  const { data: projectsData } = useProjects({ developerSlug: slug, limit: 12 });

  const logoUrl = developer?.logo ?? getPrimaryMediaUrl(developer?.media);

  return (
    <main className="bg-white pt-24">
      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        skeletonCount={1}
      >
        {developer && (
          <>
            <section className="relative overflow-hidden bg-black text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: `url(${getPrimaryMediaUrl(developer.media) ?? "/cinematic/frame_0035.jpg"})`,
                }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" aria-hidden />
              <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,6rem)]">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Developers", href: "/developers" },
                    { label: developer.name },
                  ]}
                />
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <div className="flex items-center gap-5">
                    {logoUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={logoUrl}
                        alt={developer.name}
                        className="h-20 w-20 rounded-full border-2 border-white/20 object-cover"
                      />
                    )}
                    <div>
                      <h1 className={theme.components.section.titleOnDark}>{developer.name}</h1>
                      {developer.reraRegistrationNumber && (
                        <p className="mt-2 text-sm text-white/60">
                          RERA: {developer.reraRegistrationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  {developer.projectCount != null && (
                    <p className="text-3xl font-semibold text-[#E63946]">
                      {developer.projectCount}{" "}
                      <span className="text-base font-normal text-white/60">Active Projects</span>
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className={theme.components.section.wrapper}>
              <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                <Reveal>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-black">About</h2>
                  <p className="mt-4 leading-relaxed text-black/65">
                    {developer.description ?? "No description available."}
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <Gallery media={developer.media} title={developer.name} />
                </Reveal>
              </div>

              <section className="mt-16">
                <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-black">
                  Active Projects
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {(developer.activeProjects ?? projectsData?.data ?? []).map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>

              <section className="mt-16 grid gap-6 sm:grid-cols-3">
                {developer.projectCount != null && (
                  <div className={`p-6 text-center ${theme.components.card.base}`}>
                    <p className="text-3xl font-semibold text-[#C8102E]">{developer.projectCount}</p>
                    <p className="mt-1 text-sm text-black/55">Active Projects</p>
                  </div>
                )}
                {developer.website && (
                  <div className={`p-6 text-center ${theme.components.card.base}`}>
                    <Link
                      href={developer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#C8102E] hover:underline"
                    >
                      Official Website
                    </Link>
                    <p className="mt-1 text-sm text-black/55">Developer Portal</p>
                  </div>
                )}
                {developer.email && (
                  <div className={`p-6 text-center ${theme.components.card.base}`}>
                    <a href={`mailto:${developer.email}`} className="text-sm font-medium text-black">
                      {developer.email}
                    </a>
                    <p className="mt-1 text-sm text-black/55">Investor Relations</p>
                  </div>
                )}
              </section>
            </div>

            <CtaSection
              eyebrow="Work With CredXP"
              title="Interested in This Developer?"
              description="Our advisory team can guide you through available inventory, payment plans, and handover timelines."
              primaryLabel="View Properties"
              primaryHref={`/properties?developerSlug=${developer.slug}`}
              secondaryLabel="Book Consultation"
              secondaryHref="/#consultation"
            />
          </>
        )}
      </CatalogPageState>
      <Footer />
    </main>
  );
}
