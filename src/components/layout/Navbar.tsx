"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDisplayName, getUserInitials } from "@/lib/auth/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const hideNavbar =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register";

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  }

  if (hideNavbar) {
    return null;
  }

  return (
    <header className="site-navbar">
      <div className="site-navbar__inner">
        <Link href="/" className="site-navbar__brand">
          CredXP Dubai
        </Link>

        <nav className="site-navbar__links" aria-label="Primary">
          <Link href="/#properties">Properties</Link>
          <Link href="/#developers">Developers</Link>
          {isAuthenticated && <Link href="/dashboard">Dashboard</Link>}
        </nav>

        <div className="site-navbar__actions">
          {loading ? (
            <span className="site-navbar__status">Checking session…</span>
          ) : isAuthenticated && currentUser ? (
            <div className="site-navbar__user">
              <button
                type="button"
                className="site-navbar__avatar"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span>{getUserInitials(currentUser)}</span>
              </button>

              {menuOpen && (
                <div className="site-navbar__menu" role="menu">
                  <p className="site-navbar__menu-name">
                    {getDisplayName(currentUser)}
                  </p>
                  <p className="site-navbar__menu-email">{currentUser.email}</p>
                  <Link href="/dashboard" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link
                    href="/saved-properties"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Saved Properties
                  </Link>
                  <Link href="/settings" role="menuitem" onClick={() => setMenuOpen(false)}>
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="site-navbar__logout"
                    onClick={handleLogout}
                    disabled={signingOut}
                  >
                    {signingOut ? "Signing out…" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="site-navbar__ghost">
                Login
              </Link>
              <Link href="/register" className="site-navbar__cta">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
