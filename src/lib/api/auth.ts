import { apiClient, ApiError } from "./client";
import { createUser } from "./users";
import type {
  AuthTokenResponse,
  CreateUserRequest,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
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
  register: "/api/v1/users",
  forgotPassword: "/api/v1/auth/forgot-password",
  resetPassword: "/api/v1/auth/reset-password",
  verifyEmail: "/api/v1/auth/verify-email",
} as const;

function unsupportedAuthFeature(feature: string, path: string): ApiError {
  return new ApiError(
    `${feature} is not available on the current backend API. Expected route: ${path}`,
    404,
    "NOT_FOUND",
  );
}

export async function login(payload: LoginRequest): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>(
    `${AUTH_BASE}/login`,
    payload,
  );
  return data;
}

export async function register(payload: RegisterFormValues): Promise<User> {
  const [firstName, ...rest] = payload.name.trim().split(/\s+/);
  const request: CreateUserRequest = {
    email: payload.email.trim(),
    password: payload.password,
    firstName,
    lastName: rest.join(" ") || undefined,
  };

  return createUser(request);
}

export async function refreshToken(
  payload: RefreshTokenRequest,
): Promise<AuthTokenResponse> {
  const { data } = await apiClient.post<AuthTokenResponse>(
    `${AUTH_BASE}/refresh`,
    payload,
  );
  return data;
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
  registerViaUsersApi: true,
  forgotPassword: false,
  resetPassword: false,
  verifyEmail: false,
  paths: AUTH_CAPABILITY_PATHS,
} as const;
