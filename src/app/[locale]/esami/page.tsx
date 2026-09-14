import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { NewsSection } from "@/components/NewsSection";
import { PhoneLink } from "@/components/PhoneLink";
import { GraduationCap } from "lucide-react";

export default async function ExamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exams");
  const common = await getTranslations("common");

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <article className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <GraduationCap className="mt-1 h-8 w-8 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-bold">{t("cilsTitle")}</h2>
              <p className="mt-2 font-medium text-primary">{t("levels")}</p>
              <p className="mt-4 leading-relaxed text-muted">{t("description")}</p>
              <p className="mt-4 text-sm">
                {common("phoneRoberto")}: <PhoneLink showIcon={false} />
              </p>
            </div>
          </div>
        </article>
        <h2 className="mt-12 text-xl font-bold">{t("viewNews")}</h2>
      </div>
      <NewsSection />
      <PageNav page="exams" />
    </>
  );
}
