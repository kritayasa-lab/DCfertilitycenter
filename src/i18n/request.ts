import { getRequestConfig } from "next-intl/server";
import { locale as rootLocale } from "next/root-params";
import { defaultLocale, isLocale } from "./routing";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  // An explicit locale (e.g. getTranslations({ locale }) in a Server Action,
  // where root params are unavailable) takes precedence over the URL segment.
  const candidate = explicitLocale ?? (await rootLocale());
  const locale = isLocale(candidate) ? candidate : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
