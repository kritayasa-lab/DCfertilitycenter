import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { listPromoSlides } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Carousel } from "../Carousel";
import { SectionHeading } from "../SectionHeading";
import { carouselLabels } from "./carousel-labels";

/** Section 3: package/promotion image cards. Placeholders only: no offers or prices. */
export async function PackagesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const slides = await listPromoSlides();

  return (
    <section aria-labelledby="packages-heading" className="bg-surface-muted py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="packages-heading"
          eyebrow={t("packagesEyebrow")}
          title={t("packagesHeading")}
          intro={t("packagesIntro")}
          action={
            <Link href="/packages" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              {t("packagesViewAll")} →
            </Link>
          }
        />
        <Carousel labels={await carouselLabels(locale, t("packagesHeading"))}>
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className="flex aspect-[16/10] flex-col justify-between rounded-2xl border-2 border-dashed border-border-strong bg-surface p-6 sm:p-8"
            >
              <Badge tone="warning" className="self-start">
                {tCommon("placeholderBadge")}
              </Badge>
              <div>
                <svg aria-hidden="true" viewBox="0 0 48 48" className="mb-4 h-10 w-10 text-border-strong">
                  <rect x="6" y="10" width="36" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="m6 32 10-9 8 7 6-5 12 9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="32" cy="18" r="3" fill="currentColor" />
                </svg>
                <h3 className="text-xl">{t("packagePlaceholderTitle", { n: index + 1 })}</h3>
                <p className="mt-2 text-sm text-muted">{t("packagePlaceholderBody")}</p>
              </div>
            </article>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
