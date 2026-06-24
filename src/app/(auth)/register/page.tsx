import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Start exploring Dubai&apos;s most exclusive investment opportunities."
    >
      <RegisterForm />
    </AuthShell>
  );
}
