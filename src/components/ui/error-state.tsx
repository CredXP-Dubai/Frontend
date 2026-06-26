import { ApiError } from "@/lib/api/client";
import { getHttpErrorMessage } from "@/lib/errors/http-error";
import { cn } from "@/lib/utils/cn";

export function ErrorState({
  error,
  onRetry,
  title = "Unable to load data",
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  title?: string;
  className?: string;
}) {
  const message = getHttpErrorMessage(error);
  const correlationId =
    error instanceof ApiError ? error.correlationId : undefined;

  return (
    <div
      className={cn(
        "rounded-xl border border-[#C8102E]/20 bg-red-50/50 px-6 py-10 text-center",
        className,
      )}
      role="alert"
    >
      <p className="font-medium text-black">{title}</p>
      <p className="mt-2 text-sm text-black/60">{message}</p>
      {correlationId && (
        <p className="mt-1 text-xs text-black/40">Reference: {correlationId}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-[#C8102E] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9b0c24]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
