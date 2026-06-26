import Link from "next/link";

const columns = [
  {
    title: "CredXP Dubai",
    links: [
      { label: "About", href: "/#consultation" },
      { label: "Properties", href: "/properties" },
      { label: "Projects", href: "/projects" },
      { label: "Developers", href: "/developers" },
    ],
  },
  {
    title: "Investors",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Saved Properties", href: "/saved-properties" },
      { label: "Register", href: "/register" },
      { label: "Sign In", href: "/login" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Search", href: "/search" },
      { label: "Featured Properties", href: "/properties" },
      { label: "Off-Plan Projects", href: "/projects" },
      { label: "Private Advisory", href: "/#consultation" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Dubai, UAE", href: "/#consultation" },
      { label: "invest@credxp.com", href: "mailto:invest@credxp.com" },
      { label: "+971 4 000 0000", href: "tel:+97140000000" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t-4 border-[#C8102E] bg-black text-white">
      <div className="mx-auto max-w-[1280px] px-[clamp(1.25rem,4vw,2rem)] py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-[0.1em] text-white uppercase">
                CredXP
              </span>
              <span className="mt-1 block text-[0.65rem] tracking-[0.42em] text-white/50 uppercase">
                Dubai
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Dubai&apos;s premier platform for luxury off-plan and investment-grade real estate.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-[0.6875rem] font-semibold tracking-[0.22em] text-[#E63946] uppercase">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} CredXP Dubai. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs tracking-wide text-white/45 uppercase">
            <Link href="/#consultation" className="transition-colors hover:text-[#E63946]">
              Privacy
            </Link>
            <Link href="/#consultation" className="transition-colors hover:text-[#E63946]">
              Terms
            </Link>
            <span>Instagram</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
