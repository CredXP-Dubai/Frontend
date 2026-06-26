import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  message,
  action,
  className,
}: {
  title: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-black/15 bg-[#F7F7F7] px-6 py-16 text-center",
        className,
      )}
    >
      <p className="font-[family-name:var(--font-display)] text-xl text-black">{title}</p>
      {message && <p className="mt-2 max-w-md text-sm text-black/55">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
