import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PendingValue } from "@/components/ui/PendingValue";
import { displayValue, siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Home" });
  const siteName = displayValue(siteConfig.name) ?? "[Clinic Name]";
  return {
    // The layout's title template only applies to child segments.
    title: { absolute: `${t("metaTitle")} | ${siteName}` },
    alternates: localeAlternates(locale, ""),
  };
}

// Phase 1 foundation preview. The full homepage is built in Phase 2.
export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <Container className="flex items-center justify-between py-5">
        <p className="font-display text-xl text-primary">
          <PendingValue entry={siteConfig.name} label="Clinic Name" />
        </p>
        <LanguageSwitcher />
      </Container>

      <Section tone="accent">
        <Container width="prose" className="text-center">
          <Badge tone="primary">{t("eyebrow")}</Badge>
          <h1 className="mt-5 text-4xl text-foreground sm:text-5xl">{t("title")}</h1>
          <p className="mt-6 text-lg text-muted">{t("intro")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <span
              aria-disabled="true"
              className="inline-flex min-h-12 items-center rounded-pill border border-dashed border-border-strong px-6 text-sm text-muted"
            >
              {t("primaryCtaPending")}
            </span>
            <ButtonLink href="/styleguide" variant="secondary" size="lg">
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
