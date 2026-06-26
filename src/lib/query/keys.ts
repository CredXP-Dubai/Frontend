export const queryKeys = {
  health: ["health"] as const,
  properties: {
    all: ["properties"] as const,
    list: (params?: Record<string, unknown>) =>
      ["properties", "list", params] as const,
    detail: (slug: string) => ["properties", "detail", slug] as const,
    featured: (limit?: number) => ["properties", "featured", limit] as const,
  },
  developers: {
    all: ["developers"] as const,
    list: (params?: Record<string, unknown>) =>
      ["developers", "list", params] as const,
    detail: (slug: string) => ["developers", "detail", slug] as const,
    featured: (limit?: number) => ["developers", "featured", limit] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (params?: Record<string, unknown>) =>
      ["projects", "list", params] as const,
    detail: (slug: string) => ["projects", "detail", slug] as const,
    featured: (limit?: number) => ["projects", "featured", limit] as const,
  },
  search: {
    global: (query: Record<string, unknown>) => ["search", "global", query] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  proposals: {
    all: ["proposals"] as const,
    list: (params?: Record<string, unknown>) =>
      ["proposals", "list", params] as const,
    detail: (id: string) => ["proposals", "detail", id] as const,
    activity: (id: string) => ["proposals", "activity", id] as const,
    public: (token: string) => ["proposals", "public", token] as const,
  },
  crm: {
    all: ["crm"] as const,
    leads: (params?: Record<string, unknown>) => ["crm", "leads", params] as const,
    lead: (id: string) => ["crm", "lead", id] as const,
  },
  brokers: {
    profile: ["brokers", "profile"] as const,
    leads: (params?: Record<string, unknown>) => ["brokers", "leads", params] as const,
    commissions: (params?: Record<string, unknown>) =>
      ["brokers", "commissions", params] as const,
  },
  admin: {
    roles: ["admin", "roles"] as const,
    matrix: ["admin", "permissions-matrix"] as const,
    statistics: ["admin", "statistics"] as const,
    health: ["admin", "health"] as const,
    auditLogs: (params?: Record<string, unknown>) => ["admin", "audit-logs", params] as const,
  },
  automation: {
    templates: (params?: Record<string, unknown>) =>
      ["automation", "templates", params] as const,
    conversations: (params?: Record<string, unknown>) =>
      ["automation", "conversations", params] as const,
    campaigns: (params?: Record<string, unknown>) =>
      ["automation", "campaigns", params] as const,
    rules: (params?: Record<string, unknown>) => ["automation", "rules", params] as const,
  },
  email: {
    templates: (params?: Record<string, unknown>) => ["email", "templates", params] as const,
    campaigns: (params?: Record<string, unknown>) => ["email", "campaigns", params] as const,
    statistics: (params?: Record<string, unknown>) => ["email", "statistics", params] as const,
  },
  ai: {
    conversations: (params?: Record<string, unknown>) => ["ai", "conversations", params] as const,
    conversation: (id: string) => ["ai", "conversation", id] as const,
  },
} as const;
