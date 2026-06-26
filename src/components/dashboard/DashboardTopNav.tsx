"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getDisplayName, getUserInitials } from "@/lib/auth/utils";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils/cn";

export function DashboardTopNav() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const { permissions } = usePermissions();
  const { theme, setTheme, toggleSidebar } = useUiStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    document.documentElement.classList.toggle("dark", theme !== "dark");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-black/50 hover:bg-black/5 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-black">Workspace</p>
          {permissions.roleLabel && (
            <p className="text-xs text-black/45">{permissions.roleLabel}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-lg p-2 text-black/50 hover:bg-black/5"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-black/50 hover:bg-black/5"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-black/10 px-2 py-1.5 hover:bg-black/5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C8102E] text-xs font-semibold text-white">
                {currentUser ? getUserInitials(currentUser) : "?"}
              </span>
              <span className="hidden text-sm text-black md:inline">
                {currentUser ? getDisplayName(currentUser) : "Account"}
              </span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="z-50 min-w-[12rem] rounded-lg border border-black/10 bg-white p-1 shadow-lg"
              sideOffset={8}
              align="end"
            >
              <DropdownMenu.Item asChild>
                <Link
                  href="/profile"
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-black outline-none hover:bg-black/5",
                  )}
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-black/10" />
              <DropdownMenu.Item
                className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-[#C8102E] outline-none hover:bg-red-50"
                onSelect={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
