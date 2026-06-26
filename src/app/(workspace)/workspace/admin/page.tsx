"use client";

import { useAdminStatistics, useAdminHealth } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/ui/stats-card";
import { ApiPageState } from "@/components/ui/api-page-state";
import { asRecord, readString } from "@/utils/record";

export default function AdminPage() {
  const stats = useAdminStatistics();
  const health = useAdminHealth();
  const statsRecord = asRecord(stats.data);
  const healthRecord = asRecord(health.data);

  return (
    <div>
      <PageHeader
        title="Administration"
        description="Platform statistics and health from /api/v1/admin/*"
      />
      <ApiPageState
        isLoading={stats.isLoading}
        isError={stats.isError}
        error={stats.error}
        onRetry={() => stats.refetch()}
        emptyTitle="No statistics"
      >
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(statsRecord).slice(0, 4).map(([key, value]) => (
            <StatsCard key={key} label={key} value={String(value)} />
          ))}
          {Object.keys(statsRecord).length === 0 && (
            <StatsCard label="Statistics" value="—" hint="Awaiting admin statistics payload" />
          )}
        </div>
      </ApiPageState>

      <ApiPageState
        isLoading={health.isLoading}
        isError={health.isError}
        error={health.error}
        onRetry={() => health.refetch()}
        emptyTitle="Health unavailable"
      >
        <div className="rounded-xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 font-medium text-black">System health</h2>
          <p className="text-sm text-black/65">
            Status: {readString(healthRecord, "status") || "—"}
          </p>
        </div>
      </ApiPageState>
    </div>
  );
}
