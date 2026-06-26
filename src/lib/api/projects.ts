/**
 * Projects API — CredXP Dubai v1.0.0
 */
import { apiClient } from "./client";
import type {
  CursorPaginatedResponse,
  ProjectDetail,
  ProjectListItem,
  ProjectListParams,
} from "@/types/catalog";

const PROJECTS_BASE = "/api/v1/projects";

export async function listProjects(
  params?: ProjectListParams,
): Promise<CursorPaginatedResponse<ProjectListItem>> {
  const { data } = await apiClient.get<CursorPaginatedResponse<ProjectListItem>>(
    PROJECTS_BASE,
    { params },
  );
  return data;
}

export async function listFeaturedProjects(
  limit = 6,
): Promise<{ data: ProjectListItem[] }> {
  const { data } = await apiClient.get<{ data: ProjectListItem[] }>(
    `${PROJECTS_BASE}/featured`,
    { params: { limit } },
  );
  return data;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetail>(`${PROJECTS_BASE}/${slug}`);
  return data;
}
