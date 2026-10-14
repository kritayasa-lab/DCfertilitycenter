import { cacheLife } from "next/cache";
import type { Locale } from "@/i18n/routing";
import { articles } from "./fixtures/articles";
import { doctors } from "./fixtures/doctors";
import { facilities } from "./fixtures/facilities";
import { faqs } from "./fixtures/faqs";
import { packages } from "./fixtures/packages";
import { services } from "./fixtures/services";
import { clinicToday, isPackageActive, publishedIn } from "./localize";
import type { ArticleCategory } from "./types";

/*
 * Data access for public content. Phase 2: local placeholder fixtures.
 * Phase 4: the same functions read published CMS records instead.
 */

export async function listServices(locale: Locale) {
  return publishedIn(services, locale);
}
export async function getService(slug: string) {
  return services.find((s) => s.slug === slug && s.published) ?? null;
}
export function serviceSlugs() {
  return services.filter((s) => s.published).map((s) => s.slug);
}

export async function listDoctors(locale: Locale) {
  return publishedIn(doctors, locale);
}
export async function getDoctor(slug: string) {
  return doctors.find((d) => d.slug === slug && d.published) ?? null;
}
export function doctorSlugs() {
  return doctors.filter((d) => d.published).map((d) => d.slug);
}

export async function listFacilities(locale: Locale) {
  return publishedIn(facilities, locale);
}

/** Active packages only; expiry is re-evaluated at least hourly. */
export async function listActivePackages(locale: Locale) {
  "use cache";
  cacheLife("hours");
  const today = clinicToday();
  return publishedIn(packages, locale).filter((p) => isPackageActive(p, today));
}
export async function getActivePackage(slug: string) {
  "use cache";
  cacheLife("hours");
  const pkg = packages.find((p) => p.slug === slug);
  return pkg && isPackageActive(pkg, clinicToday()) ? pkg : null;
}
export function packageSlugs() {
  return packages.filter((p) => p.published).map((p) => p.slug);
}

export interface ArticleFilter {
  category?: ArticleCategory;
  query?: string;
}
export async function listArticles(locale: Locale, filter: ArticleFilter = {}) {
  const query = filter.query?.trim().toLocaleLowerCase(locale);
  return publishedIn(articles, locale)
    .filter((a) => !filter.category || a.category === filter.category)
    .filter((a) => {
      if (!query) return true;
      const t = a.translations[locale]!;
      return [t.title, t.excerpt ?? ""].some((text) =>
        text.toLocaleLowerCase(locale).includes(query),
      );
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
export async function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug && a.published) ?? null;
}
export function articleSlugs() {
  return articles.filter((a) => a.published).map((a) => a.slug);
}

export async function listFaqs(locale: Locale) {
  return publishedIn(faqs, locale);
}
