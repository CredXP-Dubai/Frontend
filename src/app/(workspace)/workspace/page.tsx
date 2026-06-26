"use client";

import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";
import { useAdminStatistics } from "@/hooks/useAdmin";
import { useLeads } from "@/hooks/useCrm";
import { useProposals } from "@/hooks/useProposals";
import { StatsCard } from "@/components/ui/stats-card";
import { asRecord, readCursorList, readString } from "@/utils/record";

export default function WorkspaceOverviewPage() {
  const { permissions } = usePermissions();
  const { data: stats } = useAdminStatistics(permissions.canAccessAdmin);
  const { data: leads } = useLeads({ limit: 1 });
  const { data: proposals } = useProposals({ limit: 1 });

  const leadCount = leads ? readCursorList(leads).items.length : 0;
  const proposalCount = proposals ? readCursorList(proposals).items.length : 0;
  const statsRecord = asRecord(stats);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-black">Overview</h1>
        <p className="mt-2 text-sm text-black/55">
          {permissions.roleLabel
            ? `Signed in as ${permissions.roleLabel}`
            : "Platform workspace for admin and sales operations."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {permissions.canManageUsers && (
          <StatsCard label="User management" value="Live" hint="GET /api/v1/users" />
        )}
        {permissions.canReadCatalog && (
          <StatsCard label="Catalog" value="Read-only" hint="Developers, projects, properties" />
        )}
        {permissions.canAccessCrm && (
          <StatsCard label="Leads (page)" value={String(leadCount)} hint="CRM pipeline" />
        )}
        {permissions.canAccessProposals && (
          <StatsCard label="Proposals (page)" value={String(proposalCount)} hint="Proposal engine" />
        )}
        {permissions.canAccessAdmin && (
          <StatsCard
            label="Platform users"
            value={readString(statsRecord, "users") || readString(statsRecord, "totalUsers") || "—"}
            hint="Admin statistics"
          />
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {permissions.canManageUsers && (
          <Link href="/workspace/users" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">Users</h2>
            <p className="mt-2 text-sm text-black/55">Invite, edit status, and manage accounts.</p>
          </Link>
        )}
        {permissions.canAccessCrm && (
          <Link href="/workspace/crm/leads" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">CRM Leads</h2>
            <p className="mt-2 text-sm text-black/55">Pipeline, assignment, notes, and interests.</p>
          </Link>
        )}
        {permissions.canAccessProposals && (
          <Link href="/workspace/proposals" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">Proposals</h2>
            <p className="mt-2 text-sm text-black/55">Create, share, and download PDF proposals.</p>
          </Link>
        )}
        {permissions.canAccessBrokers && (
          <Link href="/workspace/broker" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">Broker Portal</h2>
            <p className="mt-2 text-sm text-black/55">Profile, documents, leads, commissions.</p>
          </Link>
        )}
        {permissions.canAccessAutomation && (
          <Link href="/workspace/automation" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">Automation</h2>
            <p className="mt-2 text-sm text-black/55">WhatsApp and email campaigns.</p>
          </Link>
        )}
        {permissions.canAccessAi && (
          <Link href="/workspace/ai" className="rounded-xl border border-black/10 bg-white p-6 hover:shadow-md">
            <h2 className="font-medium text-black">AI Assistant</h2>
            <p className="mt-2 text-sm text-black/55">Chat, drafts, and lead summaries.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
