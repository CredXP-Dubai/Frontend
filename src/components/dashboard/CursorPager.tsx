"use client";

import { CursorPagination } from "@/components/catalog/CursorPagination";

interface CursorPagerProps {
  hasMore: boolean;
  isLoading?: boolean;
  itemCount: number;
  onLoadMore: () => void;
}

export function CursorPager(props: CursorPagerProps) {
  return <CursorPagination {...props} />;
}
