"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";

const localeLabels: Record<Locale, string> = {
  it: "IT",
  en: "EN",
  fr: "FR",
  sq: "SQ",
  ar: "AR",
  ur: "UR",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative">
      <label htmlFor="lang-select" className="sr-only">
        Language
      </label>
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5">
        <Globe className="h-4 w-4 text-muted" />
        <select
          id="lang-select"
          value={locale}
          onChange={(e) =>
            router.replace(pathname, { locale: e.target.value as Locale })
          }
          className="bg-transparent text-sm font-medium outline-none"
        >
          {routing.locales.map((loc) => (
            <option key={loc} value={loc}>
              {localeLabels[loc]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
