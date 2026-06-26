"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  Building2,
  ChevronLeft,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Shield,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUiStore } from "@/store/ui-store";
import { usePermissions } from "@/hooks/usePermissions";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  visible: boolean;
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, setSidebarOpen } = useUiStore();
  const { permissions } = usePermissions();

  const groups: NavGroup[] = [
    {
      items: [
        { href: "/workspace", label: "Overview", icon: LayoutDashboard, visible: true },
        {
          href: "/workspace/admin",
          label: "Admin",
          icon: Shield,
          visible: permissions.canAccessAdmin,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          href: "/workspace/users",
          label: "Users",
          icon: Users,
          visible: permissions.canManageUsers,
        },
        {
          href: "/workspace/developers",
          label: "Developers",
          icon: Building2,
          visible: permissions.canReadCatalog,
        },
        {
          href: "/workspace/projects",
          label: "Projects",
          icon: FolderKanban,
          visible: permissions.canReadCatalog,
        },
        {
          href: "/workspace/properties",
          label: "Properties",
          icon: Building2,
          visible: permissions.canReadCatalog,
        },
      ],
    },
    {
      title: "Sales",
      items: [
        {
          href: "/workspace/crm/leads",
          label: "Leads",
          icon: MessagesSquare,
          visible: permissions.canAccessCrm,
        },
        {
          href: "/workspace/proposals",
          label: "Proposals",
          icon: FileText,
          visible: permissions.canAccessProposals,
        },
        {
          href: "/workspace/broker",
          label: "Broker Portal",
          icon: UserCircle,
          visible: permissions.canAccessBrokers,
        },
      ],
    },
    {
      title: "Engagement",
      items: [
        {
          href: "/workspace/automation",
          label: "Automation",
          icon: Mail,
          visible: permissions.canAccessAutomation,
        },
        {
          href: "/workspace/ai",
          label: "AI Assistant",
          icon: Bot,
          visible: permissions.canAccessAi,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-black/10 bg-white transition-all",
        sidebarCollapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-black/10 px-4">
        {!sidebarCollapsed && (
          <Link href="/workspace" className="font-[family-name:var(--font-display)] text-lg text-black">
            CredXP
          </Link>
        )}
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="rounded-md p-2 text-black/50 hover:bg-black/5"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {groups.map((group) => {
          const visible = group.items.filter((i) => i.visible);
          if (visible.length === 0) return null;
          return (
            <div key={group.title ?? "main"}>
              {group.title && !sidebarCollapsed && (
                <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.16em] text-black/40 uppercase">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {visible.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-[#C8102E] text-white"
                          : "text-black/65 hover:bg-black/5 hover:text-black",
                      )}
                      title={sidebarCollapsed ? label : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && <span>{label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
