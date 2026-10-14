/**
 * Central clinic configuration: the single source of clinic facts for the
 * Header, Footer, Contact sections, metadata and the sitemap. Phase 4 moves
 * these values into the CMS `site_settings` record (docs/ADMIN_CMS_REQUIREMENTS.md).
 *
 * Status meanings:
 *  - "verified":    confirmed for publication by the clinic.
 *  - "provided":    supplied by the clinic owner for this build; shown as fact,
 *                   still awaiting final pre-launch sign-off.
 *  - "provisional": approved for development only; shown with care.
 *  - "pending":     not supplied. Rendered as a labelled placeholder, never invented.
 */
import type { Locale } from "@/i18n/routing";

export type VerificationStatus = "verified" | "provided" | "provisional" | "pending";

export interface ConfigValue<T> {
  value: T | null;
  status: VerificationStatus;
}

export interface SiteConfig {
  /** Clinic display name per locale (provisional branding). */
  name: ConfigValue<Record<Locale, string>>;
  url: string;
  contact: {
    /** Phone numbers as supplied, in display format. */
    phones: ConfigValue<string[]>;
    email: ConfigValue<string>;
    lineId: ConfigValue<string>;
    /** Address as supplied (Thai only; not machine-translated). */
    address: ConfigValue<string>;
    openingHours: ConfigValue<string>;
    /** Google Maps link supplied by the clinic (opened directly, never parsed). */
    mapUrl: ConfigValue<string>;
  };
  social: {
    instagram: ConfigValue<string>;
    tiktok: ConfigValue<string>;
    facebook: ConfigValue<string>;
  };
}

const pending = <T>(): ConfigValue<T> => ({ value: null, status: "pending" });

export const siteConfig: SiteConfig = {
  name: {
    value: { th: "คลินิกหมอชัยณรงค์", en: "DC Fertility Center", "zh-CN": "DC Fertility Center" },
    status: "provisional",
  },
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  contact: {
    phones: { value: ["097-3470648", "074-225-223"], status: "provided" },
    email: pending(),
    lineId: pending(),
    address: { value: "97/12 ถนนราษฎร์ยินดี อำเภอหาดใหญ่ จังหวัดสงขลา 90110", status: "provided" },
    openingHours: pending(),
    mapUrl: { value: "https://maps.app.goo.gl/63SiK2gmrM4EtzH49", status: "provided" },
  },
  social: {
    instagram: pending(),
    tiktok: pending(),
    facebook: pending(),
  },
};

/** Value if it may be presented as a fact (verified or supplied by the clinic). */
export function verifiedValue<T>(entry: ConfigValue<T>): T | null {
  return entry.status === "verified" || entry.status === "provided" ? entry.value : null;
}

/** Value if it may be displayed at all (anything but pending). */
export function displayValue<T>(entry: ConfigValue<T>): T | null {
  return entry.status === "pending" ? null : entry.value;
}

/** The clinic's display name in `locale`. */
export function clinicName(locale: Locale): string {
  return displayValue(siteConfig.name)?.[locale] ?? "[Clinic Name]";
}

/** `tel:` href for a displayed phone number (digits only, Thai country code). */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `tel:+66${digits.replace(/^0/, "")}`;
}

/** Whether search engines may index the site. Off until launch is approved. */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
