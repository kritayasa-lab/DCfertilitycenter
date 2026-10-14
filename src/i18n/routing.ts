import { defineRouting } from "next-intl/routing";

export const locales = ["th", "en", "zh-CN"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "th";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Every public URL carries its locale: /th, /en, /zh-CN.
  localePrefix: "always",
  // `/` always resolves to the default locale (/th) rather than guessing from
  // Accept-Language, as approved for this project.
  localeDetection: false,
});

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** BCP 47 tag for the `<html lang>` attribute and `hreflang` links. */
export const htmlLang: Record<Locale, string> = {
  th: "th",
  en: "en",
  "zh-CN": "zh-CN",
};

/** Open Graph locale identifiers. */
export const ogLocale: Record<Locale, string> = {
  th: "th_TH",
  en: "en_US",
  "zh-CN": "zh_CN",
};
