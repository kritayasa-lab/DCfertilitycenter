import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { CarouselLabels } from "../Carousel";

export async function carouselLabels(locale: Locale, region: string): Promise<CarouselLabels> {
  const t = await getTranslations({ locale, namespace: "Carousel" });
  return {
    region,
    previous: t("previous"),
    next: t("next"),
    goTo: t("goTo", { page: "{page}" }),
    slide: t("slide", { index: "{index}", total: "{total}" }),
    roleCarousel: t("roleCarousel"),
    roleSlide: t("roleSlide"),
  };
}
