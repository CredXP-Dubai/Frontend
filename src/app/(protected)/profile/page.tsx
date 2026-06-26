"use client";

import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/lib/auth/utils";
import { asRecord, readString } from "@/utils/record";
import { PortalShell } from "@/components/layout/PortalShell";
import { Reveal } from "@/components/ui/Reveal";

export default function ProfilePage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const user = asRecord(currentUser);
  const fields = [
    { label: "Name", value: getDisplayName(currentUser) },
    { label: "Email", value: readString(user, "email") || "—" },
    { label: "Status", value: readString(user, "status") || "—" },
    { label: "User ID", value: readString(user, "id") || "—" },
    {
      label: "Member Since",
      value: readString(user, "createdAt")
        ? new Date(readString(user, "createdAt")).toLocaleDateString("en-AE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ] as const;

  return (
    <PortalShell
      eyebrow="Membership"
      title="Profile"
      subtitle="Your private investor profile and account credentials."
    >
      <Reveal>
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
          {fields.map((field, index) => (
            <div
              key={field.label}
              className={`grid gap-1 px-6 py-5 md:grid-cols-[200px_1fr] ${
                index < fields.length - 1 ? "border-b border-black/8" : ""
              }`}
            >
              <dt className="text-[0.6875rem] font-semibold tracking-[0.16em] text-[#C8102E] uppercase">
                {field.label}
              </dt>
              <dd className="text-base text-black">{field.value}</dd>
            </div>
          ))}
        </div>
      </Reveal>
    </PortalShell>
  );
}
