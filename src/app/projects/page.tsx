import { ProjectsListingPage } from "@/components/projects/ProjectsListingPage";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Dubai Real Estate Projects",
  description:
    "Browse off-plan and under-construction projects in Dubai Marina, Downtown, Creek Harbour, and more.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsListingPage />;
}
