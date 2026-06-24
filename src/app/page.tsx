import { CinematicHero } from "@/components/hero";
import { FeaturedProperties } from "@/components/properties/FeaturedProperties";
import { PropertyListings } from "@/components/properties/PropertyListings";
import { DevelopersSection } from "@/components/developers/DevelopersSection";
import { BackendStatus } from "@/components/ui/BackendStatus";

export default function Home() {
  return (
    <main className="relative bg-black">
      <CinematicHero />

      <div className="site-content">
        <BackendStatus />
        <FeaturedProperties />
        <PropertyListings />
        <DevelopersSection />

        <section
          id="consultation"
          className="consultation-section"
        >
          <p className="section-eyebrow">Private Advisory</p>
          <h2 className="section-heading">Book a Consultation</h2>
          <p className="section-subheading">
            Speak with our Dubai property specialists about exclusive
            off-plan and ready investments.
          </p>
        </section>
      </div>
    </main>
  );
}
