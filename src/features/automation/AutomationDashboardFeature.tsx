"use client";

import {
  useAutomationCampaigns,
  useAutomationConversations,
  useAutomationRules,
  useAutomationTemplates,
  useEmailCampaigns,
  useEmailStatistics,
  useEmailTemplates,
} from "@/hooks/useAutomation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { ApiPageState } from "@/components/ui/api-page-state";
import { readCursorList, readString, asRecord } from "@/utils/record";

function CountCard({
  label,
  query,
}: {
  label: string;
  query: { data?: unknown; isLoading: boolean; isError: boolean; error: unknown; refetch: () => void };
}) {
  const { data, isLoading, isError, error, refetch } = query;
  const count = data ? readCursorList(data).items.length : 0;

  return (
    <ApiPageState
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => refetch()}
      emptyTitle={`No ${label.toLowerCase()}`}
    >
      <StatsCard label={label} value={String(count)} />
    </ApiPageState>
  );
}

export function AutomationDashboardFeature() {
  const templates = useAutomationTemplates({ limit: 5 });
  const conversations = useAutomationConversations({ limit: 5 });
  const campaigns = useAutomationCampaigns({ limit: 5 });
  const rules = useAutomationRules({ limit: 5 });
  const emailTemplates = useEmailTemplates({ limit: 5 });
  const emailCampaigns = useEmailCampaigns({ limit: 5 });
  const emailStats = useEmailStatistics();

  const stats = asRecord(emailStats.data);

  return (
    <div>
      <PageHeader
        title="Automation"
        description="WhatsApp automation, email campaigns, templates, and rules"
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CountCard label="WhatsApp Templates" query={templates} />
        <CountCard label="Conversations" query={conversations} />
        <CountCard label="Campaigns" query={campaigns} />
        <CountCard label="Rules" query={rules} />
      </div>

      <h2 className="mb-4 font-medium text-black">Email</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <CountCard label="Email Templates" query={emailTemplates} />
        <CountCard label="Email Campaigns" query={emailCampaigns} />
        <StatsCard
          label="Emails sent"
          value={readString(stats, "sent") || readString(stats, "totalSent") || "—"}
          hint="GET /api/v1/email/statistics"
        />
      </div>

      <p className="text-xs text-black/45">
        Webhook status is available at POST /api/v1/webhooks/whatsapp and /webhooks/sendgrid (server-side).
      </p>
    </div>
  );
}
