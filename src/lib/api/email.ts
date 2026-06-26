import { apiClient } from "./client";

const BASE = "/api/v1/email";

export async function listEmailTemplates(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/templates`, { params });
  return data;
}

export async function createEmailTemplate(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/templates`, payload);
  return data;
}

export async function sendEmailMessage(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/messages/send`, payload);
  return data;
}

export async function listEmailCampaigns(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/campaigns`, { params });
  return data;
}

export async function createEmailCampaign(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/campaigns`, payload);
  return data;
}

export async function launchEmailCampaign(id: string) {
  const { data } = await apiClient.post(`${BASE}/campaigns/${id}/launch`);
  return data;
}

export async function getEmailStatistics(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/statistics`, { params });
  return data;
}
