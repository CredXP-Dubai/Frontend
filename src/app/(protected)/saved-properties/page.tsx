export default function SavedPropertiesPage() {
  return (
    <main className="account-page">
      <div className="account-page__inner">
        <p className="account-page__eyebrow">Shortlist</p>
        <h1 className="account-page__title">Saved Properties</h1>
        <p className="account-page__subtitle">
          Your saved properties will appear here once the listings API is available
          on the backend.
        </p>

        <div className="account-empty">
          <p>No saved properties yet.</p>
          <a href="/#properties">Browse featured properties</a>
        </div>
      </div>
    </main>
  );
}
