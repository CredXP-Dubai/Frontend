"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  useDeleteUserMutation,
  useInviteUserMutation,
  useUpdateUserStatusMutation,
  useUsers,
} from "@/hooks/useUsers";
import { useAdminRoles } from "@/hooks/useAdmin";
import { ApiPageState } from "@/components/ui/api-page-state";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ApiError } from "@/lib/api/client";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import type { UserListParams, UserStatus } from "@/types/openapi-helpers";
import { readPaginatedList, readString, readArray, asRecord } from "@/utils/record";

const inviteSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  roleId: z.string().uuid("Valid role UUID required"),
});

type InviteForm = z.infer<typeof inviteSchema>;

const STATUSES: UserStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED", "LOCKED", "PENDING"];

export function UserManagementFeature() {
  const [params, setParams] = useState<UserListParams>({ page: 1, limit: 20 });
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data, isLoading, isError, error, refetch, isFetching } = useUsers(params);
  const { data: rolesData } = useAdminRoles();
  const inviteMutation = useInviteUserMutation();
  const statusMutation = useUpdateUserStatusMutation();
  const deleteMutation = useDeleteUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteForm>({ resolver: zodResolver(inviteSchema) });

  const { items, meta } = data ? readPaginatedList(data) : { items: [], meta: null };
  const roles = rolesData ? readArray(rolesData) : readArray(asRecord(rolesData), "data");

  const onInvite = handleSubmit(async (values) => {
    try {
      await inviteMutation.mutateAsync(values);
      toast.success("Invitation sent");
      setInviteOpen(false);
      reset();
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  });

  const handleStatusChange = async (id: string, status: UserStatus) => {
    try {
      await statusMutation.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("User deleted");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-black">Users</h1>
          <p className="mt-1 text-sm text-black/55">Manage platform users via live API.</p>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen(true)}
          className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#9b0c24]"
        >
          Invite user
        </button>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search users…"
          onChange={(e) =>
            setParams((p) => ({ ...p, page: 1, search: e.target.value || undefined }))
          }
        />
        <Select
          defaultValue=""
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              page: 1,
              status: (e.target.value as UserStatus) || undefined,
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
        <Select
          defaultValue=""
          onChange={(e) =>
            setParams((p) => ({
              ...p,
              page: 1,
              roleId: e.target.value || undefined,
            }))
          }
        >
          <option value="">All roles</option>
          {roles.map((role) => {
            const id = readString(role, "id");
            const name = readString(role, "name") || readString(role, "code") || id;
            return (
              <option key={id} value={id}>
                {name}
              </option>
            );
          })}
        </Select>
      </div>

      <ApiPageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && items.length === 0}
        onRetry={() => refetch()}
        emptyTitle="No users found"
        emptyMessage="Adjust filters or invite a new user."
      >
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-[#F7F7F7] text-xs tracking-wide text-black/50 uppercase">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => {
                const id = readString(user, "id");
                const status = readString(user, "status") || "UNKNOWN";
                return (
                  <tr key={id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 text-black">
                      {[readString(user, "firstName"), readString(user, "lastName")]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-black/70">{readString(user, "email")}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Select
                          className="w-auto text-xs"
                          value={status}
                          onChange={(e) =>
                            handleStatusChange(id, e.target.value as UserStatus)
                          }
                          disabled={statusMutation.isPending || !id}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          disabled={deleteMutation.isPending || !id}
                          className="rounded-md border border-black/15 px-2 py-1 text-xs text-[#C8102E] hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-black/55">
            <span>
              Page {meta.page} of {meta.totalPages} · {meta.total} users
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={meta.page <= 1 || isFetching}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}
                className="rounded-md border border-black/15 px-3 py-1 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages || isFetching}
                onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}
                className="rounded-md border border-black/15 px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </ApiPageState>

      <Modal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite user"
        description="POST /api/v1/users/invite — requires roleId UUID from backend."
      >
        <form onSubmit={onInvite} className="space-y-4">
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="mt-1 text-xs text-[#C8102E]">{errors.email.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="First name" {...register("firstName")} />
              {errors.firstName && (
                <p className="mt-1 text-xs text-[#C8102E]">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Input placeholder="Last name" {...register("lastName")} />
              {errors.lastName && (
                <p className="mt-1 text-xs text-[#C8102E]">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div>
            {roles.length > 0 ? (
              <Select {...register("roleId")}>
                <option value="">Select role</option>
                {roles.map((role) => {
                  const id = readString(role, "id");
                  const name = readString(role, "name") || readString(role, "code");
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </Select>
            ) : (
              <Input placeholder="Role ID (UUID)" {...register("roleId")} />
            )}
            {errors.roleId && (
              <p className="mt-1 text-xs text-[#C8102E]">{errors.roleId.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || inviteMutation.isPending}
            className="w-full rounded-lg bg-[#C8102E] py-2 text-sm font-medium text-white hover:bg-[#9b0c24] disabled:opacity-50"
          >
            Send invitation
          </button>
        </form>
      </Modal>

      {isError && error instanceof ApiError && error.isForbidden && (
        <p className="mt-4 text-sm text-black/55">
          Your account may not have permission to list users (403).
        </p>
      )}
    </div>
  );
}
