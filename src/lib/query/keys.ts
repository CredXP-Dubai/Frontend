export const queryKeys = {
  health: ["health"] as const,
  properties: {
    all: ["properties"] as const,
    list: (params?: Record<string, unknown>) =>
      ["properties", "list", params] as const,
    detail: (id: string) => ["properties", "detail", id] as const,
    featured: () => ["properties", "featured"] as const,
  },
  developers: {
    all: ["developers"] as const,
    list: (params?: Record<string, unknown>) =>
      ["developers", "list", params] as const,
    detail: (id: string) => ["developers", "detail", id] as const,
  },
  projects: {
    all: ["projects"] as const,
    list: (params?: Record<string, unknown>) =>
      ["projects", "list", params] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    list: (params?: Record<string, unknown>) =>
      ["users", "list", params] as const,
  },
} as const;
