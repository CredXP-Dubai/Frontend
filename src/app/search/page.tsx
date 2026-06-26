import { GlobalSearchPage } from "@/components/search/GlobalSearchPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Dubai Real Estate",
  description: "Search developers, projects, and properties across CredXP Dubai.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return <GlobalSearchPage />;
}
