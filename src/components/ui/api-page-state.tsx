"use client";

import { ApiError } from "@/lib/api/client";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { TableSkeleton } from "@/components/ui/skeleton";

export function ApiPageState({
  isLoading,
  isError,
  error,
  isEmpty,
  onRetry,
  emptyTitle,
  emptyMessage,
  moduleName,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyTitle: string;
  emptyMessage?: string;
  moduleName?: string;
  children: React.ReactNode;
}) {
  if (isLoading) return <TableSkeleton rows={6} />;

  if (isError) {
    const unavailable = error instanceof ApiError && error.isNotFound;

    if (unavailable) {
      return (
        <EmptyState
          title={`${moduleName ?? "Module"} API not available`}
          message="This endpoint returned 404. See BACKEND_GAPS_PHASE2.md for required backend changes."
        />
      );
    }

    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return <>{children}</>;
}
