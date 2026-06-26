import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProposalProperty,
  createProposal,
  downloadProposal,
  getProposal,
  getProposalActivity,
  getPublicProposal,
  listProposals,
  shareProposal,
  updateProposal,
} from "@/lib/api/proposals";
import { queryKeys } from "@/lib/query/keys";
import type { ProposalListParams } from "@/types/dashboard";

export function useProposals(params?: ProposalListParams) {
  return useQuery({
    queryKey: queryKeys.proposals.list(params as Record<string, unknown>),
    queryFn: () => listProposals(params),
    retry: (count, error) => {
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return count < 2;
    },
  });
}

export function useProposal(id: string) {
  return useQuery({
    queryKey: queryKeys.proposals.detail(id),
    queryFn: () => getProposal(id),
    enabled: Boolean(id),
  });
}

export function useProposalActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.proposals.activity(id),
    queryFn: () => getProposalActivity(id),
    enabled: Boolean(id),
  });
}

export function usePublicProposal(token: string, password?: string) {
  return useQuery({
    queryKey: queryKeys.proposals.public(token),
    queryFn: () => getPublicProposal(token, password),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useCreateProposalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload?: unknown) => createProposal(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.proposals.all });
    },
  });
}

export function useUpdateProposalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      updateProposal(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.proposals.detail(id) });
      await qc.invalidateQueries({ queryKey: queryKeys.proposals.all });
    },
  });
}

export function useShareProposalMutation() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: unknown }) =>
      shareProposal(id, payload),
  });
}

export function useDownloadProposalMutation() {
  return useMutation({
    mutationFn: (id: string) => downloadProposal(id),
  });
}

export function useAddProposalPropertyMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: unknown }) =>
      addProposalProperty(id, payload),
    onSuccess: async (_, { id }) => {
      await qc.invalidateQueries({ queryKey: queryKeys.proposals.detail(id) });
    },
  });
}
