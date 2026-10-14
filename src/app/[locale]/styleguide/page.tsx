import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { PendingValue } from "@/components/ui/PendingValue";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Styleguide" });
  // Internal reference page: never indexed, regardless of launch state.
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

const swatches = [
  ["background", "bg-background"],
  ["surface", "bg-surface"],
  ["surface-muted", "bg-surface-muted"],
  ["surface-accent", "bg-surface-accent"],
  ["primary", "bg-primary"],
  ["primary-soft", "bg-primary-soft"],
  ["accent", "bg-accent"],
  ["accent-strong", "bg-accent-strong"],
  ["border", "bg-border"],
  ["foreground", "bg-foreground"],
  ["muted", "bg-muted"],
] as const;

export default async function StyleguidePage() {
  const t = await getTranslations("Styleguide");

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <Section tone="muted" className="py-12 sm:py-14">
        <Container className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl">{t("title")}</h1>
            <p className="mt-3 max-w-prose text-muted">{t("intro")}</p>
          </div>
          <LanguageSwitcher />
        </Container>
      </Section>

      <Section>
        <Container className="space-y-14">
          <div>
            <h2 className="text-2xl">{t("colors")}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {swatches.map(([name, cls]) => (
                <li key={name} className="text-sm">
                  <div className={`h-16 rounded-md border border-border ${cls}`} />
                  <code className="mt-2 block text-muted">{name}</code>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl">{t("typography")}</h2>
            <div className="mt-6 space-y-3">
              <p className="font-display text-5xl">{t("sampleHeading")}</p>
              <p className="font-display text-3xl">{t("sampleHeading")}</p>
              <p className="max-w-prose text-lg">{t("sampleBody")}</p>
              <p className="max-w-prose text-sm text-muted">{t("sampleBody")}</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl">{t("buttons")}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>{t("primary")}</Button>
              <Button variant="secondary">{t("secondary")}</Button>
              <Button variant="ghost">{t("ghost")}</Button>
              <Button disabled>{t("disabled")}</Button>
              <Button size="lg">{t("primary")}</Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl">{t("badges")}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge>neutral</Badge>
              <Badge tone="primary">primary</Badge>
              <Badge tone="accent">accent</Badge>
              <Badge tone="warning">warning</Badge>
            </div>
          </div>

          <div>
            <h2 className="text-2xl">{t("cards")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <h3 className="text-xl">{t("sampleCardTitle")}</h3>
                <p className="mt-2 text-sm text-muted">{t("sampleCardBody")}</p>
              </Card>
              <Card>
                <h3 className="text-xl">
                  <PendingValue entry={siteConfig.contact.email} label="Email" />
                </h3>
                <p className="mt-2 text-sm text-muted">
                  <PendingValue entry={siteConfig.contact.openingHours} label="Opening hours" />
                </p>
              </Card>
            </div>
          </div>

          <div>
            <h2 className="text-2xl">{t("notices")}</h2>
            <div className="mt-6 grid gap-3">
              <Notice tone="info">info</Notice>
              <Notice tone="success">success</Notice>
              <Notice tone="warning">warning</Notice>
              <Notice tone="danger">danger</Notice>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
