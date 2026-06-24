import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Reset Password"
      subtitle="Choose a new password for your CredXP Dubai account."
    >
      <Suspense fallback={<p className="auth-form__hint">Loading reset form…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
