"use client";

import { DashboardBreadcrumb } from "./DashboardBreadcrumb";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopNav } from "./DashboardTopNav";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils/cn";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <DashboardSidebar />
      </div>

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <DashboardTopNav />
        <main className="flex-1 p-4 md:p-8">
          <DashboardBreadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
