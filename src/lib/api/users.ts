import { apiClient } from "./client";
import type {
  InviteUserRequest,
  UserDetailResponse,
  UserListParams,
  UserListResponse,
  UserStatus,
} from "@/types/openapi-helpers";

const USERS_BASE = "/api/v1/users";

export async function listUsers(params?: UserListParams): Promise<UserListResponse> {
  const { data } = await apiClient.get<UserListResponse>(USERS_BASE, { params });
  return data;
}

export async function getUser(id: string): Promise<UserDetailResponse> {
  const { data } = await apiClient.get<UserDetailResponse>(`${USERS_BASE}/${id}`);
  return data;
}

/**
 * OpenAPI v0.4.1 does not document POST /api/v1/users request body.
 * @see BACKEND_GAPS.md
 */
export async function createUser(payload: unknown): Promise<UserDetailResponse> {
  const { data } = await apiClient.post<UserDetailResponse>(USERS_BASE, payload);
  return data;
}

export async function updateUser(id: string, payload: unknown): Promise<UserDetailResponse> {
  const { data } = await apiClient.patch<UserDetailResponse>(`${USERS_BASE}/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`${USERS_BASE}/${id}`);
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<UserDetailResponse> {
  const { data } = await apiClient.patch<UserDetailResponse>(`${USERS_BASE}/${id}/status`, {
    status,
  });
  return data;
}

export async function inviteUser(payload: InviteUserRequest): Promise<void> {
  await apiClient.post(`${USERS_BASE}/invite`, payload);
}
