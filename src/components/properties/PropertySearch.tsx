"use client";

import { useState } from "react";
import type { PropertyListParams } from "@/types/api";

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
    <form className="property-search" onSubmit={handleSubmit}>
      <div className="property-search__row">
        <input
          type="search"
          placeholder="Search properties…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="property-search__input"
          aria-label="Search properties"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="property-search__input"
          aria-label="Location"
        />
      </div>
      <div className="property-search__row">
        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="property-search__input"
          aria-label="Minimum price"
        />
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="property-search__input"
          aria-label="Maximum price"
        />
        <select
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="property-search__input"
          aria-label="Bedrooms"
        >
          <option value="">Any beds</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
        <button
          type="submit"
          className="property-search__btn"
          disabled={isSearching}
        >
          {isSearching ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
