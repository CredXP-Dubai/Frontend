"use client";

import { useRouter } from "next/navigation";
import { PropertySearch } from "@/components/properties/PropertySearch";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { buildPropertySearchParams } from "@/lib/search/smartSearch";
import type { PropertySearchFormState } from "@/lib/search/smartSearch";

export function HomeSearchSection() {
  const router = useRouter();

  function handleSearch(state: PropertySearchFormState) {
    const params = buildPropertySearchParams(state);
    const query = new URLSearchParams();
    if (params.area) query.set("area", params.area);
    if (params.city) query.set("city", params.city);
    if (params.bedrooms) query.set("bedrooms", String(params.bedrooms));
    if (params.propertyTypeCode) query.set("propertyTypeCode", params.propertyTypeCode);
    if (params.priceMin) query.set("priceMin", String(params.priceMin));
    if (params.priceMax) query.set("priceMax", String(params.priceMax));
    router.push(`/properties${query.toString() ? `?${query}` : ""}`);
  }

  return (
    <section
      id="search"
      className="mx-auto w-full max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-[clamp(3rem,8vw,5rem)]"
      aria-labelledby="search-heading"
    >
      <SectionHeader
        eyebrow="Smart Discovery"
        title="Find Your Dubai Investment"
        subtitle="Search by location, budget, property type, and bedrooms — all filters are optional."
      />
      <Reveal>
        <PropertySearch onSearch={handleSearch} redirectMode />
      </Reveal>
    </section>
  );
}
