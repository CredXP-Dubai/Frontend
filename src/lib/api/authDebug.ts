/**
 * Auth API debug logging — enabled when NODE_ENV=development
 * or NEXT_PUBLIC_AUTH_DEBUG=true
 */

export function isAuthDebugEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_AUTH_DEBUG === "true"
  );
}

export function logAuthDebug(label: string, payload: unknown): void {
  if (!isAuthDebugEnabled()) return;
  console.groupCollapsed(`[CredXP Auth] ${label}`);
  console.log(payload);
  console.groupEnd();
}
