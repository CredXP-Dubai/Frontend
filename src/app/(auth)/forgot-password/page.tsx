import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we will send password reset instructions."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
