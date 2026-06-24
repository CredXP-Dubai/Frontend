"use client";

import { ApiError } from "@/lib/api/client";

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
  if (isLoading) {
    return (
      <div className="api-state api-state--loading" role="status">
        <div className="api-state__spinner" aria-hidden="true" />
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    const apiError = error instanceof ApiError ? error : null;
    const isNotFound = apiError?.isNotFound;

    return (
      <div className="api-state api-state--error" role="alert">
        <p className="api-state__title">
          {isNotFound ? "API not available" : "Something went wrong"}
        </p>
        <p className="api-state__message">
          {apiError?.message ?? "Unable to load data from the server."}
        </p>
        {isNotFound && (
          <p className="api-state__hint">
            This endpoint is not yet deployed on the backend (v0.3.0). Listings
            will appear here once the API is live.
          </p>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="api-state api-state--empty">
        <p className="api-state__title">{emptyTitle}</p>
        <p className="api-state__message">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
