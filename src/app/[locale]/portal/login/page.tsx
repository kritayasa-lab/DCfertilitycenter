import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { currentLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Portal" });
  return { title: t("loginMetaTitle"), robots: { index: false, follow: false } };
}

// Placeholder entry point only. Authentication is implemented in Phase 3/5.
export default async function PatientLoginPlaceholder() {
  const locale = await currentLocale();
  const [t, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "Portal" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);
  return (
    <main id={MAIN_CONTENT_ID} className="flex flex-1 items-center py-20">
      <Container width="prose">
        <h1 className="text-4xl">{t("loginTitle")}</h1>
        <Notice tone="info" role="note" className="mt-6">{t("loginUnavailable")}</Notice>
        <p className="mt-6 text-muted">{t("contactInstead")}</p>
        <ButtonLink href="/contact" className="mt-6">{tNav("contactCta")}</ButtonLink>
      </Container>
    </main>
  );
}
