import { apiClient } from "./client";

const ADMIN_BASE = "/api/v1/admin";

export async function listRoles() {
  const { data } = await apiClient.get(`${ADMIN_BASE}/roles`);
  return data;
}

export async function getPermissionMatrix() {
  const { data } = await apiClient.get(`${ADMIN_BASE}/permissions/matrix`);
  return data;
}

export async function getAdminStatistics() {
  const { data } = await apiClient.get(`${ADMIN_BASE}/statistics`);
  return data;
}

export async function getAdminHealth() {
  const { data } = await apiClient.get(`${ADMIN_BASE}/health`);
  return data;
}

export async function listAuditLogs(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${ADMIN_BASE}/audit-logs`, { params });
  return data;
}

export async function approveBroker(id: string) {
  const { data } = await apiClient.post(`${ADMIN_BASE}/brokers/${id}/approve`);
  return data;
}

export async function rejectBroker(id: string, reason?: string) {
  const { data } = await apiClient.post(`${ADMIN_BASE}/brokers/${id}/reject`, { reason });
  return data;
}

export async function suspendBroker(id: string, reason?: string) {
  const { data } = await apiClient.post(`${ADMIN_BASE}/brokers/${id}/suspend`, { reason });
  return data;
}
