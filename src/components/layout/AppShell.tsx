"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  MapPin,
  Gift,
  Truck,
  Building2,
  Sun,
  Moon,
  X,
} from "lucide-react";
import { CleanCityLogo } from "@/components/brand/CleanCityLogo";
import { useCleanCity } from "@/lib/store";
import { formatNumber, firstName } from "@/lib/utils";
import { ReportModal } from "@/components/report/ReportModal";
import { OtpAuthModal } from "@/components/auth/OtpAuthModal";

const NAV_ITEMS = [
  { href: "/citoyen", label: "Habitant" },
  { href: "/agent", label: "Agent" },
  { href: "/recycleur", label: "Recycleur" },
  { href: "/commune", label: "Commune" },
  { href: "/", label: "Accueil" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    user,
    toasts,
    dismissToast,
    setIsReportModalOpen,
    setIsAuthModalOpen,
  } = useCleanCity();

  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-surface focus:text-sm focus:font-medium"
      >
        Aller au contenu principal
      </a>

      {/* Barre supérieure épurée */}
      <header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur-md border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/citoyen" className="rounded-lg">
              <CleanCityLogo size="sm" />
            </Link>

            <nav
              aria-label="Espaces"
              className="hidden md:flex items-center gap-1"
            >
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      active
                        ? "bg-ink text-surface font-medium"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLocale(locale === "fr" ? "wo" : "fr")}
              aria-label="Changer la langue (Français / Wolof)"
              className="h-9 px-2.5 rounded-full text-xs font-medium text-muted hover:text-ink border border-line bg-surface transition-colors"
            >
              {locale.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="Profil et points"
              className="h-9 px-3 rounded-full text-xs font-medium bg-surface border border-line text-ink hover:bg-subtle transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>{firstName(user.name)}</span>
              <span className="text-muted">·</span>
              <span className="tabular font-semibold text-accent whitespace-nowrap">
                {formatNumber(user.points)} pts
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Activer le thème sombre"
                  : "Activer le thème clair"
              }
              className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-muted hover:text-ink transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Sun className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation secondaire mobile sobre */}
        <div className="md:hidden border-t border-line px-3 py-1.5 bg-canvas">
          <div className="flex items-center justify-between gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${
                    active
                      ? "bg-ink text-surface font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Notifications sobres */}
      <div
        aria-live="polite"
        className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-card bg-surface border border-line shadow-lift flex items-start justify-between gap-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-ink">{toast.title}</p>
              {toast.description ? (
                <p className="text-xs text-muted">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fermer la notification"
              className="w-7 h-7 rounded-full hover:bg-subtle flex items-center justify-center text-muted shrink-0"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <main id="main-content" className="flex-1 pb-24 md:pb-16">
        {children}
      </main>

      {/* Barre d'onglets mobile (navigation à une main) */}
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-line pb-[env(safe-area-inset-bottom)]"
      >
        <div className="max-w-md mx-auto px-3 h-16 grid grid-cols-5 items-center">
          <Link
            href="/citoyen"
            className={`flex flex-col items-center justify-center h-12 rounded-xl text-xs transition-colors ${
              pathname === "/citoyen"
                ? "text-ink font-semibold"
                : "text-muted"
            }`}
          >
            <MapPin className="w-4 h-4 mb-0.5" aria-hidden="true" />
            <span>Quartier</span>
          </Link>

          <Link
            href="/citoyen?tab=recompenses"
            className="flex flex-col items-center justify-center h-12 rounded-xl text-xs text-muted hover:text-ink transition-colors"
          >
            <Gift className="w-4 h-4 mb-0.5" aria-hidden="true" />
            <span>Points</span>
          </Link>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              aria-label="Signaler un dépôt"
              className="h-11 px-4 rounded-full bg-accent text-accent-fg text-xs font-semibold shadow-soft inline-flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Signaler</span>
            </button>
          </div>

          <Link
            href="/agent"
            className={`flex flex-col items-center justify-center h-12 rounded-xl text-xs transition-colors ${
              pathname.startsWith("/agent")
                ? "text-ink font-semibold"
                : "text-muted"
            }`}
          >
            <Truck className="w-4 h-4 mb-0.5" aria-hidden="true" />
            <span>Agent</span>
          </Link>

          <Link
            href="/commune"
            className={`flex flex-col items-center justify-center h-12 rounded-xl text-xs transition-colors ${
              pathname.startsWith("/commune")
                ? "text-ink font-semibold"
                : "text-muted"
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" aria-hidden="true" />
            <span>Commune</span>
          </Link>
        </div>
      </nav>

      <ReportModal />
      <OtpAuthModal />
    </div>
  );
}
