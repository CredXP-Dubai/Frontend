"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  forgotPassword,
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  resetPassword,
  verifyEmail,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  clearAuthSession,
  getRefreshToken,
  hasStoredSession,
  isAccessTokenExpired,
  saveAuthSession,
} from "@/lib/auth/session";
import { isStrongPassword, isValidEmail, passwordsMatch } from "@/lib/auth/utils";
import { queryKeys } from "@/lib/query/keys";
import type { User } from "@/types/api";
import type {
  AuthContextValue,
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
  VerifyEmailFormValues,
} from "@/types/auth";
import { refreshToken } from "@/lib/api/auth";

const AuthContext = createContext<AuthContextValue | null>(null);

async function restoreSession(): Promise<User | null> {
  if (!hasStoredSession()) return null;

  if (isAccessTokenExpired() && getRefreshToken()) {
    const refreshed = await refreshToken({ refreshToken: getRefreshToken()! });
    saveAuthSession(refreshed);
  }

  return getCurrentUser();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!hasStoredSession()) {
      setCurrentUser(null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      return null;
    }

    try {
      const user = await restoreSession();
      setCurrentUser(user);
      queryClient.setQueryData(queryKeys.auth.me, user);
      return user;
    } catch (error) {
      clearAuthSession();
      setCurrentUser(null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      throw error;
    }
  }, [queryClient]);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        if (!hasStoredSession()) {
          if (active) setCurrentUser(null);
          return;
        }

        const user = await restoreSession();
        if (active) {
          setCurrentUser(user);
          queryClient.setQueryData(queryKeys.auth.me, user);
        }
      } catch {
        clearAuthSession();
        if (active) setCurrentUser(null);
      } finally {
        if (active) setIsInitializing(false);
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, [queryClient]);

  const login = useCallback(
    async (payload: LoginFormValues) => {
      if (!isValidEmail(payload.email)) {
        throw new ApiError("Enter a valid email address", 400, "VALIDATION_ERROR");
      }
      if (payload.password.length < 8) {
        throw new ApiError("Password must be at least 8 characters", 400, "VALIDATION_ERROR");
      }

      const tokens = await loginRequest(payload);
      saveAuthSession(tokens);
      const user = await getCurrentUser();
      setCurrentUser(user);
      queryClient.setQueryData(queryKeys.auth.me, user);
      toast.success("Welcome back");
    },
    [queryClient],
  );

  const register = useCallback(async (payload: RegisterFormValues) => {
    if (!payload.name.trim()) {
      throw new ApiError("Name is required", 400, "VALIDATION_ERROR");
    }
    if (!isValidEmail(payload.email)) {
      throw new ApiError("Enter a valid email address", 400, "VALIDATION_ERROR");
    }
    if (!isStrongPassword(payload.password)) {
      throw new ApiError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number",
        400,
        "VALIDATION_ERROR",
      );
    }
    if (!passwordsMatch(payload.password, payload.confirmPassword)) {
      throw new ApiError("Passwords do not match", 400, "VALIDATION_ERROR");
    }

    await registerRequest(payload);
    toast.success("Account created. Please sign in.");
  }, []);

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();

    try {
      await logoutRequest(refresh ? { refreshToken: refresh } : undefined);
    } catch {
      // Local logout still proceeds if backend session is already invalid.
    } finally {
      clearAuthSession();
      setCurrentUser(null);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      toast.success("Signed out");
    }
  }, [queryClient]);

  const forgotPasswordAction = useCallback(async (payload: ForgotPasswordFormValues) => {
    if (!isValidEmail(payload.email)) {
      throw new ApiError("Enter a valid email address", 400, "VALIDATION_ERROR");
    }

    await forgotPassword(payload);
    toast.success("If the account exists, reset instructions were sent.");
  }, []);

  const resetPasswordAction = useCallback(
    async (token: string, payload: ResetPasswordFormValues) => {
      if (!token) {
        throw new ApiError("Reset token is missing or invalid", 400, "VALIDATION_ERROR");
      }
      if (!isStrongPassword(payload.password)) {
        throw new ApiError(
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
          400,
          "VALIDATION_ERROR",
        );
      }
      if (!passwordsMatch(payload.password, payload.confirmPassword)) {
        throw new ApiError("Passwords do not match", 400, "VALIDATION_ERROR");
      }

      await resetPassword(token, payload);
      toast.success("Password updated. You can sign in now.");
    },
    [],
  );

  const verifyEmailAction = useCallback(async (payload: VerifyEmailFormValues) => {
    if (!payload.token) {
      throw new ApiError("Verification token is missing", 400, "VALIDATION_ERROR");
    }

    await verifyEmail(payload);
    toast.success("Email verified successfully");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      loading: isInitializing,
      isInitializing,
      login,
      register,
      logout,
      refreshUser,
      forgotPassword: forgotPasswordAction,
      resetPassword: resetPasswordAction,
      verifyEmail: verifyEmailAction,
    }),
    [
      currentUser,
      forgotPasswordAction,
      isInitializing,
      login,
      logout,
      refreshUser,
      register,
      resetPasswordAction,
      verifyEmailAction,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}