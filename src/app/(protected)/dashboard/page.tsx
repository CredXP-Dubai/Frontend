import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="account-page">
      <div className="account-page__inner">
        <p className="account-page__eyebrow">Member Area</p>
        <h1 className="account-page__title">Dashboard</h1>
        <p className="account-page__subtitle">
          Your private overview of saved listings, advisory requests, and account
          activity.
        </p>

        <div className="account-grid">
          <Link href="/profile" className="account-card">
            <h2>Profile</h2>
            <p>View and update your personal details.</p>
          </Link>
          <Link href="/saved-properties" className="account-card">
            <h2>Saved Properties</h2>
            <p>Review properties you have shortlisted.</p>
          </Link>
          <Link href="/settings" className="account-card">
            <h2>Settings</h2>
            <p>Manage notifications and security preferences.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
