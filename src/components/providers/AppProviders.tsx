"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { QueryProvider } from "@/components/providers/QueryProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111",
              color: "#f5e6c8",
              border: "1px solid rgba(201, 169, 98, 0.35)",
            },
            success: {
              iconTheme: {
                primary: "#c9a962",
                secondary: "#111",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#111",
              },
            },
          }}
        />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
