/**
 * Properties API — CredXP Dubai v1.0.0
 */
import { apiClient } from "./client";
import type {
  CursorPaginatedResponse,
  PropertyDetail,
  PropertyListItem,
  PropertyListParams,
} from "@/types/catalog";

const PROPERTIES_BASE = "/api/v1/properties";

export async function listProperties(
  params?: PropertyListParams,
): Promise<CursorPaginatedResponse<PropertyListItem>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<PropertyListItem>>(
    PROPERTIES_BASE,
    { params },
  );
  return data;
}

export async function listFeaturedProperties(
  limit = 6,
): Promise<{ data: PropertyListItem[] }> {
  const { data } = await apiClient.get<{ data: PropertyListItem[] }>(
    `${PROPERTIES_BASE}/featured`,
    { params: { limit } },
  );
  return data;
}

export async function getPropertyBySlug(slug: string): Promise<PropertyDetail> {
  const { data } = await apiClient.get<PropertyDetail>(`${PROPERTIES_BASE}/${slug}`);
  return data;
}
