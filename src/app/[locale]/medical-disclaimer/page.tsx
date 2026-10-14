import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/content/LegalPage";
import { currentLocale } from "@/i18n/server";
import { legalMetadata } from "@/lib/legal-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(await currentLocale(), "medicalDisclaimer", "/medical-disclaimer");
}

const sectionKeys = ["general", "noRelationship", "outcomes", "emergency"] as const;

export default async function MedicalDisclaimerPage() {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Legal" });
  return (
    <LegalPage
      locale={locale}
      title={t("medicalDisclaimer")}
      sections={sectionKeys.map((key) => ({
        id: key,
        heading: t(`disclaimerSections.${key}`),
        // Draft wording; requires legal and clinical review before launch.
        body: <p>{t(`disclaimerBody.${key}`)}</p>,
      }))}
    />
  );
}
