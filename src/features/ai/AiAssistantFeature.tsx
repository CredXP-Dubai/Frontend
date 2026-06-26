"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAiChatMutation,
  useAiConversations,
  useAiDraftEmailMutation,
  useAiDraftWhatsappMutation,
  useAiSummarizeMutation,
} from "@/hooks/useAi";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ApiPageState } from "@/components/ui/api-page-state";
import { Input } from "@/components/ui/input";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import { readCursorList, readString, asRecord } from "@/utils/record";

export function AiAssistantFeature() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const { data: conversations, isLoading, isError, error, refetch } = useAiConversations({ limit: 10 });
  const chatMutation = useAiChatMutation();
  const summarizeMutation = useAiSummarizeMutation();
  const draftEmailMutation = useAiDraftEmailMutation();
  const draftWhatsappMutation = useAiDraftWhatsappMutation();

  const history = conversations ? readCursorList(conversations).items : [];

  async function handleChat() {
    if (!prompt.trim()) return;
    try {
      const response = await chatMutation.mutateAsync({ message: prompt });
      const record = asRecord(response);
      const reply =
        readString(record, "reply") ||
        readString(record, "content") ||
        readString(record, "message") ||
        JSON.stringify(response);
      setMessages((m) => [
        ...m,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  async function handleTool(action: "summarize" | "email" | "whatsapp") {
    if (!prompt.trim()) return;
    try {
      let response: unknown;
      if (action === "summarize") response = await summarizeMutation.mutateAsync({ text: prompt });
      else if (action === "email") response = await draftEmailMutation.mutateAsync({ context: prompt });
      else response = await draftWhatsappMutation.mutateAsync({ context: prompt });

      const record = asRecord(response);
      const output =
        readString(record, "draft") ||
        readString(record, "summary") ||
        readString(record, "content") ||
        JSON.stringify(response);
      setMessages((m) => [...m, { role: "assistant", content: output }]);
      toast.success("AI response ready");
    } catch (e) {
      toast.error(getHttpErrorMessage(e));
    }
  }

  return (
    <div>
      <PageHeader
        title="AI Sales Assistant"
        description="Chat, summaries, and message drafts via /api/v1/ai/*"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-black/10 bg-white p-5">
          <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-sm text-black/45">Start a conversation or draft a message.</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-4 py-3 text-sm ${
                  m.role === "user" ? "bg-[#F7F7F7] text-black" : "bg-[#C8102E]/5 text-black"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask AI or provide context…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChat()}
            />
            <button
              type="button"
              onClick={handleChat}
              disabled={chatMutation.isPending}
              className="shrink-0 rounded-lg bg-[#C8102E] px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              Chat
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(["summarize", "email", "whatsapp"] as const).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleTool(action)}
                className="rounded-md border border-black/15 px-3 py-1.5 text-xs capitalize"
              >
                Draft {action}
              </button>
            ))}
          </div>
        </section>

        <aside>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-black/45 uppercase">
            Conversation history
          </h2>
          <ApiPageState
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={() => refetch()}
            emptyTitle="No conversations"
          >
            <ul className="space-y-2 text-sm">
              {history.map((c, i) => (
                <li key={i} className="rounded-lg border border-black/10 px-3 py-2">
                  {readString(c, "title") || readString(c, "id").slice(0, 8) || "Conversation"}
                </li>
              ))}
            </ul>
          </ApiPageState>
        </aside>
      </div>
    </div>
  );
}
