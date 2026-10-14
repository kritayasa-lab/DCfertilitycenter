import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { FaqList } from "@/components/content/FaqList";
import { PageHeader } from "@/components/content/PageHeader";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { listFaqs } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Faq", "/faq");
}

export default async function FaqPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Faq" });
  const faqs = await listFaqs(locale);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container width="prose">
          {faqs.length === 0 ? (
            <p className="text-muted">{t("empty")}</p>
          ) : (
            <FaqList items={faqs.map((f) => f.translations[locale]!)} />
          )}
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
