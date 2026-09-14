import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { Calendar, Building2 } from "lucide-react";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("school");

  const holidays = t.raw("holidays") as string[];
  const endDates = t.raw("endDates") as string[];

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="leading-relaxed">{t("intro")}</p>
                <p className="mt-4 leading-relaxed text-muted">{t("facilities")}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">{t("calendarTitle")}</h2>
            </div>
            <h3 className="mt-6 font-semibold">{t("holidaysTitle")}</h3>
            <ul className="mt-3 space-y-2">
              {holidays.map((day) => (
                <li key={day} className="text-sm text-muted">
                  • {day}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 font-semibold">{t("endTitle")}</h3>
            <ul className="mt-3 space-y-2">
              {endDates.map((day) => (
                <li key={day} className="text-sm font-medium">
                  • {day}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <PageNav page="school" />
    </>
  );
}
