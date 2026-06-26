import { apiClient } from "./client";

const BASE = "/api/v1/automation";

export async function listAutomationTemplates(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/templates`, { params });
  return data;
}

export async function createAutomationTemplate(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/templates`, payload);
  return data;
}

export async function listAutomationConversations(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/conversations`, { params });
  return data;
}

export async function sendAutomationMessage(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/messages/send`, payload);
  return data;
}

export async function listAutomationCampaigns(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/campaigns`, { params });
  return data;
}

export async function createAutomationCampaign(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/campaigns`, payload);
  return data;
}

export async function getAutomationCampaignStats(id: string) {
  const { data } = await apiClient.get(`${BASE}/campaigns/${id}/stats`);
  return data;
}

export async function listAutomationRules(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/rules`, { params });
  return data;
}

export async function createAutomationRule(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/rules`, payload);
  return data;
}
