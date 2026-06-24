/**
 * Properties API
 *
 * Endpoint status (verified 2026-06-24 against backend v0.3.0):
 *   GET /api/v1/properties → 404 NOT_FOUND (not yet deployed)
 *
 * Functions are wired for when the backend ships property routes.
 */
import { apiClient } from "./client";
import type { PaginatedResponse, Property, PropertyListParams } from "@/types/api";

const PROPERTIES_BASE = "/api/v1/properties";

export async function listProperties(
  params?: PropertyListParams,
): Promise<PaginatedResponse<Property>> {
  const { data } = await apiClient.get<PaginatedResponse<Property>>(
    PROPERTIES_BASE,
    { params },
  );
  return data;
}

export async function getProperty(id: string): Promise<Property> {
  const { data } = await apiClient.get<Property>(`${PROPERTIES_BASE}/${id}`);
  return data;
}

export async function getFeaturedProperties(
  limit = 6,
): Promise<PaginatedResponse<Property>> {
  return listProperties({ featured: true, limit, page: 1 });
}
