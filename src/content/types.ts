import type { Locale } from "@/i18n/routing";

/**
 * Typed content model for public pages.
 *
 * Phase 2 serves these from local placeholder fixtures (`src/content/fixtures`).
 * In Phase 4 the same shapes are loaded from the CMS (base record + one
 * translation row per locale), so pages do not change when the source does.
 */

/** Per-locale content. A missing key means "no translation for this locale". */
export type Localized<T> = Partial<Record<Locale, T>>;

/** `null` marks a field whose approved copy has not been supplied yet. */
export type Pending<T> = T | null;

export type TranslationStatus = "draft" | "in_review" | "approved";

export interface TranslationMeta {
  status: TranslationStatus;
}

export interface BaseRecord<T> {
  slug: string;
  /** Unpublished records never appear on the public site. */
  published: boolean;
  /** True for development placeholders; rendered with a visible label. */
  placeholder: boolean;
  sortOrder: number;
  translations: Localized<T & TranslationMeta>;
}

export interface FaqItem {
  question: string;
  answer: Pending<string>;
}

export interface ServiceContent {
  title: string;
  summary: Pending<string>;
  introduction: Pending<string>;
  /** Who the service may be suitable for (approved medical wording only). */
  suitability: Pending<string>;
  processSteps: Pending<string[]>;
  preparation: Pending<string>;
  faqs: FaqItem[];
}
export type Service = BaseRecord<ServiceContent>;

export interface DoctorContent {
  name: string;
  role: Pending<string>;
  qualifications: Pending<string[]>;
  expertise: Pending<string[]>;
  biography: Pending<string>;
}
export interface Doctor extends BaseRecord<DoctorContent> {
  /** Authorized photograph only; null until supplied. */
  photo: Pending<{ src: string; width: number; height: number }>;
  /** Alt text per locale for the photograph. */
  photoAlt?: Localized<string>;
}

export interface FacilityContent {
  title: string;
  description: Pending<string>;
}
export type Facility = BaseRecord<FacilityContent>;

export interface PackageContent {
  title: string;
  description: Pending<string>;
  inclusions: Pending<string[]>;
  exclusions: Pending<string[]>;
  terms: Pending<string>;
}
export interface Package extends BaseRecord<PackageContent> {
  /** Approved price only. `null` means "price not published". */
  price: Pending<{ amount: number; currency: "THB" }>;
  /** ISO dates (inclusive). Outside this window the package is not shown. */
  validFrom: Pending<string>;
  validUntil: Pending<string>;
}

export interface ArticleContent {
  title: string;
  excerpt: Pending<string>;
  body: Pending<string[]>;
}
export interface Article extends BaseRecord<ArticleContent> {
  category: ArticleCategory;
  publishedAt: string;
  /** Articles with medical information require clinical review before publication. */
  medicalReview: { required: boolean; status: "pending" | "reviewed"; reviewedAt: Pending<string> };
}

export const articleCategories = ["fertility-basics", "treatment-journey", "clinic-news"] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export type Faq = BaseRecord<FaqItem> & { topic: "general" | "contact" | "services" };
