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

  if (loading || !isAuthenticated) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-black/10 border-t-[#C8102E]" />
        <p className="text-sm tracking-wide text-black/55">
          {loading ? "Restoring your session…" : "Redirecting to sign in…"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
