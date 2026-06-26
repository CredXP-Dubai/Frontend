import { PermissionGuard, WorkspaceGuard } from "@/components/auth/PermissionGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGuard>
      <WorkspaceGuard>
        <DashboardShell>{children}</DashboardShell>
      </WorkspaceGuard>
    </PermissionGuard>
  );
}
