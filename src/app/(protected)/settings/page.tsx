"use client";

import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();

  return (
    <main className="account-page">
      <div className="account-page__inner">
        <p className="account-page__eyebrow">Preferences</p>
        <h1 className="account-page__title">Settings</h1>
        <p className="account-page__subtitle">
          Manage your session and account security.
        </p>

        <section className="settings-panel">
          <h2>Session</h2>
          <p>
            Your session is stored using access and refresh tokens returned by the
            live backend. Tokens refresh automatically when they expire.
          </p>
          <button type="button" className="settings-panel__danger" onClick={() => logout()}>
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
}
