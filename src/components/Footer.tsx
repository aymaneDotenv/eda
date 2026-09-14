import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SCHOOL_PHONE_DISPLAY } from "@/lib/site";

const navItems = [
  { href: "/chi-siamo", key: "about" },
  { href: "/la-nostra-scuola", key: "school" },
  { href: "/contatti", key: "contact" },
  { href: "/corsi-di-italiano", key: "italianCourses" },
  { href: "/corsi-di-lingue", key: "languageCourses" },
  { href: "/esami", key: "exams" },
  { href: "/attivita-culturali", key: "activities" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="mt-auto border-t border-border bg-primary-dark text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">EdA Don Milani</h3>
            <p className="mt-2 text-sm text-blue-100">{t("tagline")}</p>
            <p className="mt-1 text-sm text-blue-100">{t("iis")}</p>
          </div>
          <div>
            <h4 className="font-semibold">{t("linksTitle")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-blue-100">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white">
                    {nav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">{nav("contact")}</h4>
            <p className="mt-3 text-sm text-blue-100">
              via A. Balista 2, 38068 Rovereto (TN)
            </p>
            <p className="mt-1 text-sm text-blue-100">{SCHOOL_PHONE_DISPLAY}</p>
            <Link
              href="/contatti"
              className="mt-4 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
            >
              {nav("contact")}
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t border-blue-800 pt-6 text-center text-sm text-blue-200">
          {t("rights")}
        </div>
      </div>
    </footer>
  );
}
