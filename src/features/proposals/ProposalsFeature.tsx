"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useCreateProposalMutation,
  useDownloadProposalMutation,
  useProposals,
  useShareProposalMutation,
} from "@/hooks/useProposals";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { CursorPager } from "@/components/dashboard/CursorPager";
import { ApiPageState } from "@/components/ui/api-page-state";
import { StatusBadge } from "@/components/ui/badge";
import { Select } from "@/components/ui/input";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import type { ProposalListParams, ProposalStatus } from "@/types/dashboard";
import { readCursorList, readString, asRecord } from "@/utils/record";

const STATUSES: ProposalStatus[] = [
  "DRAFT",
  "SENT",
  "VIEWED",
  "ACCEPTED",
  "EXPIRED",
  "ARCHIVED",
];

export function ProposalsFeature() {
  const [params, setParams] = useState<ProposalListParams>({ limit: 20 });
  const { data, isLoading, isError, error, refetch, isFetching } = useProposals(params);
  const createMutation = useCreateProposalMutation();
  const shareMutation = useShareProposalMutation();
  const downloadMutation = useDownloadProposalMutation();

  const { items, meta } = data ? readCursorList(data) : { items: [], meta: { limit: 20, nextCursor: null, hasMore: false } };

  async function handleCreate() {
    try {
      const created = await createMutation.mutateAsync({});
      const id = readString(asRecord(created), "id");
      toast.success(id ? "Proposal created" : "Proposal created");
      await refetch();
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleShare(id: string) {
    try {
      const result = await shareMutation.mutateAsync({ id });
      const token = readString(result as Record<string, unknown>, "token");
      toast.success(token ? `Share link: /proposals/public/${token}` : "Share link created");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleDownload(id: string) {
    try {
      const blob = await downloadMutation.mutateAsync(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF download started");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  return (
    <div>
      <PageHeader
        title="Proposals"
        description="Investment proposals — live from GET /api/v1/proposals"
        actions={
          <button
            type="button"
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#9b0c24] disabled:opacity-50"
          >
            Create proposal
          </button>
        }
      />

      <div className="mb-4 max-w-xs">
        <Select
          defaultValue=""
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              cursor: undefined,
              status: (e.target.value as ProposalStatus) || undefined,
            }))
          }
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        onRetry={() => refetch()}
        emptyTitle="No proposals"
        moduleName="Proposals"
      >
        <DataTable
          rows={items}
          rowKey={(row) => readString(row, "id")}
          columns={[
            {
              key: "id",
              header: "Proposal",
              render: (row) => {
                const id = readString(row, "id");
                return (
                  <Link href={`/workspace/proposals/${id}`} className="font-medium text-[#C8102E] hover:underline">
                    {readString(row, "title") || id.slice(0, 8)}
                  </Link>
                );
              },
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={readString(row, "status") || "DRAFT"} />,
            },
            {
              key: "version",
              header: "Version",
              render: (row) => readString(row, "version") || "1",
            },
            {
              key: "actions",
              header: "Actions",
              className: "text-right",
              render: (row) => {
                const id = readString(row, "id");
                return (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleShare(id)}
                      className="text-xs text-black/60 hover:text-[#C8102E]"
                    >
                      Share
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(id)}
                      className="text-xs text-black/60 hover:text-[#C8102E]"
                    >
                      PDF
                    </button>
                  </div>
                );
              },
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
