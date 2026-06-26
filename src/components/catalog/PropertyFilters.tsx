"use client";

import type { PropertyListParams, PropertySort } from "@/types/catalog";
import { PROPERTY_TYPES } from "@/lib/search/budgetRanges";
import { theme } from "@/styles/theme";

interface PropertyFiltersProps {
  params: PropertyListParams;
  onChange: (params: PropertyListParams) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { value: PropertySort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "bedrooms_desc", label: "Most Bedrooms" },
];

export function PropertyFilters({ params, onChange, onReset }: PropertyFiltersProps) {
  return (
    <aside className="space-y-5 rounded-2xl border border-black/10 bg-[#F7F7F7] p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-[0.14em] text-black uppercase">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#C8102E] transition-colors hover:text-[#9B0C24]"
        >
          Reset
        </button>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-black/55">City</span>
        <input
          type="text"
          value={params.city ?? ""}
          onChange={(e) => onChange({ ...params, city: e.target.value || undefined, cursor: undefined })}
          className={theme.components.input.light}
          placeholder="Dubai"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-black/55">Area</span>
        <input
          type="text"
          value={params.area ?? ""}
          onChange={(e) => onChange({ ...params, area: e.target.value || undefined, cursor: undefined })}
          className={theme.components.input.light}
          placeholder="Dubai Marina"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-black/55">Property Type</span>
        <select
          value={params.propertyTypeCode ?? ""}
          onChange={(e) =>
            onChange({ ...params, propertyTypeCode: e.target.value || undefined, cursor: undefined })
          }
          className={theme.components.input.light}
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type.id} value={type.id.toUpperCase()}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-black/55">Bedrooms</span>
        <select
          value={params.bedrooms ?? ""}
          onChange={(e) =>
            onChange({
              ...params,
              bedrooms: e.target.value ? Number(e.target.value) : undefined,
              cursor: undefined,
            })
          }
          className={theme.components.input.light}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-black/55">Min Price (AED)</span>
          <input
            type="number"
            value={params.priceMin ?? ""}
            onChange={(e) =>
              onChange({
                ...params,
                priceMin: e.target.value ? Number(e.target.value) : undefined,
                cursor: undefined,
              })
            }
            className={theme.components.input.light}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-black/55">Max Price (AED)</span>
          <input
            type="number"
            value={params.priceMax ?? ""}
            onChange={(e) =>
              onChange({
                ...params,
                priceMax: e.target.value ? Number(e.target.value) : undefined,
                cursor: undefined,
              })
            }
            className={theme.components.input.light}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-black/55">Sort</span>
        <select
          value={params.sort ?? "newest"}
          onChange={(e) =>
            onChange({ ...params, sort: e.target.value as PropertySort, cursor: undefined })
          }
          className={theme.components.input.light}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
