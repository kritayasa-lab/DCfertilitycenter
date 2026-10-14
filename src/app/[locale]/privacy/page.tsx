import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/content/LegalPage";
import { currentLocale } from "@/i18n/server";
import { legalMetadata } from "@/lib/legal-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await currentLocale(), "privacy", "/privacy");
}

const sectionKeys = [
  "controller",
  "collected",
  "purposes",
  "legalBasis",
  "sharing",
  "crossBorder",
  "retention",
  "rights",
  "security",
  "contact",
] as const;

export default async function PrivacyPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Legal" });
  return (
    <LegalPage
      locale={locale}
      title={t("privacy")}
      sections={sectionKeys.map((key) => ({ id: key, heading: t(`privacySections.${key}`), body: null }))}
    />
  );
}
