"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  workspace: "Overview",
  users: "Users",
  properties: "Properties",
  crm: "CRM",
  leads: "Leads",
  customers: "Customers",
  proposals: "Proposals",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = LABELS[segment] ?? segment;
    return { href, label, isLast: index === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-black/50">
      {crumbs.map((crumb) => (
        <Fragment key={crumb.href}>
          {crumb.isLast ? (
            <span className="font-medium text-black">{crumb.label}</span>
          ) : (
            <>
              <Link href={crumb.href} className="hover:text-[#C8102E]">
                {crumb.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
