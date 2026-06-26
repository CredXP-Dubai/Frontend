"use client";

import type { ProjectListParams } from "@/types/catalog";
import { theme } from "@/styles/theme";

interface ProjectFiltersProps {
  params: ProjectListParams;
  onChange: (params: ProjectListParams) => void;
  onReset: () => void;
}

export function ProjectFilters({ params, onChange, onReset }: ProjectFiltersProps) {
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
        <span className="text-xs font-medium text-black/55">Developer Slug</span>
        <input
          type="text"
          value={params.developerSlug ?? ""}
          onChange={(e) =>
            onChange({ ...params, developerSlug: e.target.value || undefined, cursor: undefined })
          }
          className={theme.components.input.light}
          placeholder="emaar-properties"
        />
      </label>
    </aside>
  );
}
