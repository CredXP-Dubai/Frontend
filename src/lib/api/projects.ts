/**
 * Projects API
 *
 * Endpoint status (verified 2026-06-24 against backend v0.3.0):
 *   GET /api/v1/projects → 404 NOT_FOUND (not yet deployed)
 */
import { apiClient } from "./client";
import type {
  PaginatedResponse,
  Project,
  ProjectListParams,
} from "@/types/api";

const PROJECTS_BASE = "/api/v1/projects";

export async function listProjects(
  params?: ProjectListParams,
): Promise<PaginatedResponse<Project>> {
  const { data } = await apiClient.get<PaginatedResponse<Project>>(
    PROJECTS_BASE,
    { params },
  );
  return data;
}

export async function getProject(id: string): Promise<Project> {
  const { data } = await apiClient.get<Project>(`${PROJECTS_BASE}/${id}`);
  return data;
}
