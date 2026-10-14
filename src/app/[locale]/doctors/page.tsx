import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DoctorAvatar } from "@/components/content/DoctorAvatar";
import { EntryCard } from "@/components/content/EntryCard";
import { PageHeader } from "@/components/content/PageHeader";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listDoctors } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Doctors", "/doctors");
}

export default async function DoctorsPage() {
  const locale = await currentLocale();
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Doctors" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const doctors = await listDoctors(locale);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container>
          {doctors.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((d) => (
                <li key={d.slug}>
                  <EntryCard
                    headingLevel="h2"
                    title={d.translations[locale]!.name}
                    href={`/doctors/${d.slug}`}
                    media={<DoctorAvatar doctor={d} locale={locale} className="mb-5" />}
                    badges={d.placeholder ? <PlaceholderBadge /> : undefined}
                    footer={tCommon("viewDetails")}
                  >
                    {d.translations[locale]!.role}
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
