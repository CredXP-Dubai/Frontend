import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBrokerProfile,
  listBrokerCommissions,
  listBrokerLeads,
  updateBrokerProfile,
  uploadBrokerDocument,
} from "@/lib/api/brokers";
import { queryKeys } from "@/lib/query/keys";

export function useBrokerProfile() {
  return useQuery({
    queryKey: queryKeys.brokers.profile,
    queryFn: getBrokerProfile,
    retry: false,
  });
}

export function useBrokerLeads(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.brokers.leads(params),
    queryFn: () => listBrokerLeads(params),
    retry: false,
  });
}

export function useBrokerCommissions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.brokers.commissions(params),
    queryFn: () => listBrokerCommissions(params),
    retry: false,
  });
}

export function useUpdateBrokerProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => updateBrokerProfile(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.brokers.profile });
    },
  });
}

export function useUploadBrokerDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadBrokerDocument(formData),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.brokers.profile });
    },
  });
}
