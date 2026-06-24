/**
 * Developers API
 *
 * Endpoint status (verified 2026-06-24 against backend v0.3.0):
 *   GET /api/v1/developers → 404 NOT_FOUND (not yet deployed)
 */
import { apiClient } from "./client";
import type {
  Developer,
  DeveloperListParams,
  PaginatedResponse,
} from "@/types/api";

const DEVELOPERS_BASE = "/api/v1/developers";

export async function listDevelopers(
  params?: DeveloperListParams,
): Promise<PaginatedResponse<Developer>> {
  const { data } = await apiClient.get<PaginatedResponse<Developer>>(
    DEVELOPERS_BASE,
    { params },
  );
  return data;
}

export async function getDeveloper(id: string): Promise<Developer> {
  const { data } = await apiClient.get<Developer>(`${DEVELOPERS_BASE}/${id}`);
  return data;
}
