import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PageKey =
  | "about"
  | "school"
  | "contact"
  | "italianCourses"
  | "languageCourses"
  | "exams"
  | "activities";

const pageFlow: Record<
  PageKey,
  { prev?: { href: string; key: PageKey }; next?: { href: string; key: PageKey } }
> = {
  about: { next: { href: "/la-nostra-scuola", key: "school" } },
  school: {
    prev: { href: "/chi-siamo", key: "about" },
    next: { href: "/contatti", key: "contact" },
  },
  contact: { prev: { href: "/la-nostra-scuola", key: "school" } },
  italianCourses: { next: { href: "/corsi-di-lingue", key: "languageCourses" } },
  languageCourses: {
    prev: { href: "/corsi-di-italiano", key: "italianCourses" },
    next: { href: "/esami", key: "exams" },
  },
  exams: { prev: { href: "/corsi-di-lingue", key: "languageCourses" } },
  activities: {},
};

export async function PageNav({ page }: { page: PageKey }) {
  const nav = await getTranslations("nav");
  const { prev, next } = pageFlow[page];

  if (!prev && !next) return null;

  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-border px-4 py-8">
      {prev ? (
        <Link
          href={prev.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          {nav(prev.key)}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {nav(next.key)}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
