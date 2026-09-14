import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { Link } from "@/i18n/navigation";
import { Languages } from "lucide-react";

export default async function LanguageCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("languageCourses");
  const nav = await getTranslations("nav");

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("intro")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <article className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <Languages className="mt-1 h-8 w-8 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold">{t("courseTitle")}</h2>
              <p className="mt-4 leading-relaxed text-muted">{t("description")}</p>
            </div>
          </div>
        </article>
        <p className="mt-10 text-sm font-medium text-primary">
          <Link href="/corsi-di-italiano" className="hover:underline">
            ← {nav("italianCourses")}
          </Link>
        </p>
      </div>
      <PageNav page="languageCourses" />
    </>
  );
}
