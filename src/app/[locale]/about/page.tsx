import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "About", "/about");
}

export default async function AboutPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-3">
          <section aria-labelledby="philosophy">
            <h2 id="philosophy" className="text-2xl">{t("philosophyHeading")}</h2>
            <div className="mt-4"><PendingBlock /></div>
          </section>
          <section aria-labelledby="team">
            <h2 id="team" className="text-2xl">{t("teamHeading")}</h2>
            <div className="mt-4"><PendingBlock /></div>
            <ButtonLink href="/doctors" variant="secondary" className="mt-5">
              {t("teamLink")}
            </ButtonLink>
          </section>
          <section aria-labelledby="standards">
            <h2 id="standards" className="text-2xl">{t("standardsHeading")}</h2>
            <p className="mt-4 text-sm text-muted">{t("standardsBody")}</p>
          </section>
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
