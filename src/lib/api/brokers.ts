import { apiClient } from "./client";

const BROKERS_BASE = "/api/v1/brokers";

export async function getBrokerProfile() {
  const { data } = await apiClient.get(`${BROKERS_BASE}/profile`);
  return data;
}

export async function updateBrokerProfile(payload: unknown) {
  const { data } = await apiClient.patch(`${BROKERS_BASE}/profile`, payload);
  return data;
}

export async function uploadBrokerDocument(formData: FormData) {
  const { data } = await apiClient.post(`${BROKERS_BASE}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listBrokerLeads(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BROKERS_BASE}/leads`, { params });
  return data;
}

export async function listBrokerCommissions(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BROKERS_BASE}/commissions`, { params });
  return data;
}
