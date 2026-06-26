/**
 * Safe field access for API records without OpenAPI entity schemas.
 * @see BACKEND_GAPS.md
 */
export function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function readString(record: Record<string, unknown>, key: string): string {
  const v = record[key];
  return v == null ? "" : String(v);
}

export function readPaginatedList(response: unknown): {
  items: Record<string, unknown>[];
  meta: { page: number; limit: number; total: number; totalPages: number };
} {
  const root = asRecord(response);
  const data = Array.isArray(root.data) ? root.data : Array.isArray(response) ? response : [];
  const meta = asRecord(root.meta);

  return {
    items: data.map((item) => asRecord(item)),
    meta: {
      page: Number(meta.page ?? 1),
      limit: Number(meta.limit ?? data.length),
      total: Number(meta.total ?? data.length),
      totalPages: Number(meta.totalPages ?? 1),
    },
  };
}

export function readCursorList(response: unknown): {
  items: Record<string, unknown>[];
  meta: { limit: number; nextCursor: string | null; hasMore: boolean };
} {
  const root = asRecord(response);
  const data = Array.isArray(root.data) ? root.data : [];
  const meta = asRecord(root.meta);

  return {
    items: data.map((item) => asRecord(item)),
    meta: {
      limit: Number(meta.limit ?? data.length),
      nextCursor: meta.nextCursor ? String(meta.nextCursor) : null,
      hasMore: Boolean(meta.hasMore),
    },
  };
}

export function readArray(value: unknown, key = "data"): Record<string, unknown>[] {
  const root = asRecord(value);
  const data = root[key];
  if (!Array.isArray(data)) return [];
  return data.map((item) => asRecord(item));
}
