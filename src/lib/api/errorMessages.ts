import type { ApiErrorBody, ApiErrorDetails } from "@/types/api";

export function formatApiErrorMessage(body: ApiErrorBody): string {
  const { message, code, details } = body.error;
  const parts: string[] = [message];

  if (details?.formErrors?.length) {
    parts.push(...details.formErrors);
  }

  if (details?.fieldErrors) {
    for (const [field, errors] of Object.entries(details.fieldErrors)) {
      for (const fieldMessage of errors) {
        parts.push(`${field}: ${fieldMessage}`);
      }
    }
  }

  if (code === "UNAUTHORIZED" && message === "Invalid credentials") {
    parts.push(
      "Login requires an ACTIVE account with a verified email address (per backend API).",
    );
  }

  return parts.join(" · ");
}

export function getLoginHintForCode(code: string, message: string): string | null {
  if (code === "UNAUTHORIZED" && message === "Invalid credentials") {
    return "Check your email and password. If you recently registered, verify your email before signing in.";
  }
  if (code === "VALIDATION_ERROR") {
    return "Please correct the highlighted fields and try again.";
  }
  if (code === "FORBIDDEN") {
    return "Your account may be suspended or not permitted to sign in.";
  }
  return null;
}

export type { ApiErrorDetails };
