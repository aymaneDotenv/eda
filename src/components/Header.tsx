"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navItems = [
  { href: "/", key: "home" },
  { href: "/chi-siamo", key: "about" },
  { href: "/la-nostra-scuola", key: "school" },
  { href: "/corsi-di-italiano", key: "italianCourses" },
  { href: "/corsi-di-lingue", key: "languageCourses" },
  { href: "/esami", key: "exams" },
  { href: "/attivita-culturali", key: "activities" },
  { href: "/contatti", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isRtl = locale === "ar" || locale === "ur";
  const showLanguageSwitcher = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 flex-col">
          <span className="truncate text-lg font-bold text-primary">
            EdA Don Milani
          </span>
          <span className="truncate text-xs text-muted">Rovereto</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-primary ${
                pathname === item.href ? "bg-blue-50 text-primary" : "text-foreground"
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {showLanguageSwitcher && <LanguageSwitcher />}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 hover:bg-blue-50 lg:hidden"
            aria-label={open ? t("close") : t("menu")}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`border-t border-border bg-card px-4 py-4 lg:hidden ${isRtl ? "text-right" : ""}`}
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    pathname === item.href
                      ? "bg-blue-50 text-primary"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
