"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import {
  useDownloadProposalMutation,
  useProposal,
  useProposalActivity,
  useShareProposalMutation,
} from "@/hooks/useProposals";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ApiPageState } from "@/components/ui/api-page-state";
import { StatusBadge } from "@/components/ui/badge";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import { asRecord, readArray, readString } from "@/utils/record";

export function ProposalDetailFeature({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useProposal(id);
  const { data: activity } = useProposalActivity(id);
  const shareMutation = useShareProposalMutation();
  const downloadMutation = useDownloadProposalMutation();

  const proposal = asRecord(data);
  const timeline = readArray(activity, "data").length
    ? readArray(activity, "data")
    : readArray(asRecord(activity), "activities");

  async function handleShare() {
    try {
      const result = await shareMutation.mutateAsync({ id });
      const token = readString(result as Record<string, unknown>, "token");
      if (token) {
        await navigator.clipboard.writeText(`${window.location.origin}/proposals/public/${token}`);
        toast.success("Public link copied");
      } else {
        toast.success("Share link created");
      }
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleDownload() {
    try {
      const blob = await downloadMutation.mutateAsync(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  return (
    <ApiPageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyTitle="Proposal not found"
      moduleName="Proposals"
    >
      <PageHeader
        title={readString(proposal, "title") || `Proposal ${id.slice(0, 8)}`}
        description="Proposal detail, sharing, and PDF generation"
        actions={
          <>
            <button
              type="button"
              onClick={handleShare}
              disabled={shareMutation.isPending}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm"
            >
              Share
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm text-white"
            >
              Download PDF
            </button>
          </>
        }
      />

      <div className="mb-6">
        <StatusBadge status={readString(proposal, "status") || "DRAFT"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/45 uppercase">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-black/45">Version</dt>
              <dd>{readString(proposal, "version") || "1"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black/45">Lead ID</dt>
              <dd>{readString(proposal, "leadId") || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black/45">Broker ID</dt>
              <dd>{readString(proposal, "brokerId") || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/45 uppercase">Activity timeline</h2>
          {timeline.length === 0 ? (
            <p className="text-sm text-black/45">No activity recorded.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {timeline.map((item, i) => (
                <li key={i} className="border-l-2 border-[#C8102E]/30 pl-3">
                  {readString(item, "type") || readString(item, "action") || "Event"}
                  {readString(item, "createdAt") && (
                    <span className="ml-2 text-black/40">{readString(item, "createdAt")}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-6 text-xs text-black/45">
        Theme selection, template selection, and version history depend on PATCH /proposals body schema in OpenAPI.
      </p>
    </ApiPageState>
  );
}
