"use client";

import { useState } from "react";
import type { PropertyListParams } from "@/types/catalog";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";
import type { SupportedCurrency } from "@/lib/search/currency";
import type { PropertyType } from "@/lib/search/budgetRanges";
import { buildPropertySearchParams } from "@/lib/search/smartSearch";
import type { PropertySearchFormState } from "@/lib/search/smartSearch";
import { trackEvent } from "@/lib/analytics/events";
import { SmartSearchSteps } from "./SmartSearchSteps";

interface PropertySearchProps {
  onSearch: (params: PropertyListParams | PropertySearchFormState) => void;
  isSearching?: boolean;
  redirectMode?: boolean;
}

export function PropertySearch({ onSearch, isSearching, redirectMode }: PropertySearchProps) {
  const [currency, setCurrency] = useState<SupportedCurrency | "">("");
  const [budgetRangeId, setBudgetRangeId] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const state: PropertySearchFormState = {
      currency: currency || undefined,
      budgetRangeId: budgetRangeId || undefined,
      propertyType: propertyType || undefined,
      search: search || undefined,
      location: location || undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      limit: 12,
    };

    const params = buildPropertySearchParams(state);

    trackEvent("property_search_submitted", {
      area: params.area,
      city: params.city,
      propertyTypeCode: params.propertyTypeCode,
      bedrooms: params.bedrooms,
    });

    if (redirectMode) {
      onSearch(state);
      return;
    }

    onSearch(params);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-[#F7F7F7] p-5 md:p-6"
    >
      <SmartSearchSteps
        currency={currency}
        budgetRangeId={budgetRangeId}
        propertyType={propertyType}
        onCurrencyChange={(c) => {
          setCurrency(c);
          if (!c) setBudgetRangeId("");
        }}
        onBudgetChange={setBudgetRangeId}
        onPropertyTypeChange={setPropertyType}
      />

      <p className="mb-4 text-[0.6875rem] font-semibold tracking-[0.22em] text-[#C8102E] uppercase">
        Refine Your Search
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="search"
          placeholder="Search properties"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={theme.components.input.light}
          aria-label="Search properties"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={theme.components.input.light}
          aria-label="Location"
        />
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className={theme.components.input.light}
          aria-label="Bedrooms"
        >
          <option value="">Any bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <Button
          type="submit"
          variant="primary"
          disabled={isSearching}
          className="w-full"
        >
          {isSearching ? "Searching…" : "Search Properties"}
        </Button>
      </div>
    </form>
  );
}
