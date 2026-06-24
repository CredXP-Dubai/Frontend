"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/lib/auth/utils";
import { PortalShell } from "@/components/layout/PortalShell";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { label: "Portfolio Value", value: "AED —" },
  { label: "Saved Properties", value: "0" },
  { label: "Active Inquiries", value: "0" },
  { label: "Member Status", value: "Private" },
] as const;

const quickLinks = [
  {
    href: "/profile",
    title: "Profile",
    description: "Your membership details and account information.",
  },
  {
    href: "/saved-properties",
    title: "Saved Properties",
    description: "Review and manage your shortlisted residences.",
  },
  {
    href: "/settings",
    title: "Settings",
    description: "Security preferences and session management.",
  },
] as const;

export default function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <PortalShell
      eyebrow="Private Investor Portal"
      title={`Welcome${currentUser ? `, ${getDisplayName(currentUser).split(" ")[0]}` : ""}`}
      subtitle="Your confidential overview of saved listings, portfolio insights, and advisory activity."
    >
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.06}>
            <div className="rounded-xl border border-black/10 bg-[#F7F7F7] p-5">
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-black/45 uppercase">
                {stat.label}
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#C8102E]">
                {stat.value}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {quickLinks.map((link, index) => (
          <Reveal key={link.href} delay={0.1 + index * 0.08}>
            <LuxuryCard href={link.href}>
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-black">{link.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-black/55">{link.description}</p>
              <span className="mt-5 inline-block text-xs font-semibold tracking-[0.16em] text-[#C8102E] uppercase">
                Open →
              </span>
            </LuxuryCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10" delay={0.2}>
        <div className="rounded-xl border-l-4 border-[#C8102E] bg-[#F7F7F7] p-6">
          <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-[#C8102E] uppercase">
            Portfolio Overview
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/55">
            Your investment dashboard will populate with live property data, inquiry history,
            and portfolio analytics once the listings API is connected.
          </p>
          <Link
            href="/#properties"
            className="mt-5 inline-block text-sm font-medium text-[#C8102E] transition-colors hover:text-black"
          >
            Explore available properties →
          </Link>
        </div>
      </Reveal>
    </PortalShell>
  );
}
