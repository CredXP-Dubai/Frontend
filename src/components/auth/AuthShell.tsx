"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { AuthCard } from "./AuthCard";
import { AuthShowcase } from "./AuthShowcase";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function AuthLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-black/55"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#C8102E]" />
      <p className="text-sm tracking-wide">Restoring your session…</p>
    </div>
  );
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-white lg:grid lg:grid-cols-[3fr_2fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <AuthShowcase />

      <div className="relative flex items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <AuthCard title={title} subtitle={subtitle}>
          {children}
        </AuthCard>
      </div>
    </motion.div>
  );
}
