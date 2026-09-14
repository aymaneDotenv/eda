import { getTranslations } from "next-intl/server";
import {
  ENROLLMENT_BOOKING_URL,
  isEnrollmentBookingActive,
  PRESS_ARTICLE_URL,
  SCHOOL_PHONE_DISPLAY,
  SCHOOL_PHONE_TEL,
} from "@/lib/site";
import { AlertTriangle, Calendar, PartyPopper, Newspaper, ExternalLink } from "lucide-react";

export async function NewsSection() {
  const t = await getTranslations("news");
  const home = await getTranslations("home");
  const bookingActive = isEnrollmentBookingActive();

  const items = [
    {
      icon: AlertTriangle,
      color: "border-amber-200 bg-amber-50",
      iconColor: "text-amber-600",
      badge: t("enrollment.badge"),
      title: t("enrollment.title"),
      body: t("enrollment.body"),
      externalHref: bookingActive ? ENROLLMENT_BOOKING_URL : undefined,
      externalLabel: bookingActive ? t("enrollment.linkLabel") : undefined,
    },
    {
      icon: Calendar,
      color: "border-blue-200 bg-blue-50",
      iconColor: "text-blue-600",
      title: t("cilsOct.title"),
      subtitle: t("cilsOct.level"),
      body: t("cilsOct.body"),
      phone: true,
    },
    {
      icon: Calendar,
      color: "border-blue-200 bg-blue-50",
      iconColor: "text-blue-600",
      title: t("cilsDec.title"),
      subtitle: t("cilsDec.levels"),
      body: t("cilsDec.body"),
      phone: true,
    },
    {
      icon: PartyPopper,
      color: "border-green-200 bg-green-50",
      iconColor: "text-green-600",
      title: t("closing.title"),
      body: t("closing.body"),
    },
    {
      icon: Newspaper,
      color: "border-slate-200 bg-slate-50",
      iconColor: "text-slate-600",
      title: t("press.title"),
      body: t("press.body"),
      externalHref: PRESS_ARTICLE_URL,
      externalLabel: t("press.readArticle"),
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {home("newsTitle")}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.title}
              className={`rounded-2xl border p-6 ${item.color}`}
            >
              <div className="flex items-start gap-3">
                <item.icon className={`mt-0.5 h-5 w-5 shrink-0 ${item.iconColor}`} />
                <div className="min-w-0">
                  {item.badge && (
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="mt-1 font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="mt-1 text-sm font-medium text-muted">
                      {item.subtitle}
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {item.body}
                  </p>
                  {item.phone && (
                    <p className="mt-3 text-sm">
                      <a
                        href={SCHOOL_PHONE_TEL}
                        className="font-semibold text-primary hover:underline"
                      >
                        {SCHOOL_PHONE_DISPLAY}
                      </a>
                    </p>
                  )}
                  {item.externalHref && item.externalLabel && (
                    <a
                      href={item.externalHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {item.externalLabel}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
