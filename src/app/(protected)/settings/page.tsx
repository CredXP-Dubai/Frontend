"use client";

import { useAuth } from "@/context/AuthContext";
import { PortalShell } from "@/components/layout/PortalShell";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { logout } = useAuth();

  return (
    <PortalShell
      eyebrow="Preferences"
      title="Settings"
      subtitle="Manage your session, security preferences, and account access."
    >
      <Reveal>
        <div className="space-y-5">
          <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-black">Session</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/55">
              Your secure session uses access and refresh tokens with automatic renewal.
              Sign out to revoke access on this device.
            </p>
            <div className="mt-6">
              <Button variant="secondary" onClick={() => logout()}>
                Sign Out
              </Button>
            </div>
          </section>

          <section className="rounded-xl border border-black/10 bg-[#F7F7F7] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-black">
              Notifications
            </h2>
            <p className="mt-2 text-sm text-black/45">
              Advisory alerts and property updates will be configurable here.
            </p>
          </section>
        </div>
      </Reveal>
    </PortalShell>
  );
}
