"use client";

import Link from "next/link";
import { useProject } from "@/hooks/useProjects";
import { useProperties } from "@/hooks/useProperties";
import { useProjects } from "@/hooks/useProjects";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { Gallery } from "@/components/catalog/Gallery";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { ProjectCard } from "@/components/catalog/ProjectCard";
import { CtaSection } from "@/components/catalog/CtaSection";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { formatDate } from "@/lib/format/catalog";
import { theme } from "@/styles/theme";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const { data: project, isLoading, isError, error, refetch } = useProject(slug);
  const { data: propertiesData } = useProperties({ projectSlug: slug, limit: 6 });
  const { data: relatedData } = useProjects({
    developerSlug: project?.developer?.slug,
    limit: 4,
  });

  const relatedProjects =
    relatedData?.data.filter((item) => item.slug !== slug).slice(0, 3) ?? [];

  return (
    <main className="bg-white pt-24">
      <CatalogPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        skeletonCount={1}
      >
        {project && (
          <>
            <section className="relative overflow-hidden bg-black text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url(/cinematic/frame_0020.jpg)" }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" aria-hidden />
              <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,6rem)]">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Projects", href: "/projects" },
                    { label: project.name },
                  ]}
                />
                {project.status && <Badge className="mb-4">{project.status.name}</Badge>}
                <h1 className={theme.components.section.titleOnDark}>{project.name}</h1>
                <p className="mt-3 text-white/70">
                  {[project.area, project.city].filter(Boolean).join(", ")}
                </p>
                {project.developer && (
                  <Link
                    href={`/developers/${project.developer.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-[#E63946] hover:underline"
                  >
                    by {project.developer.name}
                  </Link>
                )}
              </div>
            </section>

            <div className={theme.components.section.wrapper}>
              <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                <Reveal>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-black">
                    Description
                  </h2>
                  <p className="mt-4 leading-relaxed text-black/65">
                    {project.description ?? "No description available."}
                  </p>

                  <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                    {formatDate(project.handoverDate) && (
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-black/45 uppercase">
                          Handover
                        </dt>
                        <dd className="mt-1 text-black">{formatDate(project.handoverDate)}</dd>
                      </div>
                    )}
                    {project.serviceChargePerSqft && (
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-black/45 uppercase">
                          Service Charge
                        </dt>
                        <dd className="mt-1 text-black">
                          AED {project.serviceChargePerSqft}/sq ft
                        </dd>
                      </div>
                    )}
                    {project.dldPermitNumber && (
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-black/45 uppercase">
                          DLD Permit
                        </dt>
                        <dd className="mt-1 text-black">{project.dldPermitNumber}</dd>
                      </div>
                    )}
                    {project.address && (
                      <div>
                        <dt className="text-xs font-semibold tracking-wide text-black/45 uppercase">
                          Address
                        </dt>
                        <dd className="mt-1 text-black">{project.address}</dd>
                      </div>
                    )}
                  </dl>
                </Reveal>
                <Reveal delay={0.1}>
                  <Gallery media={project.media} title={project.name} />
                </Reveal>
              </div>

              {project.paymentPlans && project.paymentPlans.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Payment Plans
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.paymentPlans.map((plan) => (
                      <article key={plan.name} className={`p-6 ${theme.components.card.base}`}>
                        <h3 className="font-medium text-black">{plan.name}</h3>
                        {plan.downPaymentPercent && (
                          <p className="mt-2 text-sm text-black/55">
                            Down payment: {plan.downPaymentPercent}%
                          </p>
                        )}
                        {plan.milestones && (
                          <ul className="mt-4 space-y-2">
                            {plan.milestones.map((m) => (
                              <li key={m.label} className="flex justify-between text-sm text-black/65">
                                <span>{m.label}</span>
                                <span className="font-medium">{m.percentage}%</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {project.amenities && project.amenities.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.map((a) => (
                      <Badge key={a.code} variant="outline">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {project.features && project.features.length > 0 && (
                <section className="mt-12">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((f) => (
                      <Badge key={f.code}>{f.name}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {project.latitude && project.longitude && (
                <section className="mt-16">
                  <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-black">
                    Location
                  </h2>
                  <p className="text-black/65">
                    {project.location?.area ?? project.area}, {project.location?.emirate ?? "Dubai"}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${project.latitude},${project.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium text-[#C8102E] hover:underline"
                  >
                    View on Google Maps
                  </a>
                </section>
              )}

              <section className="mt-16">
                <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-black">
                  Available Properties
                </h2>
                {propertiesData?.data.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {propertiesData.data.map((property) => (
                      <PropertyCard key={property.slug} property={property} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-black/55">No available units listed for this project.</p>
                )}
              </section>

              {relatedProjects.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-black">
                    Related Projects
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {relatedProjects.map((item) => (
                      <ProjectCard key={item.slug} project={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <CtaSection
              eyebrow="Invest Now"
              title="Request Project Details"
              description="Get floor plans, availability, and payment milestones from our Dubai advisory team."
              primaryLabel="View All Units"
              primaryHref={`/properties?projectSlug=${project.slug}`}
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
