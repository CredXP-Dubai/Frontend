"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  useCreateLeadMutation,
  useLeads,
} from "@/hooks/useCrm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { CursorPager } from "@/components/dashboard/CursorPager";
import { ApiPageState } from "@/components/ui/api-page-state";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import type { LeadListParams } from "@/types/dashboard";
import { readCursorList, readString, asRecord } from "@/utils/record";

const createLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(5),
  preferredLocation: z.string().optional(),
  sourceCode: z.string().optional(),
});

type CreateLeadForm = z.infer<typeof createLeadSchema>;

export function LeadsFeature() {
  const [params, setParams] = useState<LeadListParams>({ limit: 20 });
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } = useLeads(params);
  const createMutation = useCreateLeadMutation();

  const { items, meta } = data ? readCursorList(data) : { items: [], meta: { limit: 20, nextCursor: null, hasMore: false } };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadForm>({ resolver: zodResolver(createLeadSchema) });

  const onCreate = handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        email: values.email || undefined,
        preferredLocation: values.preferredLocation || undefined,
        sourceCode: values.sourceCode || "WEBSITE",
      });
      toast.success("Lead created");
      setCreateOpen(false);
      reset();
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  });

  return (
    <div>
      <PageHeader
        title="Leads"
        description="CRM lead pipeline — live from GET /api/v1/crm/leads"
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#9b0c24]"
          >
            Create lead
          </button>
        }
      />

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Select
          defaultValue=""
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              cursor: undefined,
              statusCode: e.target.value || undefined,
            }))
          }
        >
          <option value="">All statuses</option>
          <option value="NEW">NEW</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CONVERTED">CONVERTED</option>
          <option value="LOST">LOST</option>
        </Select>
        <Input
          placeholder="Property slug filter"
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              cursor: undefined,
              propertySlug: e.target.value || undefined,
            }))
          }
        />
      </div>

      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        onRetry={() => refetch()}
        emptyTitle="No leads"
        emptyMessage="Create a lead or adjust filters."
      >
        <DataTable
          rows={items}
          rowKey={(row) => readString(row, "id")}
          columns={[
            {
              key: "name",
              header: "Lead",
              render: (row) => (
                <Link
                  href={`/workspace/crm/leads/${readString(row, "id")}`}
                  className="font-medium text-[#C8102E] hover:underline"
                >
                  {[readString(row, "firstName"), readString(row, "lastName")]
                    .filter(Boolean)
                    .join(" ") || "—"}
                </Link>
              ),
            },
            {
              key: "phone",
              header: "Phone",
              render: (row) => readString(row, "phone") || "—",
            },
            {
              key: "email",
              header: "Email",
              render: (row) => readString(row, "email") || "—",
            },
            {
              key: "status",
              header: "Status",
              render: (row) => {
                const status = asRecord(row.status);
                const code = readString(status, "name") || readString(row, "statusCode") || "—";
                return <StatusBadge status={code} />;
              },
            },
            {
              key: "source",
              header: "Source",
              render: (row) => {
                const source = asRecord(row.source);
                return readString(source, "name") || readString(row, "sourceCode") || "—";
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

      <Modal open={createOpen} onOpenChange={setCreateOpen} title="Create lead">
        <form onSubmit={onCreate} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="First name" {...register("firstName")} />
              {errors.firstName && <p className="mt-1 text-xs text-[#C8102E]">{errors.firstName.message}</p>}
            </div>
            <div>
              <Input placeholder="Last name" {...register("lastName")} />
              {errors.lastName && <p className="mt-1 text-xs text-[#C8102E]">{errors.lastName.message}</p>}
            </div>
          </div>
          <Input placeholder="Phone" {...register("phone")} />
          <Input placeholder="Email (optional)" {...register("email")} />
          <Input placeholder="Preferred location" {...register("preferredLocation")} />
          <Input placeholder="Source code (e.g. WEBSITE)" {...register("sourceCode")} />
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="w-full rounded-lg bg-[#C8102E] py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Create
          </button>
        </form>
      </Modal>
    </div>
  );
}
