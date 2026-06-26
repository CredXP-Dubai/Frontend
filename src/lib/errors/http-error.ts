import axios, { type AxiosError } from "axios";
import type { ApiErrorBody, ApiErrorDetails } from "@/types/api";
import { formatApiErrorMessage } from "@/lib/api/errorMessages";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly correlationId?: string;
  readonly details?: ApiErrorDetails;
  readonly rawBody?: unknown;

  constructor(
    message: string,
    status: number,
    code: string,
    correlationId?: string,
    details?: ApiErrorDetails,
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

  get isForbidden(): boolean {
    return this.status === 403 || this.code === "FORBIDDEN";
  }

  get isConflict(): boolean {
    return this.status === 409 || this.code === "CONFLICT";
  }

  get isRateLimited(): boolean {
    return this.status === 429 || this.code === "RATE_LIMITED";
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isValidationError(): boolean {
    return this.status === 400 || this.code === "VALIDATION_ERROR";
  }

  get userMessage(): string {
    return this.message;
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
      return new ApiError("Request timed out. Please try again.", 408, "TIMEOUT");
    }

    if (!axErr.response) {
      return new ApiError("Unable to reach the server. Check your connection.", 0, "NETWORK_ERROR");
    }

    const fallbackByStatus: Record<number, string> = {
      400: "Invalid request. Please check your input.",
      401: "Your session has expired. Please sign in again.",
      403: "You do not have permission to perform this action.",
      404: "The requested resource was not found.",
      409: "This action conflicts with existing data.",
      429: "Too many requests. Please wait and try again.",
      500: "Server error. Please try again later.",
    };

    return new ApiError(
      fallbackByStatus[status] ?? "An unexpected error occurred.",
      status,
      status === 403 ? "FORBIDDEN" : "UNKNOWN",
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, "UNKNOWN");
  }

  return new ApiError("An unexpected error occurred.", 0, "UNKNOWN");
}

export function getHttpErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.userMessage;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
