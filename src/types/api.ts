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

// ─── Catalog (developers, projects, properties) — API v1.0.0 ────────────────

export type {
  CodeNameRef,
  CurrencyRef,
  DeveloperRef,
  ProjectRef,
  StatusRef,
  MediaItem,
  LocationRef,
  PaymentPlan,
  CursorPaginatedMeta,
  CursorPaginatedResponse,
  DeveloperListItem,
  DeveloperDetail,
  DeveloperListParams,
  ProjectListItem,
  ProjectDetail,
  ProjectListParams,
  PropertyListItem,
  PropertyDetail,
  PropertyListParams,
  PropertySort,
} from "./catalog";

/** @deprecated Use PropertyListItem */
export type Property = import("./catalog").PropertyListItem;

/** @deprecated Use DeveloperListItem */
export type Developer = import("./catalog").DeveloperListItem;

/** @deprecated Use ProjectListItem */
export type Project = import("./catalog").ProjectListItem;
