/**
 * Developers API — CredXP Dubai v1.0.0
 */
import { apiClient } from "./client";
import type {
  CursorPaginatedResponse,
  DeveloperDetail,
  DeveloperListItem,
  DeveloperListParams,
} from "@/types/catalog";

const DEVELOPERS_BASE = "/api/v1/developers";

export async function listDevelopers(
  params?: DeveloperListParams,
): Promise<CursorPaginatedResponse<DeveloperListItem>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<DeveloperListItem>>(
    DEVELOPERS_BASE,
    { params },
  );
  return data;
}

export async function listFeaturedDevelopers(
  limit = 8,
): Promise<{ data: DeveloperListItem[] }> {
  const { data } = await apiClient.get<{ data: DeveloperListItem[] }>(
    `${DEVELOPERS_BASE}/featured`,
    { params: { limit } },
  );
  return data;
}

export async function getDeveloperBySlug(slug: string): Promise<DeveloperDetail> {
  const { data } = await apiClient.get<DeveloperDetail>(`${DEVELOPERS_BASE}/${slug}`);
  return data;
}
