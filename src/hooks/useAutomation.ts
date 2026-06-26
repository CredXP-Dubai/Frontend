import { useMutation, useQuery } from "@tanstack/react-query";
import {
  listAutomationCampaigns,
  listAutomationConversations,
  listAutomationRules,
  listAutomationTemplates,
  sendAutomationMessage,
} from "@/lib/api/automation";
import {
  getEmailStatistics,
  listEmailCampaigns,
  listEmailTemplates,
} from "@/lib/api/email";
import { queryKeys } from "@/lib/query/keys";

export function useAutomationTemplates(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.automation.templates(params),
    queryFn: () => listAutomationTemplates(params),
    retry: false,
  });
}

export function useAutomationConversations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.automation.conversations(params),
    queryFn: () => listAutomationConversations(params),
    retry: false,
  });
}

export function useAutomationCampaigns(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.automation.campaigns(params),
    queryFn: () => listAutomationCampaigns(params),
    retry: false,
  });
}

export function useAutomationRules(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.automation.rules(params),
    queryFn: () => listAutomationRules(params),
    retry: false,
  });
}

export function useEmailTemplates(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.email.templates(params),
    queryFn: () => listEmailTemplates(params),
    retry: false,
  });
}

export function useEmailCampaigns(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.email.campaigns(params),
    queryFn: () => listEmailCampaigns(params),
    retry: false,
  });
}

export function useEmailStatistics(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.email.statistics(params),
    queryFn: () => getEmailStatistics(params),
    retry: false,
  });
}

export function useSendAutomationMessageMutation() {
  return useMutation({
    mutationFn: (payload: unknown) => sendAutomationMessage(payload),
  });
}
