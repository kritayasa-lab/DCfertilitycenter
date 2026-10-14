import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { DevelopmentBanner } from "@/components/DevelopmentBanner";
import { SkipLink } from "@/components/SkipLink";
import { allowIndexing, displayValue, siteConfig } from "@/config/site";
import { htmlLang, isLocale, locales, ogLocale } from "@/i18n/routing";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await rootLocale();
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const siteName = displayValue(siteConfig.name) ?? "[Clinic Name]";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      template: t("titleTemplate", { siteName }),
      default: `${t("defaultTitle")} | ${siteName}`,
    },
    description: t("description"),
    applicationName: siteName,
    openGraph: {
      siteName,
      locale: ogLocale[locale],
      type: "website",
    },
    // Keep the site out of search indexes until launch is approved.
    robots: allowIndexing ? undefined : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  // Only the configured locales are valid; anything else is a 404.
  const locale = await rootLocale();
  if (!isLocale(locale)) notFound();

  return (
    <html lang={htmlLang[locale]} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <SkipLink />
          <DevelopmentBanner />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
