/**
 * TypeScript interfaces derived from CredXP Dubai API OpenAPI v0.3.0
 * (discovered via GET https://backend-cumg.onrender.com/docs/swagger-ui-init.js)
 */

// ─── Error envelope ───────────────────────────────────────────────────────────

export interface ApiErrorDetails {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    correlationId?: string;
    details?: ApiErrorDetails;
  };
}

// ─── Health (GET /health) ─────────────────────────────────────────────────────

export type HealthStatus = "ok" | "degraded";
export type PostgresStatus = "connected" | "disconnected";
export type RedisStatus = "connected" | "disconnected" | "disabled";

export interface HealthResponse {
  status: HealthStatus;
  postgres: PostgresStatus;
  redis: RedisStatus;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "LOCKED" | "PENDING";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
  roleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ─── Users (GET /api/v1/users) ──────────────────────────────────────────────────

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
  roleId?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

// ─── Properties / Developers / Projects ─────────────────────────────────────────
// NOTE: These endpoints are NOT deployed on backend v0.3.0 (verified 404).
// Types are defined for forward compatibility when the backend adds them.

export interface Property {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  currency?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  status?: string;
  featured?: boolean;
  developerId?: string;
  projectId?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyListParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  location?: string;
  developerId?: string;
  projectId?: string;
  featured?: boolean;
}

export interface Developer {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  projectCount?: number;
  createdAt?: string;
}

export interface DeveloperListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Project {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  developerId?: string;
  location?: string;
  status?: string;
  completionDate?: string;
  images?: string[];
  propertyCount?: number;
  createdAt?: string;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  developerId?: string;
  status?: string;
}
