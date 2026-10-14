import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PendingBlock } from "@/components/content/PendingBlock";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinicAssets } from "@/config/assets";
import type { Locale } from "@/i18n/routing";
import { VisionWords } from "../VisionWords";
import { visionKeys } from "./HeroSection";

/**
 * Section 5. Original clinic photograph + a labelled placeholder for the
 * clinic's approved description (no invented mission statement).
 */
export async function WhyChooseSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const { whyChoose } = clinicAssets;
  const words = visionKeys.map((key) => ({ key, word: key.toUpperCase(), meaning: t(`vision.${key}`) }));

  return (
    <section aria-labelledby="why-heading" className="bg-surface-muted py-20 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="relative">
          <div aria-hidden="true" className="absolute -bottom-5 -left-5 hidden h-full w-full rounded-[2rem] bg-accent/40 sm:block" />
          <Image
            src={whyChoose.src}
            alt={t("whyImageAlt")}
            width={whyChoose.width}
            height={whyChoose.height}
            sizes="(min-width: 1024px) 620px, 100vw"
            className="relative aspect-[3/2] h-auto w-full rounded-[2rem] object-cover shadow-raised"
          />
        </div>
        <div>
          <VisionWords words={words} label={t("visionLabel")} variant="compact" />
          <h2 id="why-heading" className="mt-2 text-3xl sm:text-4xl">
            {t("whyHeading")}
          </h2>
          <div className="mt-6">
            <PendingBlock label={t("whyDescriptionPending")} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/success-rates" size="lg">
              {t("successRatesButton")}
            </ButtonLink>
            <ButtonLink href="/facilities" variant="secondary" size="lg">
              {t("facilitiesButton")}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
