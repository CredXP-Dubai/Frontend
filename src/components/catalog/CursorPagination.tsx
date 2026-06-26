"use client";

interface CursorPaginationProps {
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
  itemCount: number;
}

export function CursorPagination({
  hasMore,
  isLoading,
  onLoadMore,
  itemCount,
}: CursorPaginationProps) {
  if (itemCount === 0) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <p className="text-sm text-black/45">
        Showing {itemCount} result{itemCount === 1 ? "" : "s"}
      </p>
      {hasMore && (
        <button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          className="rounded-xl border-2 border-black px-6 py-3 text-sm font-medium tracking-[0.12em] text-black uppercase transition-colors hover:border-[#C8102E] hover:text-[#C8102E] disabled:opacity-50"
        >
          {isLoading ? "Loading…" : "Load More"}
        </button>
      )}
    </div>
  );
}
