/**
 * Type helpers derived strictly from openapi.generated.ts.
 * Response entity schemas (User, Role, Property, etc.) are NOT in the OpenAPI spec yet.
 * @see BACKEND_GAPS.md
 */
import type { paths } from "./openapi.generated";

type JsonBody<T> = T extends {
  content: { "application/json": infer B };
}
  ? B
  : never;

type Op200<
  TPath extends keyof paths,
  TMethod extends keyof paths[TPath],
> = paths[TPath][TMethod] extends { responses: { 200: { content: { "application/json": infer B } } } }
  ? B
  : unknown;

export type HealthResponse = Op200<"/health", "get">;

export type LoginRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/login"]["post"]["requestBody"]>
>;

export type AuthTokenResponse = paths["/api/v1/auth/login"]["post"] extends {
  responses: { 200: { content: { "application/json": infer B } } };
}
  ? B
  : never;

export type RegisterRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/register"]["post"]["requestBody"]>
>;

export type RefreshTokenRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/refresh"]["post"]["requestBody"]>
>;

export type LogoutRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/logout"]["post"]["requestBody"]>
>;

export type ForgotPasswordRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/forgot-password"]["post"]["requestBody"]>
>;

export type ResetPasswordRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/reset-password"]["post"]["requestBody"]>
>;

export type VerifyEmailRequest = JsonBody<
  NonNullable<paths["/api/v1/auth/verify-email"]["post"]["requestBody"]>
>;

export type InviteUserRequest = JsonBody<
  NonNullable<paths["/api/v1/users/invite"]["post"]["requestBody"]>
>;

export type UserListParams = NonNullable<
  paths["/api/v1/users"]["get"]["parameters"]["query"]
>;

export type UserStatus = NonNullable<UserListParams["status"]>;

/** Undocumented in OpenAPI — backend must add User schema */
export type AuthMeResponse = unknown;

/** Undocumented in OpenAPI — backend must add paginated User list schema */
export type UserListResponse = unknown;

/** Undocumented in OpenAPI — backend must add User schema */
export type UserDetailResponse = unknown;
