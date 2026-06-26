import { useMutation, useQuery } from "@tanstack/react-query";
import {
  draftEmailWithAi,
  draftWhatsappWithAi,
  getAiConversation,
  listAiConversations,
  sendAiChat,
  summarizeWithAi,
} from "@/lib/api/ai";
import { queryKeys } from "@/lib/query/keys";

export function useAiConversations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.ai.conversations(params),
    queryFn: () => listAiConversations(params),
    retry: false,
  });
}

export function useAiConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.ai.conversation(id),
    queryFn: () => getAiConversation(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useAiChatMutation() {
  return useMutation({
    mutationFn: (payload: unknown) => sendAiChat(payload),
  });
}

export function useAiSummarizeMutation() {
  return useMutation({
    mutationFn: (payload: unknown) => summarizeWithAi(payload),
  });
}

export function useAiDraftEmailMutation() {
  return useMutation({
    mutationFn: (payload: unknown) => draftEmailWithAi(payload),
  });
}

export function useAiDraftWhatsappMutation() {
  return useMutation({
    mutationFn: (payload: unknown) => draftWhatsappWithAi(payload),
  });
}
