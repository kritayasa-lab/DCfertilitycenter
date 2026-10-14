import { getTranslations } from "next-intl/server";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { listArticles } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "../SectionHeading";

/** Section 6: the two most recent articles (placeholders until approved copy exists). */
export async function QaSection({ locale }: { locale: Locale }) {
  const [t, tArticles] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Articles" }),
  ]);
  const articles = (await listArticles(locale)).slice(0, 2);

  return (
    <section aria-labelledby="qa-heading" className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="qa-heading"
          eyebrow={t("qaEyebrow")}
          title={t("qaHeading")}
          intro={t("qaIntro")}
          action={<ButtonLink href="/articles" variant="secondary">{t("allArticles")}</ButtonLink>}
        />
        <ul className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <li key={a.slug}>
              <article className="relative flex h-full flex-col rounded-2xl border border-border bg-surface p-7 shadow-soft transition-shadow focus-within:shadow-raised hover:shadow-raised">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="primary">{tArticles(`categories.${a.category}`)}</Badge>
                  {a.placeholder && <PlaceholderBadge />}
                  {a.medicalReview.required && a.medicalReview.status !== "reviewed" && (
                    <Badge tone="accent">{tArticles("medicalReviewPending")}</Badge>
                  )}
                </div>
                <h3 className="mt-5 flex-1 text-xl leading-snug">
                  <Link href={`/articles/${a.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
                    {a.translations[locale]!.title}
                  </Link>
                </h3>
                <p className="mt-5 text-sm font-medium text-primary">{t("readArticle")} →</p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
