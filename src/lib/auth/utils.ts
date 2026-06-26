import { ApiError } from "@/lib/api/client";
import { asRecord, readString } from "@/utils/record";

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function getPasswordRequirementsHint(): string {
  return "At least 8 characters with uppercase, lowercase, and a number.";
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

export function getDisplayName(user: unknown): string {
  const r = asRecord(user);
  const firstName = readString(r, "firstName");
  const lastName = readString(r, "lastName");
  const email = readString(r, "email");
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "User";
}

export function getUserInitials(user: unknown): string {
  const displayName = getDisplayName(user);
  const parts = displayName.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return (parts[0]?.slice(0, 2) ?? "CX").toUpperCase();
}
