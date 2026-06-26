import { asRecord, readString } from "@/utils/record";

/** Decode JWT payload (client-side, for UI permissions only — backend enforces auth). */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    const parsed: unknown = JSON.parse(json);
    return asRecord(parsed);
  } catch {
    return null;
  }
}

function collectRoleCandidates(source: Record<string, unknown>): string[] {
  const roleObject = asRecord(source.role);
  const candidates = [
    readString(source, "role"),
    readString(source, "roleCode"),
    readString(source, "roleName"),
    readString(source, "userType"),
    readString(source, "accountType"),
    readString(roleObject, "code"),
    readString(roleObject, "name"),
    readString(roleObject, "slug"),
    readString(roleObject, "type"),
  ];

  if (Array.isArray(source.roles)) {
    for (const entry of source.roles) {
      if (typeof entry === "string") candidates.push(entry);
      else candidates.push(readString(asRecord(entry), "code"), readString(asRecord(entry), "name"));
    }
  }

  return candidates.filter(Boolean);
}

export function normalizeRole(value: string): string {
  return value.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

/**
 * Resolve role from /auth/me, user detail, or JWT claims.
 * Backend currently returns roleId only on /auth/me — role name may be nested or in JWT.
 */
export function resolveUserRole(
  user: unknown,
  accessToken?: string | null,
): string | null {
  const record = asRecord(user);

  for (const candidate of collectRoleCandidates(record)) {
    return normalizeRole(candidate);
  }

  if (accessToken) {
    const claims = decodeJwtPayload(accessToken);
    if (claims) {
      for (const candidate of collectRoleCandidates(claims)) {
        return normalizeRole(candidate);
      }
    }
  }

  return null;
}
