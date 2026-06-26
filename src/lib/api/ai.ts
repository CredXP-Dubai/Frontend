import { apiClient } from "./client";

const BASE = "/api/v1/ai";

export async function sendAiChat(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/chat`, payload);
  return data;
}

export async function listAiConversations(params?: Record<string, unknown>) {
  const { data } = await apiClient.get(`${BASE}/conversations`, { params });
  return data;
}

export async function getAiConversation(id: string) {
  const { data } = await apiClient.get(`${BASE}/conversations/${id}`);
  return data;
}

export async function getAiRecommendations(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/recommendations`, payload);
  return data;
}

export async function summarizeWithAi(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/summarize`, payload);
  return data;
}

export async function draftEmailWithAi(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/draft-email`, payload);
  return data;
}

export async function draftWhatsappWithAi(payload: unknown) {
  const { data } = await apiClient.post(`${BASE}/draft-whatsapp`, payload);
  return data;
}
