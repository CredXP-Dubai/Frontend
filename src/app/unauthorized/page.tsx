"use client";

import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

export default function UnauthorizedPage() {
  const { permissions } = usePermissions();

  const primaryHref = permissions.canAccessWorkspace
    ? "/workspace"
    : permissions.canAccessInvestorPortal
      ? "/dashboard"
      : "/";

  const primaryLabel = permissions.canAccessWorkspace
    ? "Go to workspace"
    : permissions.canAccessInvestorPortal
      ? "Go to portal"
      : "Back to home";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F7] px-4">
      <div className="max-w-md rounded-xl border border-black/10 bg-white p-8 text-center">
        <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-[#C8102E] uppercase">
          Access Denied
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-black">
          Unauthorized
        </h1>
        <p className="mt-3 text-sm text-black/55">
          You do not have permission to access this resource. Contact your administrator if you
          believe this is an error.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={primaryHref}
            className="rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#9b0c24]"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black hover:bg-black/5"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
