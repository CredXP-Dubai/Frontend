"use client";

import Link from "next/link";
import { useProperty } from "@/hooks/useProperties";
import { useProperties } from "@/hooks/useProperties";
import { CatalogPageState } from "@/components/catalog/CatalogPageState";
import { Gallery } from "@/components/catalog/Gallery";
import { PropertyCard } from "@/components/catalog/PropertyCard";
import { CtaSection } from "@/components/catalog/CtaSection";
import { Breadcrumb } from "@/components/catalog/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import {
  formatArea,
  formatPrice,
  propertyLocation,
  propertyTitle,
} from "@/lib/format/catalog";
import { theme } from "@/styles/theme";

export function PropertyDetailPage({ slug }: { slug: string }) {
  const { data: property, isLoading, isError, error, refetch } = useProperty(slug);
  const { data: relatedData } = useProperties({
    projectSlug: property?.project?.slug,
    limit: 4,
  });

  const related =
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
        {property && (
          <>
            <section className="relative overflow-hidden bg-black text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: "url(/cinematic/frame_0048.jpg)" }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/70" aria-hidden />
              <div className="relative mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(4rem,10vw,6rem)]">
                <Breadcrumb
                  items={[
                    { label: "Home", href: "/" },
                    { label: "Properties", href: "/properties" },
                    { label: property.unitNumber },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  {property.availability && <Badge>{property.availability.replace(/_/g, " ")}</Badge>}
                  {property.propertyType && <Badge variant="outline">{property.propertyType.name}</Badge>}
                  {property.status && <Badge variant="outline">{property.status.name}</Badge>}
                </div>
                <h1 className={`mt-4 ${theme.components.section.titleOnDark}`}>
                  {propertyTitle(property)}
                </h1>
                <p className="mt-3 text-2xl font-semibold text-[#E63946]">
                  {formatPrice(property.price, property.currency)}
                </p>
                <p className="mt-2 text-white/70">{propertyLocation(property)}</p>
              </div>
            </section>

            <div className={theme.components.section.wrapper}>
              <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                <Reveal>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-black">
                    Specifications
                  </h2>
                  <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Spec label="Unit" value={property.unitNumber} />
                    <Spec label="Bedrooms" value={String(property.bedrooms)} />
                    <Spec label="Bathrooms" value={property.bathrooms} />
                    <Spec label="Area" value={formatArea(property.areaSqft)} />
                    {property.balconyAreaSqft && (
                      <Spec label="Balcony" value={formatArea(property.balconyAreaSqft)} />
                    )}
                    {property.floorNumber != null && (
                      <Spec label="Floor" value={String(property.floorNumber)} />
                    )}
                    {property.parkingSpaces != null && (
                      <Spec label="Parking" value={String(property.parkingSpaces)} />
                    )}
                    {property.viewType && <Spec label="View" value={property.viewType.name} />}
                    {property.furnishingStatus && (
                      <Spec label="Furnishing" value={property.furnishingStatus.name} />
                    )}
                    {property.facingDirection && (
                      <Spec label="Facing" value={property.facingDirection.name} />
                    )}
                    {property.tower && <Spec label="Tower" value={property.tower.name} />}
                  </dl>

                  {property.developer && (
                    <div className="mt-10">
                      <h3 className="text-sm font-semibold tracking-wide text-black/45 uppercase">
                        Developer
                      </h3>
                      <Link
                        href={`/developers/${property.developer.slug}`}
                        className="mt-2 inline-block text-lg font-medium text-[#C8102E] hover:underline"
                      >
                        {property.developer.name}
                      </Link>
                    </div>
                  )}

                  {property.project && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold tracking-wide text-black/45 uppercase">
                        Project
                      </h3>
                      <Link
                        href={`/projects/${property.project.slug}`}
                        className="mt-2 inline-block text-lg font-medium text-[#C8102E] hover:underline"
                      >
                        {property.project.name}
                      </Link>
                    </div>
                  )}
                </Reveal>

                <Reveal delay={0.1}>
                  <Gallery media={property.media} title={propertyTitle(property)} />
                </Reveal>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <Badge key={a.code} variant="outline">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {property.features && property.features.length > 0 && (
                <section className="mt-12">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f) => (
                      <Badge key={f.code}>{f.name}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {property.paymentPlans && property.paymentPlans.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-black">
                    Payment Plan
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {property.paymentPlans.map((plan) => (
                      <article key={plan.name} className={`p-6 ${theme.components.card.base}`}>
                        <h3 className="font-medium text-black">{plan.name}</h3>
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

              {property.location && (
                <section className="mt-16">
                  <h2 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-black">
                    Location
                  </h2>
                  <p className="text-black/65">
                    {[property.location.area, property.location.city, property.location.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {property.project?.address && (
                    <p className="mt-2 text-sm text-black/55">{property.project.address}</p>
                  )}
                </section>
              )}

              {related.length > 0 && (
                <section className="mt-16">
                  <h2 className="mb-8 font-[family-name:var(--font-display)] text-2xl text-black">
                    Related Properties
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {related.map((item) => (
                      <PropertyCard key={item.slug} property={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <CtaSection
              eyebrow="Private Advisory"
              title="Request Full Details"
              description="Get floor plans, payment schedules, and handover timelines for this unit from our Dubai team."
              primaryLabel="Book Consultation"
              primaryHref="/#consultation"
              secondaryLabel="Browse More"
              secondaryHref="/properties"
            />
          </>
        )}
      </CatalogPageState>
      <Footer />
    </main>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-black/45 uppercase">{label}</dt>
      <dd className="mt-1 text-black">{value}</dd>
    </div>
  );
}
