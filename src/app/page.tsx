import { HomeHero } from "@/components/home/HomeHero";
import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";
import { FeaturedProjectsSection } from "@/components/projects/FeaturedProjectsSection";
import { DevelopersSection } from "@/components/developers/DevelopersSection";
import { InvestmentBenefitsSection } from "@/components/home/InvestmentBenefitsSection";
import { RoiCtaSection } from "@/components/home/RoiCtaSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { Footer } from "@/components/layout/Footer";
import { buildOrganizationJsonLd, buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "CredXP Dubai | Exclusive Luxury Real Estate",
  description:
    "Invest in Dubai's most prestigious off-plan and ready properties from the world's leading developers.",
  path: "/",
});

export default function Home() {
  const jsonLd = buildOrganizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative bg-white">
        <HomeHero />
        <div className="relative bg-white">
          <HomeSearchSection />
          <FeaturedProperties />
          <FeaturedProjectsSection />
          <DevelopersSection />
          <InvestmentBenefitsSection />
          <RoiCtaSection />
          <ConsultationSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
