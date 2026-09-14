import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { PageNav } from "@/components/PageNav";
import {
  ENROLLMENT_BOOKING_URL,
  isEnrollmentBookingActive,
  SCHOOL_EMAIL,
  SCHOOL_PHONE_DISPLAY,
  SCHOOL_PHONE_TEL,
} from "@/lib/site";
import { ExternalLink } from "lucide-react";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");
  const bookingActive = isEnrollmentBookingActive();

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-muted">{t("intro")}</p>

        {bookingActive ? (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <p className="text-sm text-muted">{t("activeNote")}</p>
            <a
              href={ENROLLMENT_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {t("externalCta")}
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-6 text-sm text-muted">{t("documentsNote")}</p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-8">
            <p className="font-medium text-amber-900">{t("comingSoon")}</p>
            <p className="mt-2 text-sm text-amber-800">{t("comingSoonBody")}</p>
            <p className="mt-4 text-sm">
              {t("callOffice")}:{" "}
              <a href={SCHOOL_PHONE_TEL} className="font-semibold text-primary">
                {SCHOOL_PHONE_DISPLAY}
              </a>
            </p>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted">
          <p>
            {t("emailLabel")}:{" "}
            <a href={`mailto:${SCHOOL_EMAIL}`} className="text-primary hover:underline">
              {SCHOOL_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
