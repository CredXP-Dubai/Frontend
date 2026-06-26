import { ProjectDetailPage } from "@/components/projects/ProjectDetailPage";
import { getProjectBySlug } from "@/lib/api/projects";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    return buildPageMetadata({
      title: project.metaTitle ?? `${project.name} | Dubai Project`,
      description:
        project.metaDescription ??
        project.description ??
        `Explore ${project.name} in ${project.area}, Dubai.`,
      path: `/projects/${slug}`,
      image: project.media?.[0]?.url,
    });
  } catch {
    return buildPageMetadata({
      title: "Project",
      description: "Dubai real estate project.",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }
}

export default async function ProjectSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let projectName = slug;

  try {
    const project = await getProjectBySlug(slug);
    projectName = project.name;
  } catch {
    // Client handles error
  }

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: projectName, path: `/projects/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetailPage slug={slug} />
    </>
  );
}
