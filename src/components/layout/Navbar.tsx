"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getDisplayName, getUserInitials } from "@/lib/auth/utils";
import { readString, asRecord } from "@/utils/record";
import { Button } from "@/components/ui/Button";
import { theme } from "@/styles/theme";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/projects", label: "Projects" },
  { href: "/developers", label: "Developers" },
  { href: "/search", label: "Search" },
  { href: "/#consultation", label: "Advisory" },
] as const;

function NavLink({
  href,
  label,
  onDark,
}: {
  href: string;
  label: string;
  onDark: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative py-1 text-sm font-medium tracking-wide transition-colors ${
        onDark ? "text-white/90 hover:text-[#E63946]" : "text-black/70 hover:text-[#C8102E]"
      }`}
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-[#C8102E] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, loading, logout } = useAuth();
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/unauthorized";

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  if (isAuthPage) return null;

  const onHero = isHome && !scrolled;
  const headerClass = onHero ? theme.components.navbar.transparent : theme.components.navbar.solid;

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setSigningOut(false);
      setUserMenuOpen(false);
    }
  }

  const accountMenuItems = [
    ...(!permissionsLoading && permissions.canAccessWorkspace
      ? [{ href: "/workspace", label: "Workspace" }]
      : []),
    ...(!permissionsLoading && permissions.canAccessInvestorPortal
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/profile", label: "Profile" },
          { href: "/saved-properties", label: "Saved Properties" },
          { href: "/settings", label: "Settings" },
        ]
      : []),
  ];

  return (
    <header className={headerClass}>
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-[clamp(1.25rem,4vw,2rem)] py-4">
        <Link href="/" className="group shrink-0">
          <span
            className={`font-[family-name:var(--font-display)] text-xl font-semibold tracking-[0.1em] uppercase transition-colors ${
              onHero ? "text-white group-hover:text-[#E63946]" : "text-black group-hover:text-[#C8102E]"
            }`}
          >
            CredXP
          </span>
          <span
            className={`block text-[0.6rem] tracking-[0.38em] uppercase ${
              onHero ? "text-white/60" : "text-black/45"
            }`}
          >
            Dubai
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} onDark={onHero} />
          ))}
          {!permissionsLoading && isAuthenticated && permissions.canAccessInvestorPortal && (
            <NavLink href="/dashboard" label="Portal" onDark={onHero} />
          )}
          {!permissionsLoading && isAuthenticated && permissions.canAccessWorkspace && (
            <NavLink href="/workspace" label="Workspace" onDark={onHero} />
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {loading ? (
            <span className={`text-xs ${onHero ? "text-white/50" : "text-black/45"}`}>Loading…</span>
          ) : isAuthenticated && currentUser ? (
            <div className="relative">
              <button
                type="button"
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                  onHero
                    ? "border-white/40 text-white hover:border-[#E63946] hover:text-[#E63946]"
                    : "border-black text-black hover:border-[#C8102E] hover:text-[#C8102E]"
                }`}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {getUserInitials(currentUser)}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-[calc(100%+0.5rem)] min-w-[220px] rounded-xl border border-black/10 bg-white p-3 shadow-lg"
                    role="menu"
                  >
                    <p className="px-2 text-sm font-semibold text-black">{getDisplayName(currentUser)}</p>
                    <p className="mb-2 px-2 text-xs text-black/45">
                      {readString(asRecord(currentUser), "email")}
                    </p>
                    {accountMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        className="block rounded-lg px-2 py-2 text-sm text-black/75 transition-colors hover:bg-black/5 hover:text-[#C8102E]"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      type="button"
                      className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm text-[#C8102E] transition-colors hover:bg-red-50"
                      onClick={handleLogout}
                      disabled={signingOut}
                    >
                      {signingOut ? "Signing out…" : "Logout"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Button
                href="/login"
                variant={onHero ? "ghost" : "ghost"}
                size="sm"
                className={onHero ? theme.components.button.ghostOnDark : undefined}
              >
                Sign In
              </Button>
              <Button href="/register" variant="primary" size="sm">
                Register
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden ${
            onHero ? "border-white/30" : "border-black/15"
          }`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 transition-transform ${onHero ? "bg-white" : "bg-black"} ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-5 transition-opacity ${onHero ? "bg-white" : "bg-black"} ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-5 transition-transform ${onHero ? "bg-white" : "bg-black"} ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-black/10 bg-white lg:hidden"
          >
            <div className="space-y-1 px-[clamp(1.25rem,4vw,2rem)] py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-sm font-medium text-black/80"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {!permissionsLoading && permissions.canAccessInvestorPortal && (
                    <Link href="/dashboard" className="block py-3 text-sm" onClick={() => setMenuOpen(false)}>
                      Portal
                    </Link>
                  )}
                  {!permissionsLoading && permissions.canAccessWorkspace && (
                    <Link href="/workspace" className="block py-3 text-sm" onClick={() => setMenuOpen(false)}>
                      Workspace
                    </Link>
                  )}
                  <button type="button" className="block py-3 text-sm text-[#C8102E]" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-3">
                  <Button href="/login" variant="secondary" size="sm">
                    Sign In
                  </Button>
                  <Button href="/register" variant="primary" size="sm">
                    Register
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
