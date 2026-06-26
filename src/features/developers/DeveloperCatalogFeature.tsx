"use client";

import Link from "next/link";
import { useDevelopers } from "@/hooks/useDevelopers";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { CursorPager } from "@/components/dashboard/CursorPager";
import { ApiPageState } from "@/components/ui/api-page-state";
import { readCursorList, readString } from "@/utils/record";
import { useState } from "react";

export function DeveloperCatalogFeature() {
  const [cursor, setCursor] = useState<string | undefined>();
  const { data, isLoading, isError, error, refetch, isFetching } = useDevelopers({
    limit: 20,
    cursor,
  });

  const { items, meta } = data ? readCursorList(data) : { items: [], meta: { limit: 20, nextCursor: null, hasMore: false } };

  return (
    <div>
      <PageHeader
        title="Developers"
        description="Read-only catalog view — admin CRUD endpoints are not deployed yet."
      />
      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Backend gap: POST/PATCH/DELETE /api/v1/developers are missing from OpenAPI v1.1.0.
      </div>
      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={!isLoading && !isError && items.length === 0}
        emptyTitle="No developers"
      >
        <DataTable
          rows={items}
          rowKey={(r) => readString(r, "slug")}
          columns={[
            {
              key: "name",
              header: "Developer",
              render: (r) => (
                <Link
                  href={`/workspace/developers/${readString(r, "slug")}`}
                  className="font-medium text-[#C8102E] hover:underline"
                >
                  {readString(r, "name")}
                </Link>
              ),
            },
            { key: "slug", header: "Slug", render: (r) => readString(r, "slug") },
            {
              key: "description",
              header: "Description",
              render: (r) => (
                <span className="line-clamp-1 max-w-xs">{readString(r, "description") || "—"}</span>
              ),
            },
          ]}
        />
        <CursorPager
          hasMore={meta.hasMore}
          isLoading={isFetching}
          itemCount={items.length}
          onLoadMore={() => setCursor(meta.nextCursor ?? undefined)}
        />
      </ApiPageState>
    </div>
  );
}
