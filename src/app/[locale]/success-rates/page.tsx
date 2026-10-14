import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/content/PageHeader";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Section";
import { currentLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "SuccessRates" });
  // Draft destination: never indexed until verified data is published.
  return buildMetadata({ locale, path: "/success-rates", title: t("metaTitle"), noindex: true });
}

/**
 * Honest placeholder for the "success rates" button. No figures are shown
 * until the clinic supplies verified data with methodology and medical review.
 */
export default async function SuccessRatesPage() {
  const locale = await currentLocale();
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "SuccessRates" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={t("title")}
        breadcrumbs={[{ label: t("title") }]}
        badges={<Badge tone="warning">{tCommon("draftBadge")}</Badge>}
      />
      <Section>
        <Container width="prose" className="space-y-6">
          <Notice tone="warning" role="note">{t("notPublished")}</Notice>
          <p className="text-muted">{t("body")}</p>
          <ButtonLink href="/contact">{t("contactCta")}</ButtonLink>
        </Container>
      </Section>
    </main>
  );
}
