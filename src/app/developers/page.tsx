import { DevelopersListingPage } from "@/components/developers/DevelopersListingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubai Property Developers",
  description:
    "Explore Dubai's leading real estate developers — Emaar, DAMAC, and more. View active projects and investment opportunities.",
  path: "/developers",
});

export default function DevelopersPage() {
  return <DevelopersListingPage />;
}
