import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { Link } from "@/i18n/navigation";
import { UNISTRASI_URL } from "@/lib/site";

export default async function ItalianCoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("italianCourses");
  const nav = await getTranslations("nav");

  const courses = t.raw("courses") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("intro")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="space-y-4">
          {courses.map((course, i) => (
            <article
              key={course.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {course.description}
              </p>
              {(i === 3 || i === 4) && (
                <p className="mt-2 text-xs text-primary">
                  {t("unistrapgNote")}:{" "}
                  <a
                    href={UNISTRASI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    unistrapg.it
                  </a>
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/corsi-di-lingue"
            className="text-sm font-medium text-primary hover:underline"
          >
            {nav("languageCourses")} →
          </Link>
        </div>
      </div>
      <PageNav page="italianCourses" />
    </>
  );
}
