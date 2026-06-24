"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      const query = searchParams.toString();
      const redirectTarget = query ? `${pathname}?${query}` : pathname;
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [isAuthenticated, loading, pathname, router, searchParams]);

  if (loading) {
    return (
      <div className="auth-loading" aria-live="polite" aria-busy="true">
        <div className="auth-loading__spinner" />
        <p>Restoring your session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-loading" aria-live="polite" aria-busy="true">
        <div className="auth-loading__spinner" />
        <p>Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
