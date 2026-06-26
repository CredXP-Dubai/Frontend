"use client";

import { useState } from "react";
import Link from "next/link";
import { useProperties } from "@/hooks/useProperties";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { CursorPager } from "@/components/dashboard/CursorPager";
import { ApiPageState } from "@/components/ui/api-page-state";
import { formatPrice } from "@/lib/format/catalog";
import { readCursorList, readString, asRecord } from "@/utils/record";
import type { PropertyListParams } from "@/types/catalog";

export function PropertyCatalogFeature() {
  const [params, setParams] = useState<PropertyListParams>({ limit: 20, sort: "newest" });
  const { data, isLoading, isError, error, refetch, isFetching } = useProperties(params);
  const { items, meta } = data ? readCursorList(data) : { items: [], meta: { limit: 20, nextCursor: null, hasMore: false } };

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Read-only inventory — property admin CRUD not in OpenAPI v1.1.0."
      />
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Backend gap: POST/PATCH/DELETE /api/v1/properties are missing.
      </div>
      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="No properties"
      >
        <DataTable
          rows={items}
          rowKey={(r) => readString(r, "slug")}
          columns={[
            {
              key: "unit",
              header: "Unit",
              render: (r) => (
                <Link
                  href={`/workspace/properties/${readString(r, "slug")}`}
                  className="font-medium text-[#C8102E] hover:underline"
                >
                  {readString(r, "unitNumber")}
                </Link>
              ),
            },
            {
              key: "project",
              header: "Project",
              render: (r) => readString(asRecord(r.project), "name") || "—",
            },
            {
              key: "developer",
              header: "Developer",
              render: (r) => readString(asRecord(r.developer), "name") || "—",
            },
            {
              key: "price",
              header: "Price",
              render: (r) => formatPrice(readString(r, "price"), asRecord(r.currency) as { code: string; symbol: string }),
            },
            {
              key: "availability",
              header: "Status",
              render: (r) => readString(r, "availability") || "—",
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
