import { apiClient } from "./client";
import type {
  AuthMeResponse,
  AuthTokenResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "@/types/openapi-helpers";
import type { RegisterFormValues, ResetPasswordFormValues } from "@/types/auth";
import { ApiError } from "@/lib/errors/http-error";

const AUTH_BASE = "/api/v1/auth";

function normalizeAuthTokenResponse(data: unknown): AuthTokenResponse {
  if (!data || typeof data !== "object") {
    throw new ApiError("Unexpected authentication response.", 500, "INVALID_RESPONSE");
  }
  const record = data as Record<string, unknown>;
  const accessToken =
    (record.accessToken as string | undefined) ??
    (record.token as string | undefined);

  if (!accessToken) {
    throw new ApiError("Authentication response missing access token.", 500, "INVALID_RESPONSE");
  }

  return {
    accessToken,
    refreshToken: record.refreshToken as string | undefined,
    expiresIn: Number(record.expiresIn ?? 900),
    tokenType: String(record.tokenType ?? "Bearer"),
  };
}

export async function login(payload: LoginRequest): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post(`${AUTH_BASE}/login`, {
    email: payload.email.trim(),
    password: payload.password,
  });
  return normalizeAuthTokenResponse(data);
}

export async function register(payload: RegisterFormValues): Promise<void> {
  const [firstName, ...rest] = payload.name.trim().split(/\s+/);
  const body: RegisterRequest = {
    email: payload.email.trim(),
    password: payload.password,
    firstName,
    lastName: rest.join(" ") || firstName,
  };
  await apiClient.post(`${AUTH_BASE}/register`, body);
}

export async function refreshToken(payload: RefreshTokenRequest): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post(`${AUTH_BASE}/refresh`, payload);
  return normalizeAuthTokenResponse(data);
}

export async function logout(payload?: LogoutRequest): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout`, payload ?? {});
}

export async function logoutAll(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout-all`);
}

export async function getCurrentUser(): Promise<AuthMeResponse> {
  const { data } = await apiClient.get<AuthMeResponse>(`${AUTH_BASE}/me`);
  return data;
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/forgot-password`, payload);
}

export async function resetPassword(
  token: string,
  payload: ResetPasswordFormValues,
): Promise<void> {
  const body: ResetPasswordRequest = { token, password: payload.password };
  await apiClient.post(`${AUTH_BASE}/reset-password`, body);
}

export async function verifyEmail(payload: VerifyEmailRequest): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/verify-email`, payload);
}

export async function resendVerification(email: string): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/resend-verification`, { email });
}

export async function acceptInvitation(token: string, password: string): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/accept-invitation`, { token, password });
}

export const authCapabilities = {
  login: true,
  logout: true,
  refresh: true,
  currentUser: true,
  registerViaAuthApi: true,
  forgotPassword: true,
  resetPassword: true,
  verifyEmail: true,
  resendVerification: true,
  acceptInvitation: true,
} as const;
