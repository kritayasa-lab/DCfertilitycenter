import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "./metadata";

export async function legalMetadata(
  locale: Locale,
  key: "privacy" | "terms" | "medicalDisclaimer" | "cookies",
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Legal" });
  return buildMetadata({ locale, path, title: t(key), description: t("draftNotice") });
}
