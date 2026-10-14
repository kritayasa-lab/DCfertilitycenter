import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/content/LegalPage";
import { currentLocale } from "@/i18n/server";
import { legalMetadata } from "@/lib/legal-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await currentLocale(), "cookies", "/cookies");
}

export default async function CookiesPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Legal" });
  return (
    <LegalPage
      locale={locale}
      title={t("cookies")}
      sections={[
        { id: "what", heading: t("cookieSections.what"), body: null },
        { id: "used", heading: t("cookieSections.used"), body: <p>{t("cookieBody.used")}</p> },
        { id: "choices", heading: t("cookieSections.choices"), body: null },
      ]}
    />
  );
}
