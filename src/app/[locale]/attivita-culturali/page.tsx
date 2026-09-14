import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("activities");

  const items = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">
                {["🏛️", "🎬", "🏰", "💚", "💼", "🧭", "📖", "🎨", "🚂", "🎉", "🔔"][i] || "✨"}
              </span>
              <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
      <PageNav page="activities" />
    </>
  );
}
