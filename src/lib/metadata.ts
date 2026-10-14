import type { Metadata } from "next";
import { htmlLang, locales, defaultLocale, type Locale } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a path that exists in every locale.
 * `path` is the locale-less path, e.g. "" for home or "/about".
 *
 * Content pages with partial translations (Phase 2+) must pass only the
 * locales that actually have a published translation.
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
