"use client";

import { useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { CursorPager } from "@/components/dashboard/CursorPager";
import { ApiPageState } from "@/components/ui/api-page-state";
import { readCursorList, readString, asRecord } from "@/utils/record";
import type { ProjectListParams } from "@/types/catalog";

export function ProjectCatalogFeature() {
  const [params, setParams] = useState<ProjectListParams>({ limit: 20 });
  const { data, isLoading, isError, error, refetch, isFetching } = useProjects(params);
  const { items, meta } = data ? readCursorList(data) : { items: [], meta: { limit: 20, nextCursor: null, hasMore: false } };

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Read-only catalog — project admin CRUD not in OpenAPI v1.1.0."
      />
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Backend gap: POST/PATCH/DELETE /api/v1/projects are missing.
      </div>
      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="No projects"
      >
        <DataTable
          rows={items}
          rowKey={(r) => readString(r, "slug")}
          columns={[
            {
              key: "name",
              header: "Project",
              render: (r) => (
                <Link
                  href={`/workspace/projects/${readString(r, "slug")}`}
                  className="font-medium text-[#C8102E] hover:underline"
                >
                  {readString(r, "name")}
                </Link>
              ),
            },
            {
              key: "area",
              header: "Location",
              render: (r) => [readString(r, "area"), readString(r, "city")].filter(Boolean).join(", "),
            },
            {
              key: "status",
              header: "Status",
              render: (r) => readString(asRecord(r.status), "name") || "—",
            },
            {
              key: "developer",
              header: "Developer",
              render: (r) => readString(asRecord(r.developer), "name") || "—",
            },
          ]}
        />
        <CursorPager
          hasMore={meta.hasMore}
          isLoading={isFetching}
          itemCount={items.length}
          onLoadMore={() => setParams((p) => ({ ...p, cursor: meta.nextCursor ?? undefined }))}
        />
      </ApiPageState>
    </div>
  );
}
