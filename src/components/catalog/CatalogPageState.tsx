"use client";

import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { CardGridSkeleton } from "@/components/catalog/CardGridSkeleton";

interface CatalogPageStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty?: boolean;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  skeletonCount?: number;
  children: React.ReactNode;
}

export function CatalogPageState({
  isLoading,
  isError,
  error,
  isEmpty = false,
  onRetry,
  emptyTitle = "No results found",
  emptyMessage = "Try adjusting your filters.",
  skeletonCount = 6,
  children,
}: CatalogPageStateProps) {
  if (isLoading) return <CardGridSkeleton count={skeletonCount} />;

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return <>{children}</>;
}
