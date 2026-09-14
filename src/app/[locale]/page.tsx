import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NewsSection } from "@/components/NewsSection";
import { YOUTUBE_CHANNEL_URL } from "@/lib/site";
import { MapPin, Play, ArrowRight } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const nav = await getTranslations("nav");

  const quickLinks = [
    { href: "/chi-siamo", label: nav("about") },
    { href: "/la-nostra-scuola", label: nav("school") },
    { href: "/contatti", label: nav("contact") },
    { href: "/corsi-di-italiano", label: nav("italianCourses") },
    { href: "/corsi-di-lingue", label: nav("languageCourses") },
    { href: "/esami", label: nav("exams") },
    { href: "/attivita-culturali", label: nav("activities") },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-primary via-primary to-primary-dark py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-xl text-blue-100 sm:text-2xl">{t("subtitle")}</p>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-blue-50 sm:text-lg">
            {t("intro")}
          </p>
        </div>
      </section>

      <NewsSection />

      <section className="bg-card py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-slate-50 to-blue-50 p-8 text-center sm:p-12">
            <Play className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-bold sm:text-2xl">
              {t("watchVideo")}
            </h2>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
            >
              {t("watchVideoCta")}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <MapPin className="h-6 w-6 text-primary" />
            {t("whereTitle")}
          </h2>
          <p className="mt-4 text-muted">{t("whereAddress")}</p>
          <p className="mt-1 font-medium">{t("whereStreet")}</p>
          <Link
            href="/contatti"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
          >
            {t("contactUs")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-t border-border bg-card py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-border px-4 py-3 text-center text-sm font-medium transition-colors hover:border-primary hover:bg-blue-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
