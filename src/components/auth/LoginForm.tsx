"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/auth/utils";
import { AuthFloatingInput } from "./AuthFloatingInput";
import { AuthGoldButton } from "./AuthGoldButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      router.replace(redirectTo);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to sign in"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <AuthFloatingInput
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />

        <AuthFloatingInput
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="login-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AuthGoldButton type="submit" disabled={submitting}>
        {submitting ? "Signing In…" : "Sign In"}
      </AuthGoldButton>

      <div className="flex flex-col items-center gap-3 pt-1 sm:flex-row sm:justify-between">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#C8102E] transition-colors hover:text-black"
        >
          Forgot Password
        </Link>
        <Link
          href="/register"
          className="text-sm text-black/65 transition-colors hover:text-[#C8102E]"
        >
          Create Account
        </Link>
      </div>

    </form>
  );
}
