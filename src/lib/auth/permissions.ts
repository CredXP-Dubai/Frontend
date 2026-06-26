/**
 * Permission resolution — uses permissions[] from /auth/me with JWT/role fallback.
 */
import { getAccessToken } from "@/lib/auth/session";
import { resolveUserRole } from "@/lib/auth/jwt";
import {
  extractPermissions,
  permissionsToCapabilities,
  resolveRoleLabel,
} from "@/lib/auth/rbac";
import { asRecord, readString } from "@/utils/record";
import { STAFF_ROLES, ADMIN_ROLES, INVESTOR_ROLES } from "@/lib/auth/permissions-constants";

export interface UserPermissions {
  role: string | null;
  roleLabel: string | null;
  permissions: string[];
  canAccessInvestorPortal: boolean;
  canAccessWorkspace: boolean;
  canManageUsers: boolean;
  canAccessCrm: boolean;
  canManageCrm: boolean;
  canAccessProposals: boolean;
  canManageProposals: boolean;
  canAccessBrokers: boolean;
  canApproveBrokers: boolean;
  canAccessAutomation: boolean;
  canAccessAi: boolean;
  canAccessAdmin: boolean;
  canReadCatalog: boolean;
}

export interface PermissionContext {
  accessToken?: string | null;
  enrichedUser?: unknown;
  canListUsers?: boolean;
}

function isRole(value: string | null, allowed: readonly string[]): boolean {
  return value !== null && allowed.includes(value);
}

function emptyPermissions(): UserPermissions {
  return {
    role: null,
    roleLabel: null,
    permissions: [],
    canAccessInvestorPortal: false,
    canAccessWorkspace: false,
    canManageUsers: false,
    canAccessCrm: false,
    canManageCrm: false,
    canAccessProposals: false,
    canManageProposals: false,
    canAccessBrokers: false,
    canApproveBrokers: false,
    canAccessAutomation: false,
    canAccessAi: false,
    canAccessAdmin: false,
    canReadCatalog: false,
  };
}

export function getUserPermissions(
  user: unknown | null,
  isAuthenticated: boolean,
  context: PermissionContext = {},
): UserPermissions {
  if (!isAuthenticated || !user) return emptyPermissions();

  const token = context.accessToken ?? getAccessToken();
  const source = context.enrichedUser ?? user;
  const permissions = extractPermissions(source);
  const role = resolveUserRole(source, token);
  const roleLabel = resolveRoleLabel(source, token);
  const caps = permissionsToCapabilities(permissions, role);

  const isAdmin = isRole(role, ADMIN_ROLES);
  const isStaff = isAdmin || isRole(role, STAFF_ROLES);
  const isBroker = isRole(role, INVESTOR_ROLES);

  const canManageUsers =
    caps.canManageUsers || isAdmin || context.canListUsers === true;
  const canAccessCrm = caps.canAccessCrm || (isStaff && !isBroker);
  const canAccessProposals = caps.canAccessProposals || (isStaff && !isBroker);
  const canAccessWorkspace =
    isStaff ||
    caps.canManageUsers ||
    canAccessCrm ||
    canAccessProposals ||
    caps.canAccessBrokers ||
    caps.canAccessAutomation ||
    caps.canAccessAi ||
    caps.canAccessAdmin ||
    context.canListUsers === true;

  const canAccessInvestorPortal =
    isStaff || isBroker || permissions.length > 0 || Boolean(readString(asRecord(user), "id"));

  return {
    role,
    roleLabel,
    permissions,
    canAccessInvestorPortal,
    canAccessWorkspace,
    canManageUsers,
    canAccessCrm,
    canManageCrm: caps.canManageCrm || isAdmin,
    canAccessProposals,
    canManageProposals: caps.canManageProposals || isAdmin,
    canAccessBrokers: caps.canAccessBrokers || isBroker,
    canApproveBrokers: caps.canApproveBrokers || isAdmin,
    canAccessAutomation: caps.canAccessAutomation || isStaff,
    canAccessAi: caps.canAccessAi || isStaff,
    canAccessAdmin: caps.canAccessAdmin || isAdmin,
    canReadCatalog: caps.canReadCatalog || isStaff,
  };
}

export function canAccessWorkspacePath(
  pathname: string,
  permissions: UserPermissions,
): boolean {
  if (!permissions.canAccessWorkspace) return false;
  if (pathname.startsWith("/workspace/users")) return permissions.canManageUsers;
  if (pathname.includes("/workspace/crm")) return permissions.canAccessCrm;
  if (pathname.startsWith("/workspace/proposals")) return permissions.canAccessProposals;
  if (pathname.startsWith("/workspace/broker")) return permissions.canAccessBrokers;
  if (pathname.startsWith("/workspace/automation")) return permissions.canAccessAutomation;
  if (pathname.startsWith("/workspace/ai")) return permissions.canAccessAi;
  if (pathname.startsWith("/workspace/admin")) return permissions.canAccessAdmin;
  if (
    pathname.startsWith("/workspace/developers") ||
    pathname.startsWith("/workspace/projects") ||
    pathname.startsWith("/workspace/properties")
  ) {
    return permissions.canReadCatalog;
  }
  return true;
}

export { resolveUserRole } from "@/lib/auth/jwt";
