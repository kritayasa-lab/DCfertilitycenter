import type { MetadataRoute } from "next";
import { staticPublicPaths } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { availableLocales } from "@/content/localize";
import { articles } from "@/content/fixtures/articles";
import { doctors } from "@/content/fixtures/doctors";
import { services } from "@/content/fixtures/services";
import { packageSlugs } from "@/content/queries";
import { packages } from "@/content/fixtures/packages";
import { clinicToday, isPackageActive } from "@/content/localize";
import { htmlLang, locales, type Locale } from "@/i18n/routing";
import type { BaseRecord } from "@/content/types";

function entry(path: string, available: readonly Locale[]): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    available.map((l) => [htmlLang[l], `${siteConfig.url}/${l}${path}`]),
  );
  return available.map((locale) => ({
    url: `${siteConfig.url}/${locale}${path}`,
    alternates: { languages },
  }));
}

function contentEntries<T>(prefix: string, records: BaseRecord<T>[]): MetadataRoute.Sitemap {
  return records
    .filter((r) => r.published)
    .flatMap((r) => entry(`${prefix}/${r.slug}`, availableLocales(r)));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today = clinicToday();
  const activePackages = packages.filter(
    (p) => packageSlugs().includes(p.slug) && isPackageActive(p, today),
  );
  return [
    ...staticPublicPaths.flatMap((path) => entry(path, locales)),
    ...contentEntries("/services", services),
    ...contentEntries("/doctors", doctors),
    ...contentEntries("/packages", activePackages),
    ...contentEntries("/articles", articles),
  ];
}
