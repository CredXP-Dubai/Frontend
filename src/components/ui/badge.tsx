import { cn } from "@/lib/utils/cn";

const variants = {
  default: "bg-black/5 text-black/70",
  outline: "border border-black/15 bg-white text-black/70",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-[#C8102E]",
  brand: "bg-[#C8102E]/10 text-[#C8102E]",
} as const;

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const variant =
    normalized === "ACTIVE"
      ? "success"
      : normalized === "PENDING"
        ? "warning"
        : normalized === "SUSPENDED" || normalized === "LOCKED"
          ? "danger"
          : "default";
  return <Badge variant={variant}>{status}</Badge>;
}
