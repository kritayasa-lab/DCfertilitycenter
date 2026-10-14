import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntryCard } from "@/components/content/EntryCard";
import { PackageMeta } from "@/components/content/PackageMeta";
import { PageHeader } from "@/components/content/PageHeader";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listActivePackages } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Packages", "/packages");
}

export default async function PackagesPage() {
  const locale = await currentLocale();
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Packages" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const packages = await listActivePackages(locale);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container>
          {packages.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <li key={p.slug}>
                  <EntryCard
                    headingLevel="h2"
                    title={p.translations[locale]!.title}
                    href={`/packages/${p.slug}`}
                    badges={p.placeholder ? <PlaceholderBadge /> : undefined}
                    footer={tCommon("viewDetails")}
                  >
                    <PackageMeta pkg={p} />
                  </EntryCard>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </main>
  );
}
