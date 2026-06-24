import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiErrorBody } from "@/types/api";
import type { AuthTokenResponse } from "@/types/api";
import { formatApiErrorMessage } from "@/lib/api/errorMessages";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
} from "@/lib/auth/session";

const DEFAULT_TIMEOUT_MS = 30_000;

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "";
  return url.replace(/\/$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly correlationId?: string;
  readonly details?: import("@/types/api").ApiErrorDetails;
  readonly rawBody?: unknown;

  constructor(
    message: string,
    status: number,
    code: string,
    correlationId?: string,
    details?: import("@/types/api").ApiErrorDetails,
    rawBody?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.correlationId = correlationId;
    this.details = details;
    this.rawBody = rawBody;
  }

  get isNotFound(): boolean {
    return this.status === 404 || this.code === "NOT_FOUND";
  }

  get isUnauthorized(): boolean {
    return this.status === 401 || this.code === "UNAUTHORIZED";
  }
}

export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const axErr = error as AxiosError<ApiErrorBody>;
    const status = axErr.response?.status ?? 0;
    const body = axErr.response?.data;

    if (body?.error) {
      return new ApiError(
        formatApiErrorMessage(body),
        status,
        body.error.code,
        body.error.correlationId,
        body.error.details,
        body,
      );
    }

    if (axErr.code === "ECONNABORTED") {
      return new ApiError("Request timed out", 408, "TIMEOUT");
    }

    if (!axErr.response) {
      return new ApiError("Unable to reach the server", 0, "NETWORK_ERROR");
    }

    return new ApiError(
      axErr.message || "An unexpected error occurred",
      status,
      "UNKNOWN",
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, "UNKNOWN");
  }

  return new ApiError("An unexpected error occurred", 0, "UNKNOWN");
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

const PUBLIC_AUTH_PATHS = [
  "/api/v1/auth/login",
  "/api/v1/auth/register",
  "/api/v1/auth/refresh",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/resend-verification",
] as const;

function isPublicAuthRoute(url?: string): boolean {
  if (!url) return false;
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path));
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (isPublicAuthRoute(config.url)) {
    return config;
  }

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await axios.post<AuthTokenResponse>(
    `${getApiBaseUrl()}/api/v1/auth/refresh`,
    { refreshToken },
    {
      timeout: DEFAULT_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  saveAuthSession(response.data);
  return response.data.accessToken;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => attachAuthHeader(config));

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const apiError = parseApiError(error);
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? "";

    const isAuthRoute =
      requestUrl.includes("/api/v1/auth/login") ||
      requestUrl.includes("/api/v1/auth/refresh") ||
      requestUrl.includes("/api/v1/auth/logout");

    if (
      apiError.isUnauthorized &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const nextToken = await refreshPromise;
        if (!nextToken) {
          clearAuthSession();
          return Promise.reject(apiError);
        }

        originalRequest.headers.Authorization = `Bearer ${nextToken}`;
        return apiClient(originalRequest);
      } catch {
        clearAuthSession();
        return Promise.reject(apiError);
      }
    }

    if (apiError.isUnauthorized && !isAuthRoute) {
      clearAuthSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        const redirect = `${window.location.pathname}${window.location.search}`;
        window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`);
      }
    }

    return Promise.reject(apiError);
  },
);

/** GET /health — public, no auth required */
export async function getHealth() {
  const { data } = await apiClient.get<import("@/types/api").HealthResponse>("/health");
  return data;
}
