"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authCapabilities } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/auth/utils";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await resetPassword(token, { password, confirmPassword });
      setCompleted(true);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to reset password"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!authCapabilities.resetPassword) {
    return (
      <div className="auth-form__notice">
        <p>
          Password reset is not available on the current backend API
          (`POST /api/v1/auth/reset-password` returns 404).
        </p>
        <div className="auth-form__links">
          <Link href="/login">Back to sign in</Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-form__notice">
        <p>Reset token is missing or invalid. Request a new password reset link.</p>
        <div className="auth-form__links">
          <Link href="/forgot-password">Request reset link</Link>
          <Link href="/login">Back to sign in</Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="auth-form__notice auth-form__notice--success">
        <p>Your password has been updated. You can sign in with your new credentials.</p>
        <div className="auth-form__links">
          <Link href="/login">Sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </div>

      <div className="auth-form__field">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          minLength={8}
        />
      </div>

      {error && <p className="auth-form__error">{error}</p>}

      <button type="submit" className="auth-form__submit" disabled={submitting}>
        {submitting ? "Updating…" : "Update Password"}
      </button>

      <div className="auth-form__links">
        <Link href="/login">Back to sign in</Link>
      </div>
    </form>
  );
}
