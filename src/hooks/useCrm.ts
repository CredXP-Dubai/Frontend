"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignLead,
  addLeadInterest,
  addLeadNote,
  createLead,
  getLead,
  listLeads,
  updateLead,
  updateLeadStatus,
} from "@/lib/api/crm";
import { queryKeys } from "@/lib/query/keys";
import type {
  AssignLeadRequest,
  CreateLeadInterestRequest,
  CreateLeadNoteRequest,
  CreateLeadRequest,
  LeadListParams,
  UpdateLeadStatusRequest,
} from "@/types/dashboard";

export function useLeads(params?: LeadListParams) {
  return useQuery({
    queryKey: queryKeys.crm.leads(params as Record<string, unknown>),
    queryFn: () => listLeads(params),
    retry: (count, error) => {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) return false;
      return count < 2;
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: queryKeys.crm.lead(id),
    queryFn: () => getLead(id),
    enabled: Boolean(id),
  });
}

export function useCreateLeadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadRequest) => createLead(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.all });
    },
  });
}

export function useUpdateLeadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) => updateLead(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.lead(id) });
      await qc.invalidateQueries({ queryKey: queryKeys.crm.all });
    },
  });
}

export function useAssignLeadMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignLeadRequest }) =>
      assignLead(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.lead(id) });
    },
  });
}

export function useUpdateLeadStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadStatusRequest }) =>
      updateLeadStatus(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.lead(id) });
      await qc.invalidateQueries({ queryKey: queryKeys.crm.all });
    },
  });
}

export function useAddLeadNoteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateLeadNoteRequest }) =>
      addLeadNote(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.lead(id) });
    },
  });
}

export function useAddLeadInterestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateLeadInterestRequest }) =>
      addLeadInterest(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.crm.lead(id) });
    },
  });
}
