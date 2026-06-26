export const STAFF_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "SALES_MANAGER",
  "SALES_AGENT",
] as const;

export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;

export const INVESTOR_ROLES = ["AFFILIATE_BROKER", "BROKER", "INVESTOR"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];
