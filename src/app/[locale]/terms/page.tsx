import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/content/LegalPage";
import { currentLocale } from "@/i18n/server";
import { legalMetadata } from "@/lib/legal-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await currentLocale(), "terms", "/terms");
}

const sectionKeys = ["acceptance", "information", "inquiries", "intellectualProperty", "liability", "changes", "law"] as const;

export default async function TermsPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Legal" });
  return (
    <LegalPage
      locale={locale}
      title={t("terms")}
      sections={sectionKeys.map((key) => ({ id: key, heading: t(`termsSections.${key}`), body: null }))}
    />
  );
}
