import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import { SCHOOL_EMAIL, SCHOOL_PHONE_DISPLAY, SCHOOL_PHONE_TEL } from "@/lib/site";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <dl className="space-y-8">
          <div>
            <dt className="text-sm font-medium uppercase tracking-wide text-muted">
              {t("mailLabel")}
            </dt>
            <dd className="mt-1 text-lg font-medium">{t("mailAddress")}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium uppercase tracking-wide text-muted">
              {t("phoneLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={SCHOOL_PHONE_TEL}
                className="text-lg font-medium text-primary hover:underline"
              >
                {SCHOOL_PHONE_DISPLAY}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium uppercase tracking-wide text-muted">
              {t("emailLabel")}
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${SCHOOL_EMAIL}`}
                className="text-lg font-medium text-primary hover:underline"
              >
                {SCHOOL_EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium uppercase tracking-wide text-muted">
              {t("hoursTitle")}
            </dt>
            <dd className="mt-1 text-muted">{t("hoursNote")}</dd>
          </div>
        </dl>
      </div>
      <PageNav page="contact" />
    </>
  );
}
