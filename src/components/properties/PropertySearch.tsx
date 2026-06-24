"use client";

import { useState } from "react";
import type { PropertyListParams } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";

interface PropertySearchProps {
  onSearch: (params: PropertyListParams) => void;
  isSearching?: boolean;
}

export function PropertySearch({ onSearch, isSearching }: PropertySearchProps) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      search: search || undefined,
      location: location || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      page: 1,
      limit: 12,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-black/10 bg-[#F7F7F7] p-5 md:p-6"
    >
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
        <input
          type="number"
          placeholder="Min price (AED)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className={theme.components.input.light}
          aria-label="Minimum price"
        />
        <input
          type="number"
          placeholder="Max price (AED)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className={theme.components.input.light}
          aria-label="Maximum price"
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
        <Button type="submit" variant="primary" disabled={isSearching} className="w-full">
          {isSearching ? "Searching…" : "Search Properties"}
        </Button>
      </div>
    </form>
  );
}
