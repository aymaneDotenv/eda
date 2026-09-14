import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { Quote } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const testimonials = t.raw("testimonials") as Array<{
    name: string;
    quote: string;
  }>;
  const teachers = t.raw("teachers") as string[];

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <section>
          <h2 className="text-2xl font-bold">{t("communityTitle")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <Quote className="h-6 w-6 text-primary/40" />
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {item.quote}
                </p>
                <footer className="mt-4 text-sm font-semibold text-primary">
                  — {item.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">{t("teachersTitle")}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {teachers.map((teacher) => (
              <li
                key={teacher}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                {teacher}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-2xl bg-primary/5 p-8 text-center">
          <h2 className="text-xl font-bold">{t("coordinatorTitle")}</h2>
          <p className="mt-2 text-lg text-primary">{t("coordinatorName")}</p>
        </section>
      </div>
      <PageNav page="about" />
    </>
  );
}
