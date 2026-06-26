import { DeveloperDetailPage } from "@/components/developers/DeveloperDetailPage";
import { getDeveloperBySlug } from "@/lib/api/developers";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const developer = await getDeveloperBySlug(slug);
    return buildPageMetadata({
      title: `${developer.name} | Dubai Developer`,
      description:
        developer.description ??
        `Explore ${developer.name} projects and investment opportunities in Dubai.`,
      path: `/developers/${slug}`,
      image: developer.logo ?? developer.media?.[0]?.url,
    });
  } catch {
    return buildPageMetadata({
      title: "Developer",
      description: "Dubai property developer profile.",
      path: `/developers/${slug}`,
      noIndex: true,
    });
  }
}

export default async function DeveloperSlugPage({ params }: PageProps) {
  const { slug } = await params;
  let developerName = slug;

  try {
    const developer = await getDeveloperBySlug(slug);
    developerName = developer.name;
  } catch {
    // Client component handles error state
  }

  const jsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Developers", path: "/developers" },
    { name: developerName, path: `/developers/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DeveloperDetailPage slug={slug} />
    </>
  );
}
