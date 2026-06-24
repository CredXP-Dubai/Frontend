"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authCapabilities } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/auth/utils";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to send reset email"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!authCapabilities.forgotPassword) {
    return (
      <div className="auth-form__notice">
        <p>
          Password recovery is not available on the current backend API
          (`POST /api/v1/auth/forgot-password` returns 404).
        </p>
        <div className="auth-form__links">
          <Link href="/login">Back to sign in</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="auth-form__notice auth-form__notice--success">
        <p>If an account exists for {email}, reset instructions have been sent.</p>
        <div className="auth-form__links">
          <Link href="/login">Return to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      {error && <p className="auth-form__error">{error}</p>}

      <button type="submit" className="auth-form__submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send Reset Link"}
      </button>

      <div className="auth-form__links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}
