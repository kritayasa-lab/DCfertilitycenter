import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactSection } from "@/components/home/sections/ContactSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { PackagesSection } from "@/components/home/sections/PackagesSection";
import { QaSection } from "@/components/home/sections/QaSection";
import { ServicesSection } from "@/components/home/sections/ServicesSection";
import { StoriesSection } from "@/components/home/sections/StoriesSection";
import { WhyChooseSection } from "@/components/home/sections/WhyChooseSection";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { currentLocale } from "@/i18n/server";
import { buildMetadata, siteName } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Home" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  return {
    ...buildMetadata({ locale, path: "", title: t("metaTitle"), description: tMeta("description") }),
    // The layout's title template only applies to child segments.
    title: { absolute: `${t("metaTitle")} | ${siteName(locale)}` },
  };
}

/**
 * Homepage, in the approved order:
 * 1 Hero · 2 Services · 3 Packages & promotions · 4 Success stories ·
 * 5 Why choose · 6 Q&A · 7 Contact (8 Footer comes from the shared layout).
 */
export default async function HomePage() {
  const locale = await currentLocale();
  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <HeroSection locale={locale} />
      <ServicesSection locale={locale} />
      <PackagesSection locale={locale} />
      <StoriesSection locale={locale} />
      <WhyChooseSection locale={locale} />
      <QaSection locale={locale} />
      <ContactSection locale={locale} />
    </main>
  );
}
