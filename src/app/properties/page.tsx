import { Suspense } from "react";
import { PropertiesListingPage } from "@/components/properties/PropertiesListingPage";
import { CardGridSkeleton } from "@/components/catalog/CardGridSkeleton";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubai Property Listings",
  description:
    "Search luxury apartments, villas, and branded residences across Dubai with live availability and pricing.",
  path: "/properties",
});

export default function PropertiesPage() {
  return (
    <Suspense fallback={<CardGridSkeleton />}>
      <PropertiesListingPage />
    </Suspense>
  );
}
