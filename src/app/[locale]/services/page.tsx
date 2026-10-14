import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { EntryCard } from "@/components/content/EntryCard";
import { PageHeader } from "@/components/content/PageHeader";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listServices } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Services", "/services");
}

export default async function ServicesPage() {
  const locale = await currentLocale();
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Services" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const services = await listServices(locale);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container>
          {services.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <EntryCard
                    headingLevel="h2"
                    title={s.translations[locale]!.title}
                    href={`/services/${s.slug}`}
                    badges={s.placeholder ? <PlaceholderBadge /> : undefined}
                    footer={tCommon("viewDetails")}
                  >
                    {s.translations[locale]!.summary}
                  </EntryCard>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
