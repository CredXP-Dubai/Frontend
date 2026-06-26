import { apiClient } from "./client";
import type { ProposalListParams } from "@/types/dashboard";

const PROPOSALS_BASE = "/api/v1/proposals";

export async function listProposals(params?: ProposalListParams) {
  const { data } = await apiClient.get(PROPOSALS_BASE, { params });
  return data;
}

export async function getProposal(id: string) {
  const { data } = await apiClient.get(`${PROPOSALS_BASE}/${id}`);
  return data;
}

export async function createProposal(payload?: unknown) {
  const { data } = await apiClient.post(PROPOSALS_BASE, payload ?? {});
  return data;
}

export async function updateProposal(id: string, payload: unknown) {
  const { data } = await apiClient.patch(`${PROPOSALS_BASE}/${id}`, payload);
  return data;
}

export async function addProposalProperty(id: string, payload: unknown) {
  const { data } = await apiClient.post(`${PROPOSALS_BASE}/${id}/properties`, payload);
  return data;
}

export async function shareProposal(id: string, payload?: unknown) {
  const { data } = await apiClient.post(`${PROPOSALS_BASE}/${id}/share`, payload ?? {});
  return data;
}

export async function downloadProposal(id: string): Promise<Blob> {
  const { data } = await apiClient.post(`${PROPOSALS_BASE}/${id}/download`, {}, {
    responseType: "blob",
  });
  return data;
}

export async function getProposalActivity(id: string) {
  const { data } = await apiClient.get(`${PROPOSALS_BASE}/${id}/activity`);
  return data;
}

export async function getPublicProposal(token: string, password?: string) {
  const { data } = await apiClient.get(`${PROPOSALS_BASE}/public/${token}`, {
    params: password ? { password } : undefined,
  });
  return data;
}
