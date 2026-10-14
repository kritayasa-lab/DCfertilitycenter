import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { isLocale, type Locale } from "./routing";

/**
 * The validated locale of the current route (Server Components only).
 * Unsupported values 404 instead of falling back to another language.
 */
export async function currentLocale(): Promise<Locale> {
  const locale = await rootLocale();
  if (!isLocale(locale)) notFound();
  return locale;
}
