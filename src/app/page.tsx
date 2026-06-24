import { CinematicHero } from "@/components/hero";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";
import { PropertyListings } from "@/components/properties/PropertyListings";
import { DevelopersSection } from "@/components/developers/DevelopersSection";
import { ConsultationSection } from "@/components/home/ConsultationSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative bg-white">
      <CinematicHero />

      <div className="relative bg-white">
        <FeaturedProperties />
        <PropertyListings />
        <DevelopersSection />
        <ConsultationSection />
      </div>

      <Footer />
    </main>
  );
}
