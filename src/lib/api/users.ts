import { apiClient } from "./client";
import type {
  CreateUserRequest,
  PaginatedResponse,
  User,
  UserListParams,
  UserStatus,
} from "@/types/api";

const USERS_BASE = "/api/v1/users";

export async function listUsers(
  params?: UserListParams,
): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<PaginatedResponse<User>>(USERS_BASE, {
    params,
  });
  return data;
}

export async function getUser(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`${USERS_BASE}/${id}`);
  return data;
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  const { data } = await apiClient.post<User>(USERS_BASE, payload);
  return data;
}

export async function updateUser(
  id: string,
  payload: Partial<User>,
): Promise<User> {
  const { data } = await apiClient.patch<User>(`${USERS_BASE}/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`${USERS_BASE}/${id}`);
}

export async function updateUserStatus(
  id: string,
  status: UserStatus,
): Promise<User> {
  const { data } = await apiClient.patch<User>(`${USERS_BASE}/${id}/status`, {
    status,
  });
  return data;
}
