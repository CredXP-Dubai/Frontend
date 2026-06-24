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
              background: "#ffffff",
              color: "#000000",
              border: "1px solid rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#C8102E",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#C8102E",
                secondary: "#ffffff",
              },
            },
          }}
        />
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}
