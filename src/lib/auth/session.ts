import type { AuthSession, AuthTokenPayload } from "@/types/auth";

const ACCESS_TOKEN_KEY = "credxp_access_token";
const REFRESH_TOKEN_KEY = "credxp_refresh_token";
const TOKEN_META_KEY = "credxp_token_meta";

interface StoredTokenMeta {
  expiresIn: number;
  tokenType: string;
  expiresAt: number;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function hasStoredSession(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}

export function saveAuthSession(tokens: AuthTokenPayload): AuthSession {
  if (!isBrowser()) {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? null,
      expiresIn: tokens.expiresIn,
      tokenType: tokens.tokenType,
      expiresAt: Date.now() + tokens.expiresIn * 1000,
    };
  }

  const expiresAt = Date.now() + tokens.expiresIn * 1000;
  const meta: StoredTokenMeta = {
    expiresIn: tokens.expiresIn,
    tokenType: tokens.tokenType,
    expiresAt,
  };

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);

  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  localStorage.setItem(TOKEN_META_KEY, JSON.stringify(meta));

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken ?? null,
    expiresIn: tokens.expiresIn,
    tokenType: tokens.tokenType,
    expiresAt,
  };
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_META_KEY);
}

export function getStoredSession(): AuthSession | null {
  const accessToken = getAccessToken();
  if (!accessToken || !isBrowser()) return null;

  const rawMeta = localStorage.getItem(TOKEN_META_KEY);
  if (!rawMeta) {
    return {
      accessToken,
      refreshToken: getRefreshToken(),
      expiresIn: 0,
      tokenType: "Bearer",
      expiresAt: 0,
    };
  }

  try {
    const meta = JSON.parse(rawMeta) as StoredTokenMeta;
    return {
      accessToken,
      refreshToken: getRefreshToken(),
      expiresIn: meta.expiresIn,
      tokenType: meta.tokenType,
      expiresAt: meta.expiresAt,
    };
  } catch {
    return {
      accessToken,
      refreshToken: getRefreshToken(),
      expiresIn: 0,
      tokenType: "Bearer",
      expiresAt: 0,
    };
  }
}

export function isAccessTokenExpired(bufferMs = 30_000): boolean {
  const session = getStoredSession();
  if (!session?.expiresAt) return false;
  return Date.now() >= session.expiresAt - bufferMs;
}
