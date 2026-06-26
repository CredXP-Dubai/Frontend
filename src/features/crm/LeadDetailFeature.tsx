"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAddLeadInterestMutation,
  useAddLeadNoteMutation,
  useAssignLeadMutation,
  useLead,
  useUpdateLeadStatusMutation,
} from "@/hooks/useCrm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ApiPageState } from "@/components/ui/api-page-state";
import { StatusBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import { asRecord, readArray, readString } from "@/utils/record";

export function LeadDetailFeature({ id }: { id: string }) {
  const { data, isLoading, isError, error, refetch } = useLead(id);
  const statusMutation = useUpdateLeadStatusMutation();
  const assignMutation = useAssignLeadMutation();
  const noteMutation = useAddLeadNoteMutation();
  const interestMutation = useAddLeadInterestMutation();

  const [statusCode, setStatusCode] = useState("");
  const [agentId, setAgentId] = useState("");
  const [note, setNote] = useState("");
  const [propertySlug, setPropertySlug] = useState("");

  const lead = asRecord(data);
  const notes = readArray(lead, "notes");
  const activities = readArray(lead, "activities");
  const interests = readArray(lead, "interests");

  async function handleStatus() {
    if (!statusCode) return;
    try {
      await statusMutation.mutateAsync({ id, payload: { statusCode } });
      toast.success("Status updated");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleAssign() {
    try {
      await assignMutation.mutateAsync({
        id,
        payload: { agentId: agentId || null },
      });
      toast.success("Lead assigned");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleNote() {
    if (!note.trim()) return;
    try {
      await noteMutation.mutateAsync({ id, payload: { content: note, isInternal: true } });
      toast.success("Note added");
      setNote("");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleInterest() {
    if (!propertySlug.trim()) return;
    try {
      await interestMutation.mutateAsync({
        id,
        payload: { propertySlug: propertySlug.trim() },
      });
      toast.success("Property interest added");
      setPropertySlug("");
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
      emptyTitle="Lead not found"
    >
      <PageHeader
        title={[readString(lead, "firstName"), readString(lead, "lastName")].filter(Boolean).join(" ") || "Lead"}
        description={readString(lead, "email") || readString(lead, "phone")}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <StatusBadge status={readString(asRecord(lead.status), "name") || readString(lead, "statusCode") || "—"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-black/45 uppercase">Update status</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Status code (e.g. QUALIFIED)"
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleStatus}
              disabled={statusMutation.isPending}
              className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Update
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-black/45 uppercase">Assign agent</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Agent UUID"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAssign}
              disabled={assignMutation.isPending}
              className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Assign
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-black/45 uppercase">Add note</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-2 w-full rounded-xl border border-black/10 p-3 text-sm"
            rows={3}
            placeholder="Internal note"
          />
          <button
            type="button"
            onClick={handleNote}
            disabled={noteMutation.isPending}
            className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm text-white"
          >
            Save note
          </button>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-black/45 uppercase">Property interest</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Property slug"
              value={propertySlug}
              onChange={(e) => setPropertySlug(e.target.value)}
            />
            <button
              type="button"
              onClick={handleInterest}
              disabled={interestMutation.isPending}
              className="shrink-0 rounded-lg bg-[#C8102E] px-4 py-2 text-sm text-white"
            >
              Add
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <TimelineCard title="Notes" items={notes} field="content" />
        <TimelineCard title="Activities" items={activities} field="type" />
        <TimelineCard title="Interests" items={interests} field="propertySlug" />
      </div>
    </ApiPageState>
  );
}

function TimelineCard({
  title,
  items,
  field,
}: {
  title: string;
  items: Record<string, unknown>[];
  field: string;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-5">
      <h2 className="mb-4 font-medium text-black">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-black/45">None yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="border-l-2 border-[#C8102E]/30 pl-3 text-sm text-black/65">
              {readString(item, field) || readString(item, "content") || "—"}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
