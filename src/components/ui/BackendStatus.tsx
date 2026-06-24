"use client";

import { useHealth } from "@/hooks/useHealth";

export function BackendStatus() {
  const { data, isLoading, isError } = useHealth();

  if (isLoading) {
    return (
      <p className="backend-status backend-status--loading" role="status">
        Connecting to API…
      </p>
    );
  }

  if (isError || !data) {
    return (
      <p className="backend-status backend-status--error" role="status">
        API offline
      </p>
    );
  }

  return (
    <p className="backend-status backend-status--ok" role="status">
      API connected · PostgreSQL {data.postgres}
    </p>
  );
}
