import { locales, type Locale } from "@/i18n/routing";
import type { BaseRecord, Package } from "./types";

/** Locales in which a record has a translation. */
export function availableLocales<T>(record: BaseRecord<T>): Locale[] {
  return locales.filter((locale) => record.translations[locale] !== undefined);
}

/**
 * The record's content in exactly the requested locale, or null.
 * Never falls back to another language.
 */
export function localize<T>(record: BaseRecord<T>, locale: Locale) {
  return record.translations[locale] ?? null;
}

/** Published records that have a translation in `locale`, in display order. */
export function publishedIn<R extends BaseRecord<unknown>>(records: R[], locale: Locale): R[] {
  return records
    .filter((record) => record.published && record.translations[locale] !== undefined)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Today's date (YYYY-MM-DD) in the clinic's time zone. */
export function clinicToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(now);
}

/**
 * A package is active when published and `today` is inside its validity
 * window (inclusive). Missing bounds are treated as open-ended.
 */
export function isPackageActive(pkg: Package, today: string): boolean {
  if (!pkg.published) return false;
  if (pkg.validFrom && today < pkg.validFrom) return false;
  if (pkg.validUntil && today > pkg.validUntil) return false;
  return true;
}
