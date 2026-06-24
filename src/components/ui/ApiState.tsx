"use client";

import { ApiError } from "@/lib/api/client";
import { theme } from "@/styles/theme";

interface ApiStateProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isEmpty?: boolean;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

export function ApiState({
  isLoading,
  isError,
  error,
  isEmpty = false,
  loadingMessage = "Loading…",
  emptyTitle = "Nothing here yet",
  emptyMessage = "No results found.",
  children,
}: ApiStateProps) {
  const panelClass = `${theme.components.card.base} px-6 py-16 text-center`;

  if (isLoading) {
    return (
      <div className={panelClass} role="status">
        <div
          className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#C8102E]"
          aria-hidden="true"
        />
        <p className="text-sm text-black/55">{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    const apiError = error instanceof ApiError ? error : null;
    const isNotFound = apiError?.isNotFound;

    return (
      <div className={panelClass} role="alert">
        <p className="font-[family-name:var(--font-display)] text-2xl text-black">
          {isNotFound ? "Collection Unavailable" : "Unable to Load"}
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-black/55">
          {apiError?.message ?? "Unable to load data from the server."}
        </p>
        {isNotFound && (
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-[#C8102E]">
            This endpoint is not yet deployed on the backend. Listings will appear here once live.
          </p>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={panelClass}>
        <p className="font-[family-name:var(--font-display)] text-2xl text-black">{emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-black/55">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
