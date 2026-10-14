import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ContactSection } from "@/components/home/sections/ContactSection";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Contact", "/contact");
}

export default async function ContactPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Contact" });
  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <div className="bg-surface-muted">
        <Container className="pt-10">
          <Breadcrumbs items={[{ label: t("title") }]} />
        </Container>
      </div>
      <ContactSection locale={locale} headingLevel="h1" />
    </main>
  );
}
