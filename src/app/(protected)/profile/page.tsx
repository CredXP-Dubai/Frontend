"use client";

import { useAuth } from "@/context/AuthContext";
import { getDisplayName } from "@/lib/auth/utils";

export default function ProfilePage() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <main className="account-page">
      <div className="account-page__inner">
        <p className="account-page__eyebrow">Account</p>
        <h1 className="account-page__title">Profile</h1>
        <p className="account-page__subtitle">
          Your authenticated profile and membership details.
        </p>

        <dl className="profile-list">
          <div>
            <dt>Name</dt>
            <dd>{getDisplayName(currentUser)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{currentUser.email}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{currentUser.status ?? "—"}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{currentUser.id}</dd>
          </div>
          {currentUser.createdAt && (
            <div>
              <dt>Member Since</dt>
              <dd>{new Date(currentUser.createdAt).toLocaleDateString()}</dd>
            </div>
          )}
        </dl>
      </div>
    </main>
  );
}
