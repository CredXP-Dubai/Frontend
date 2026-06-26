import { asRecord, readString } from "@/utils/record";
import { resolveUserRole } from "@/lib/auth/jwt";
import type { PermissionCode } from "@/types/dashboard";

export function extractPermissions(user: unknown): PermissionCode[] {
  const record = asRecord(user);
  const raw = record.permissions;

  if (Array.isArray(raw)) {
    return raw.map((p) => String(p)).filter(Boolean);
  }

  if (raw && typeof raw === "object") {
    return Object.entries(asRecord(raw))
      .filter(([, enabled]) => Boolean(enabled))
      .map(([key]) => key);
  }

  return [];
}

export function hasPermission(
  permissions: PermissionCode[],
  code: string,
): boolean {
  if (permissions.includes("*") || permissions.includes("admin:*")) return true;
  return permissions.some(
    (p) => p === code || p.endsWith(`:${code.split(":").pop()}`) || p.startsWith(`${code}:`),
  );
}

export function hasAnyPermission(
  permissions: PermissionCode[],
  codes: string[],
): boolean {
  return codes.some((code) => hasPermission(permissions, code));
}

export function resolveRoleLabel(user: unknown, accessToken?: string | null): string | null {
  const record = asRecord(user);
  const roleObj = asRecord(record.role);
  return (
    readString(roleObj, "name") ||
    readString(roleObj, "code") ||
    resolveUserRole(user, accessToken)
  );
}

/** Map backend permission codes to workspace capabilities */
export function permissionsToCapabilities(permissions: PermissionCode[], role: string | null) {
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const can = (code: string) => isAdmin || hasPermission(permissions, code);

  return {
    canManageUsers: can("users:read") || can("users:manage") || can("users:create"),
    canAccessCrm: can("crm:read") || can("crm:create"),
    canManageCrm: can("crm:update") || can("crm:create") || can("crm:assign"),
    canAccessProposals: can("proposal:read") || can("proposal:create"),
    canManageProposals: can("proposal:create") || can("proposal:update"),
    canAccessBrokers: can("broker:read") || can("broker:manage"),
    canApproveBrokers: can("broker:approve") || isAdmin,
    canAccessAutomation: can("automation:read") || can("email:read"),
    canAccessAi: can("ai:read") || can("ai:chat"),
    canAccessAdmin: can("admin:read") || isAdmin,
    canReadCatalog: can("catalog:read") || isAdmin,
  };
}
