import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { Prose } from "@/components/content/Prose";
import { TranslationUnavailable } from "@/components/content/TranslationUnavailable";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Section";
import { availableLocales, localize } from "@/content/localize";
import { articleSlugs, getArticle } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return articleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) return {};
  const content = localize(article, locale);
  if (!content) {
    const t = await getTranslations({ locale, namespace: "TranslationUnavailable" });
    return { title: t("metaTitle"), robots: { index: false, follow: false } };
  }
  return buildMetadata({
    locale,
    path: `/articles/${slug}`,
    title: content.title,
    description: content.excerpt ?? undefined,
    availableLocales: availableLocales(article),
  });
}

export default async function ArticlePage(props: PageProps<"/[locale]/articles/[slug]">) {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const content = localize(article, locale);
  if (!content) {
    return (
      <TranslationUnavailable locale={locale} path={`/articles/${slug}`} available={availableLocales(article)} />
    );
  }
  const [t, format] = await Promise.all([
    getTranslations({ locale, namespace: "Articles" }),
    getFormatter({ locale }),
  ]);
  const reviewed = article.medicalReview.status === "reviewed";

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={content.title}
        intro={content.excerpt ?? undefined}
        breadcrumbs={[{ label: t("title"), href: "/articles" }, { label: content.title }]}
        badges={
          <>
            <Badge tone="primary">{t(`categories.${article.category}`)}</Badge>
            {article.placeholder && <PlaceholderBadge />}
            {article.medicalReview.required && (
              <Badge tone={reviewed ? "primary" : "accent"}>
                {reviewed ? t("medicalReviewed") : t("medicalReviewPending")}
              </Badge>
            )}
          </>
        }
      >
        <p className="mt-4 text-sm text-muted">
          {t("publishedOn", {
            date: format.dateTime(new Date(`${article.publishedAt}T00:00:00+07:00`), {
              dateStyle: "long",
              timeZone: "Asia/Bangkok",
            }),
          })}
        </p>
      </PageHeader>
      <Section>
        <Container width="prose" className="space-y-8">
          {article.medicalReview.required && <Notice tone="info" role="note">{t("generalInfoNotice")}</Notice>}
          {content.body ? (
            <Prose>
              {content.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Prose>
          ) : (
            <PendingBlock />
          )}
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
