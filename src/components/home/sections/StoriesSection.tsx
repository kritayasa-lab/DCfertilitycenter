import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { listSuccessStories } from "@/content/queries";
import type { Locale } from "@/i18n/routing";
import { Carousel } from "../Carousel";
import { SectionHeading } from "../SectionHeading";
import { VideoFacade } from "../VideoFacade";
import { carouselLabels } from "./carousel-labels";

/**
 * Section 4: success-story video cards. Placeholder slots only. A slot with
 * an approved, allow-listed video renders a click-to-load player; nothing is
 * fetched or embedded until then, and no stories or outcomes are invented.
 */
export async function StoriesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const stories = await listSuccessStories();

  return (
    <section aria-labelledby="stories-heading" className="bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading id="stories-heading" eyebrow={t("storiesEyebrow")} title={t("storiesHeading")} intro={t("storiesIntro")} />
        <Carousel labels={await carouselLabels(locale, t("storiesHeading"))}>
          {stories.map((story, index) => {
            const title = story.title[locale] ?? t("storyPlaceholderTitle", { n: index + 1 });
            return (
              <article key={story.id} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                {story.video ? (
                  <VideoFacade video={story.video} title={title} playLabel={t("storyPlay")} />
                ) : (
                  <div className="relative flex aspect-video items-center justify-center bg-surface-inverse/90 text-on-inverse">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-on-inverse/60">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current opacity-70">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-pill bg-on-inverse/15 px-3 py-1 text-xs">
                      {t("storyNoVideo")}
                    </span>
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  {story.placeholder && <Badge tone="warning">{tCommon("placeholderBadge")}</Badge>}
                  <h3 className="mt-3 text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{t("storyPlaceholderBody")}</p>
                </div>
              </article>
            );
          })}
        </Carousel>
      </Container>
    </section>
  );
}
