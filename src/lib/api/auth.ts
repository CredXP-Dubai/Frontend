import { apiClient, ApiError } from "./client";
import type {
  AuthTokenResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  User,
} from "@/types/api";
import type {
  ForgotPasswordFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
  VerifyEmailFormValues,
} from "@/types/auth";

const AUTH_BASE = "/api/v1/auth";

const AUTH_CAPABILITY_PATHS = {
  register: "/api/v1/auth/register",
  forgotPassword: "/api/v1/auth/forgot-password",
  resetPassword: "/api/v1/auth/reset-password",
  verifyEmail: "/api/v1/auth/verify-email",
} as const;

function normalizeAuthTokenResponse(data: unknown): AuthTokenResponse {
  if (!data || typeof data !== "object") {
    throw new ApiError("Unexpected authentication response shape", 500, "INVALID_RESPONSE");
  }

  const record = data as Record<string, unknown>;

  const accessToken =
    (record.accessToken as string | undefined) ??
    (record.token as string | undefined) ??
    (record.jwt as string | undefined) ??
    ((record.data as Record<string, unknown> | undefined)?.accessToken as string | undefined) ??
    ((record.data as Record<string, unknown> | undefined)?.token as string | undefined);

  if (!accessToken) {
    throw new ApiError(
      "Authentication response did not include an access token",
      500,
      "INVALID_RESPONSE",
    );
  }

  return {
    accessToken,
    refreshToken:
      (record.refreshToken as string | undefined) ??
      ((record.data as Record<string, unknown> | undefined)?.refreshToken as string | undefined),
    expiresIn: Number(record.expiresIn ?? 900),
    tokenType: String(record.tokenType ?? "Bearer"),
  };
}

function unsupportedAuthFeature(feature: string, path: string): ApiError {
  return new ApiError(
    `${feature} is not available on the current backend API. Expected route: ${path}`,
    404,
    "NOT_FOUND",
  );
}

export async function login(payload: LoginRequest): Promise<AuthTokenResponse> {
  const requestBody = {
    email: payload.email.trim(),
    password: payload.password,
  };

  const { data } = await apiClient.post<AuthTokenResponse>(
    `${AUTH_BASE}/login`,
    requestBody,
  );

  return normalizeAuthTokenResponse(data);
}

export async function register(payload: RegisterFormValues): Promise<void> {
  const [firstName, ...rest] = payload.name.trim().split(/\s+/);
  const request: RegisterRequest = {
    email: payload.email.trim(),
    password: payload.password,
    firstName,
    lastName: rest.join(" ") || firstName,
  };

  await apiClient.post(`${AUTH_BASE}/register`, request);
}

export async function refreshToken(
  payload: RefreshTokenRequest,
): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>(
    `${AUTH_BASE}/refresh`,
    payload,
  );
  return normalizeAuthTokenResponse(data);
}

export async function logout(payload?: LogoutRequest): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout`, payload ?? {});
}

export async function logoutAll(): Promise<void> {
  await apiClient.post(`${AUTH_BASE}/logout-all`);
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>(`${AUTH_BASE}/me`);
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordFormValues,
): Promise<void> {
  try {
    await apiClient.post(`${AUTH_BASE}/forgot-password`, payload);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      throw unsupportedAuthFeature(
        "Forgot password",
        AUTH_CAPABILITY_PATHS.forgotPassword,
      );
    }
    throw error;
  }
}

export async function resetPassword(
  token: string,
  payload: ResetPasswordFormValues,
): Promise<void> {
  try {
    await apiClient.post(`${AUTH_BASE}/reset-password`, {
      token,
      password: payload.password,
    });
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      throw unsupportedAuthFeature(
        "Reset password",
        AUTH_CAPABILITY_PATHS.resetPassword,
      );
    }
    throw error;
  }
}

export async function verifyEmail(payload: VerifyEmailFormValues): Promise<void> {
  try {
    await apiClient.post(`${AUTH_BASE}/verify-email`, payload);
  } catch (error) {
    if (error instanceof ApiError && error.isNotFound) {
      throw unsupportedAuthFeature(
        "Email verification",
        AUTH_CAPABILITY_PATHS.verifyEmail,
      );
    }
    throw error;
  }
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
  paths: AUTH_CAPABILITY_PATHS,
} as const;
