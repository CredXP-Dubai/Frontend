"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  getErrorMessage,
  isValidEmail,
  passwordsMatch,
} from "@/lib/auth/utils";
import { AuthFloatingInput } from "./AuthFloatingInput";
import { AuthGoldButton } from "./AuthGoldButton";
import { PasswordStrength } from "./PasswordStrength";

function ValidationHint({
  valid,
  message,
}: {
  valid: boolean;
  message: string;
}) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-xs ${valid ? "text-emerald-300/90" : "text-luxury-muted"}`}
    >
      {message}
    </motion.p>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(
    () => email.length === 0 || isValidEmail(email),
    [email],
  );
  const passwordsMatched = useMemo(
    () => confirmPassword.length === 0 || passwordsMatch(password, confirmPassword),
    [password, confirmPassword],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!agreedToTerms) {
      setError("Please agree to the Terms & Conditions");
      setSubmitting(false);
      return;
    }

    try {
      await register({ name, email, password, confirmPassword });
      router.push("/login");
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to create account"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <AuthFloatingInput
          id="register-name"
          label="Full Name"
          type="text"
          value={name}
          onChange={setName}
          autoComplete="name"
          required
        />

        <div className="space-y-1.5">
          <AuthFloatingInput
            id="register-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            error={email.length > 0 && !emailValid}
          />
          <ValidationHint
            valid={emailValid}
            message={
              email.length > 0
                ? emailValid
                  ? "Valid email address"
                  : "Enter a valid email address"
                : ""
            }
          />
        </div>

        <div className="space-y-2">
          <AuthFloatingInput
            id="register-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={8}
          />
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5">
          <AuthFloatingInput
            id="register-confirm-password"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
            minLength={8}
            error={confirmPassword.length > 0 && !passwordsMatched}
          />
          <ValidationHint
            valid={passwordsMatched}
            message={
              confirmPassword.length > 0
                ? passwordsMatched
                  ? "Passwords match"
                  : "Passwords do not match"
                : ""
            }
          />
        </div>
      </div>

      <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-luxury-border bg-white/2 px-4 py-3 transition-colors hover:border-luxury-gold/25">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(event) => setAgreedToTerms(event.target.checked)}
            className="peer sr-only"
          />
          <span className="h-5 w-5 rounded border border-luxury-border bg-white/3 transition-all peer-checked:border-luxury-gold peer-checked:bg-luxury-gold/20 peer-focus-visible:ring-2 peer-focus-visible:ring-luxury-gold/50" />
          <svg
            viewBox="0 0 12 10"
            className="pointer-events-none absolute h-2.5 w-3 text-luxury-gold-light opacity-0 transition-opacity peer-checked:opacity-100"
            aria-hidden="true"
          >
            <path
              d="M1 5.5L4.5 9 11 1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm leading-relaxed text-luxury-muted">
          I agree to the{" "}
          <span className="text-luxury-gold-light underline decoration-luxury-gold/40 underline-offset-2">
            Terms &amp; Conditions
          </span>
        </span>
      </label>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="register-error"
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
        {submitting ? "Creating Account…" : "Create Account"}
      </AuthGoldButton>

      <p className="text-center text-sm text-luxury-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-luxury-gold transition-colors hover:text-luxury-gold-light"
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
