import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { clinicName } from "@/config/site";
import { htmlLang, locales, defaultLocale, ogLocale, type Locale } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a locale-less `path` ("" for home).
 * Pass `availableLocales` for content that is not translated into every
 * locale, so alternates only point at pages that actually exist.
 */
export function localeAlternates(
  locale: Locale,
  path: string,
  availableLocales: readonly Locale[] = locales,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[htmlLang[l]] = `/${l}${path}`;
  }
  if (availableLocales.includes(defaultLocale)) {
    languages["x-default"] = `/${defaultLocale}${path}`;
  }
  return { canonical: `/${locale}${path}`, languages };
}

export function siteName(locale: Locale): string {
  return clinicName(locale);
}

/**
 * Standard page metadata: localized title/description, canonical, hreflang
 * alternates and Open Graph. Titles go through the layout's title template.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  availableLocales = locales,
  noindex = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description?: string;
  availableLocales?: readonly Locale[];
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: localeAlternates(locale, path, availableLocales),
    openGraph: {
      title: `${title} | ${siteName(locale)}`,
      description,
      url: `/${locale}${path}`,
      siteName: siteName(locale),
      locale: ogLocale[locale],
      alternateLocale: availableLocales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      type: "website",
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Metadata for a static page whose strings live in `<namespace>.metaTitle/metaDescription`. */
export async function staticPageMetadata(
  locale: Locale,
  namespace:
    | "About"
    | "Services"
    | "Doctors"
    | "Facilities"
    | "Packages"
    | "Articles"
    | "Faq"
    | "Contact",
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  return buildMetadata({
    locale,
    path,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}
