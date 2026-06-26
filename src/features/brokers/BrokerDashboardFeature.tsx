"use client";

import { useRef } from "react";
import toast from "react-hot-toast";
import {
  useBrokerCommissions,
  useBrokerLeads,
  useBrokerProfile,
  useUploadBrokerDocumentMutation,
} from "@/hooks/useBrokers";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { ApiPageState } from "@/components/ui/api-page-state";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import { readCursorList, readString, asRecord } from "@/utils/record";

export function BrokerDashboardFeature() {
  const { data: profile, isLoading, isError, error, refetch } = useBrokerProfile();
  const { data: leadsData } = useBrokerLeads({ limit: 10 });
  const { data: commissionsData } = useBrokerCommissions({ limit: 10 });
  const uploadMutation = useUploadBrokerDocumentMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const profileRecord = asRecord(profile);
  const { items: leads } = leadsData ? readCursorList(leadsData) : { items: [] };
  const { items: commissions } = commissionsData
    ? readCursorList(commissionsData)
    : { items: [] };

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadMutation.mutateAsync(formData);
      toast.success("Document uploaded");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  return (
    <div>
      <PageHeader
        title="Broker Portal"
        description="Profile, documents, leads, and commissions from /api/v1/brokers/*"
      />

      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        emptyTitle="Broker profile unavailable"
        emptyMessage="Your account may not be registered as a broker yet."
      >
        <section className="mb-8 rounded-xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 font-medium text-black">Profile</h2>
          <dl className="grid gap-3 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-black/45">Agency</dt>
              <dd className="text-black">{readString(profileRecord, "agencyName") || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/45">License</dt>
              <dd className="text-black">{readString(profileRecord, "licenseNumber") || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/45">Status</dt>
              <dd className="text-black">{readString(profileRecord, "status") || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/45">WhatsApp</dt>
              <dd className="text-black">{readString(profileRecord, "whatsappNumber") || "—"}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="rounded-lg border border-black/15 px-4 py-2 text-sm hover:bg-black/5"
            >
              Upload document
            </button>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-medium text-black">My Leads</h2>
            <DataTable
              rows={leads}
              rowKey={(r) => readString(r, "id")}
              emptyMessage="No broker leads"
              columns={[
                {
                  key: "name",
                  header: "Name",
                  render: (r) =>
                    [readString(r, "firstName"), readString(r, "lastName")].filter(Boolean).join(" ") || "—",
                },
                { key: "phone", header: "Phone", render: (r) => readString(r, "phone") || "—" },
              ]}
            />
          </div>
          <div>
            <h2 className="mb-4 font-medium text-black">Commissions</h2>
            <DataTable
              rows={commissions}
              rowKey={(r) => readString(r, "id")}
              emptyMessage="No commissions"
              columns={[
                {
                  key: "amount",
                  header: "Amount",
                  render: (r) => readString(r, "amount") || readString(r, "commissionAmount") || "—",
                },
                {
                  key: "status",
                  header: "Status",
                  render: (r) => readString(r, "status") || "—",
                },
              ]}
            />
          </div>
        </div>
      </ApiPageState>
    </div>
  );
}
