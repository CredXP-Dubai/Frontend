import { apiClient } from "./client";
import type {
  AssignLeadRequest,
  CreateLeadInterestRequest,
  CreateLeadNoteRequest,
  CreateLeadRequest,
  LeadListParams,
  UpdateLeadStatusRequest,
} from "@/types/dashboard";

const CRM_BASE = "/api/v1/crm";

export async function listLeads(params?: LeadListParams) {
  const { data } = await apiClient.get(`${CRM_BASE}/leads`, { params });
  return data;
}

export async function getLead(id: string) {
  const { data } = await apiClient.get(`${CRM_BASE}/leads/${id}`);
  return data;
}

export async function createLead(payload: CreateLeadRequest) {
  const { data } = await apiClient.post(`${CRM_BASE}/leads`, payload);
  return data;
}

export async function updateLead(id: string, payload: unknown) {
  const { data } = await apiClient.patch(`${CRM_BASE}/leads/${id}`, payload);
  return data;
}

export async function assignLead(id: string, payload: AssignLeadRequest) {
  const { data } = await apiClient.post(`${CRM_BASE}/leads/${id}/assign`, payload);
  return data;
}

export async function updateLeadStatus(id: string, payload: UpdateLeadStatusRequest) {
  const { data } = await apiClient.post(`${CRM_BASE}/leads/${id}/status`, payload);
  return data;
}

export async function addLeadNote(id: string, payload: CreateLeadNoteRequest) {
  const { data } = await apiClient.post(`${CRM_BASE}/leads/${id}/notes`, payload);
  return data;
}

export async function addLeadInterest(id: string, payload: CreateLeadInterestRequest) {
  const { data } = await apiClient.post(`${CRM_BASE}/leads/${id}/interests`, payload);
  return data;
}
