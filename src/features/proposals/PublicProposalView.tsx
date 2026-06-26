"use client";

import { usePublicProposal } from "@/hooks/useProposals";
import { ApiPageState } from "@/components/ui/api-page-state";
import { asRecord, readString } from "@/utils/record";

export function PublicProposalView({ token }: { token: string }) {
  const { data, isLoading, isError, error, refetch } = usePublicProposal(token);
  const proposal = asRecord(data);

  return (
    <main className="min-h-screen bg-[#F7F7F7] pt-24">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <ApiPageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => refetch()}
          emptyTitle="Proposal unavailable"
        >
          <article className="rounded-2xl border border-black/10 bg-white p-8">
            <p className="text-xs font-semibold tracking-wide text-[#C8102E] uppercase">Shared Proposal</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-black">
              {readString(proposal, "title") || "Investment Proposal"}
            </h1>
            <p className="mt-4 text-sm text-black/55">
              Status: {readString(proposal, "status") || "—"}
            </p>
          </article>
        </ApiPageState>
      </div>
    </main>
  );
}
