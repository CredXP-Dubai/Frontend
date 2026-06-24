"use client";

import { useHealth } from "@/hooks/useHealth";

export function BackendStatus() {
  const { data, isLoading, isError } = useHealth();

  if (isLoading) return null;
  if (isError || !data) return null;

  return null;
}
