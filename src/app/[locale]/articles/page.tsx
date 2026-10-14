import type { Metadata } from "next";
import { Suspense } from "react";
import { getFormatter, getTranslations } from "next-intl/server";
import { EntryCard } from "@/components/content/EntryCard";
import { PageHeader } from "@/components/content/PageHeader";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listArticles } from "@/content/queries";
import { articleCategories, type ArticleCategory } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Articles", "/articles");
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseFilters(params: Awaited<SearchParams>) {
  const raw = typeof params.category === "string" ? params.category : undefined;
  const category = articleCategories.includes(raw as ArticleCategory) ? (raw as ArticleCategory) : undefined;
  // Bound the search term length; it is only used for in-memory matching.
  const query = typeof params.q === "string" ? params.q.slice(0, 100) : undefined;
  return { category, query };
}

async function ArticleResults({ locale, searchParams }: { locale: Locale; searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  return <ArticleList locale={locale} filters={filters} />;
}

async function ArticleList({
  locale,
  filters,
}: {
  locale: Locale;
  filters: { category?: ArticleCategory; query?: string };
}) {
  const [t, tCommon, format] = await Promise.all([
    getTranslations({ locale, namespace: "Articles" }),
    getTranslations({ locale, namespace: "Common" }),
    getFormatter({ locale }),
  ]);
  const articles = await listArticles(locale, filters);

  return (
    <>
      <form role="search" method="get" className="mb-10 grid gap-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-[1fr_14rem_auto] sm:items-end">
        <div>
          <label htmlFor="article-q" className="block text-sm font-medium">{t("searchLabel")}</label>
          <input
            id="article-q"
            name="q"
            type="search"
            maxLength={100}
            defaultValue={filters.query ?? ""}
            placeholder={t("searchPlaceholder")}
            className="mt-2 min-h-11 w-full rounded-md border border-border-strong bg-surface px-3"
          />
        </div>
        <div>
          <label htmlFor="article-category" className="block text-sm font-medium">{t("categoryLabel")}</label>
          <select
            id="article-category"
            name="category"
            defaultValue={filters.category ?? ""}
            className="mt-2 min-h-11 w-full rounded-md border border-border-strong bg-surface px-3"
          >
            <option value="">{t("allCategories")}</option>
            {articleCategories.map((c) => (
              <option key={c} value={c}>{t(`categories.${c}`)}</option>
            ))}
          </select>
        </div>
        <Button type="submit">{t("searchButton")}</Button>
      </form>

      <p role="status" className="mb-6 text-sm text-muted">
        {t("resultCount", { count: articles.length })}
      </p>

      {articles.length === 0 ? (
        <p className="text-muted">{t("empty")}</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const content = a.translations[locale]!;
            return (
              <li key={a.slug}>
                <EntryCard
                  headingLevel="h2"
                  title={content.title}
                  href={`/articles/${a.slug}`}
                  badges={
                    <>
                      <Badge tone="primary">{t(`categories.${a.category}`)}</Badge>
                      {a.placeholder && <PlaceholderBadge />}
                      {a.medicalReview.required && a.medicalReview.status !== "reviewed" && (
                        <Badge tone="accent">{t("medicalReviewPending")}</Badge>
                      )}
                    </>
                  }
                  footer={tCommon("readMore")}
                >
                  <p>{content.excerpt}</p>
                  <p className="mt-2 text-xs">
                    {t("publishedOn", {
                      date: format.dateTime(new Date(`${a.publishedAt}T00:00:00+07:00`), {
                        dateStyle: "medium",
                        timeZone: "Asia/Bangkok",
                      }),
                    })}
                  </p>
                </EntryCard>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default async function ArticlesPage(props: PageProps<"/[locale]/articles">) {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Articles" });

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container>
          {/* The unfiltered list is prerendered; filters apply per request. */}
          <Suspense fallback={<ArticleList locale={locale} filters={{}} />}>
            <ArticleResults locale={locale} searchParams={props.searchParams} />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}
