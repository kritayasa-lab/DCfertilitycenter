/**
 * Central clinic configuration.
 *
 * Every clinic fact lives here (and, from Phase 4, in the CMS `site_settings`
 * record) so that Header, Footer, Contact and metadata never hardcode details.
 *
 * IMPORTANT: Nothing in this file has been verified by the clinic. A value is
 * only rendered as a fact when its `status` is "verified". Unverified values
 * render as clearly marked placeholders instead. Do not fill in a value
 * (address, phone, hours, etc.) unless the clinic has supplied it.
 */

export type VerificationStatus = "verified" | "provisional" | "pending";

export interface ConfigValue<T> {
  value: T | null;
  status: VerificationStatus;
}

export interface SiteConfig {
  /** Working name approved for development only. */
  name: ConfigValue<string>;
  /** Short name / monogram used for the text-based placeholder logo. */
  shortName: ConfigValue<string>;
  /** Public production URL. */
  url: string;
  contact: {
    phone: ConfigValue<string>;
    email: ConfigValue<string>;
    lineId: ConfigValue<string>;
    address: ConfigValue<string>;
    openingHours: ConfigValue<string>;
    mapUrl: ConfigValue<string>;
  };
  social: {
    facebook: ConfigValue<string>;
    line: ConfigValue<string>;
    instagram: ConfigValue<string>;
  };
}

const pending = <T>(): ConfigValue<T> => ({ value: null, status: "pending" });

export const siteConfig: SiteConfig = {
  name: { value: "DC Fertility Center Hatyai", status: "provisional" },
  shortName: { value: "DC", status: "provisional" },
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  contact: {
    phone: pending(),
    email: pending(),
    lineId: pending(),
    address: pending(),
    openingHours: pending(),
    mapUrl: pending(),
  },
  social: {
    facebook: pending(),
    line: pending(),
    instagram: pending(),
  },
};

/**
 * Returns the value only when the clinic has verified it. Use this for any
 * value presented to visitors as a fact (contact links, structured data).
 */
export function verifiedValue<T>(entry: ConfigValue<T>): T | null {
  return entry.status === "verified" ? entry.value : null;
}

/**
 * Returns the value when it is verified or explicitly approved as provisional
 * (e.g. the working clinic name). Callers must display provisional values
 * with a visible indication where they could be mistaken for verified facts.
 */
export function displayValue<T>(entry: ConfigValue<T>): T | null {
  return entry.status === "pending" ? null : entry.value;
}

/** Whether search engines may index the site. Off until launch is approved. */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
