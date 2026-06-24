import type { AuthTokenResponse, User } from "@/types/api";

export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  tokenType: string;
  expiresAt: number;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormValues {
  token: string;
}

export interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  /** True while restoring session on initial app load */
  loading: boolean;
  isInitializing: boolean;
  login: (payload: LoginFormValues) => Promise<void>;
  register: (payload: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  forgotPassword: (payload: ForgotPasswordFormValues) => Promise<void>;
  resetPassword: (token: string, payload: ResetPasswordFormValues) => Promise<void>;
  verifyEmail: (payload: VerifyEmailFormValues) => Promise<void>;
}

export type AuthTokenPayload = AuthTokenResponse;
