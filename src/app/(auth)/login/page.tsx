import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold/20 border-t-luxury-gold" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Access your private Dubai property portfolio."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
