import { cn } from "@/lib/utils/cn";

export function StatsCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-black/10 bg-white p-5", className)}>
      <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-black/45 uppercase">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#C8102E]">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-black/45">{hint}</p>}
    </div>
  );
}
