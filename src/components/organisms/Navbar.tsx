"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/molecules/UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", show: !user },
    { href: "/profile", label: "Get Recommendations", show: !!user },
    { href: "/admin/policies", label: "Policies", show: isAdmin },
    { href: "/admin/riders", label: "Riders", show: isAdmin },
  ].filter((l) => l.show);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={closeMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-secondary">
            Insure<span className="text-primary">Match</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {!loading && !user && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}

          {user && (
            <div className="ml-2">
              <UserMenu />
            </div>
          )}
        </nav>

        {/* Mobile: user menu (always visible) + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <UserMenu />}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/95 px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-accent text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {!loading && !user && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Link href="/login" onClick={closeMobile}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={closeMobile}>
                <Button size="sm" className="w-full">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
