import type { Metadata } from "next";

const SITE_NAME = "CredXP Dubai";
const DEFAULT_OG_IMAGE = "/cinematic/frame_0048.jpg";

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://credxp.com").replace(/\/$/, "");
}

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${input.path.startsWith("/") ? input.path : `/${input.path}`}`;
  const image = input.image ?? `${siteUrl}${DEFAULT_OG_IMAGE}`;
  const fullTitle = input.title.includes(SITE_NAME) ? input.title : `${input.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: input.description,
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_AE",
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/cinematic/frame_0048.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "invest@credxp.com",
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function buildPropertyJsonLd(property: {
  slug: string;
  unitNumber: string;
  price: string;
  currency: { code: string };
  bedrooms: number;
  areaSqft: string;
  project?: { name?: string; area?: string; city?: string };
  media?: { url: string }[];
}) {
  const siteUrl = getSiteUrl();
  const location = [property.project?.area, property.project?.city].filter(Boolean).join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.project?.name
      ? `${property.unitNumber} at ${property.project.name}`
      : property.unitNumber,
    url: `${siteUrl}/properties/${property.slug}`,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: property.currency.code,
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.areaSqft,
      unitCode: "FTK",
    },
    address: location,
    image: property.media?.[0]?.url,
  };
}
