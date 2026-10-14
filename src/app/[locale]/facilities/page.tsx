import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { EntryCard } from "@/components/content/EntryCard";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listFacilities } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Facilities", "/facilities");
}

export default async function FacilitiesPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Facilities" });
  const facilities = await listFacilities(locale);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container>
          {facilities.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((f) => (
                <li key={f.slug}>
                  <EntryCard
                    headingLevel="h2"
                    title={f.translations[locale]!.title}
                    badges={f.placeholder ? <PlaceholderBadge /> : undefined}
                  >
                    {f.translations[locale]!.description ?? <PendingBlock />}
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
