import { PropertyDetailPage } from "@/components/properties/PropertyDetailPage";
import { getPropertyBySlug } from "@/lib/api/properties";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildPropertyJsonLd,
} from "@/lib/seo/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const property = await getPropertyBySlug(slug);
    return buildPageMetadata({
      title: property.metaTitle ?? `${property.unitNumber} | Property`,
      description:
        property.metaDescription ??
        `${property.bedrooms} bedroom ${property.propertyType?.name ?? "property"} in ${property.project?.area ?? "Dubai"}.`,
      path: `/properties/${slug}`,
      image: property.media?.[0]?.url,
    });
  } catch {
    return buildPageMetadata({
      title: "Property",
      description: "Dubai property listing.",
      path: `/properties/${slug}`,
      noIndex: true,
    });
  }
}

export default async function PropertySlugPage({ params }: PageProps) {
  const { slug } = await params;
  let label = slug;
  let propertyJsonLd: ReturnType<typeof buildPropertyJsonLd> | null = null;

  try {
    const property = await getPropertyBySlug(slug);
    label = property.unitNumber;
    propertyJsonLd = buildPropertyJsonLd(property);
  } catch {
    // Client handles error
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: label, path: `/properties/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {propertyJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
        />
      )}
      <PropertyDetailPage slug={slug} />
    </>
  );
}
