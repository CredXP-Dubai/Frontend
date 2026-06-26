"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function CrmCustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Customer management module"
      />
      <EmptyState
        title="Customers API not available"
        message="GET /api/v1/crm/customers is not in OpenAPI v1.1.0. Use CRM Leads until the backend deploys a customers endpoint."
      />
    </div>
  );
}
