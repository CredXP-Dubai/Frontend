"use client";

import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { canAccessWorkspacePath } from "@/lib/auth/permissions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function PermissionGuard({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-[#C8102E]" />
      </div>
    );
  }

  if (!isAuthenticated) return fallback ?? null;

  return <>{children}</>;
}

/** Blocks workspace routes for users without staff roles (e.g. AFFILIATE_BROKER). */
export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();

  const loading = authLoading || permissionsLoading;

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    if (!permissions.canAccessWorkspace) {
      router.replace("/dashboard");
      return;
    }

    if (!canAccessWorkspacePath(pathname, permissions)) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, loading, pathname, permissions, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/15 border-t-[#C8102E]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!permissions.canAccessWorkspace) return null;

  if (!canAccessWorkspacePath(pathname, permissions)) return null;

  return <>{children}</>;
}
