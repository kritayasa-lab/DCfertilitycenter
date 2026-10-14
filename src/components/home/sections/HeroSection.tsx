import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { clinicAssets } from "@/config/assets";
import { clinicName } from "@/config/site";
import { doctors, doctorSpecialties } from "@/content/fixtures/doctors";
import type { Locale } from "@/i18n/routing";
import { VisionWords } from "../VisionWords";

export const visionKeys = ["hope", "trust", "miracle"] as const;

/*
 * Editorial placement of the vision words around the ICSI artwork (lg+).
 * The artwork's free areas are top-left, top-right and lower-right; the
 * numbered labels (01–03) make the clockwise reading order explicit.
 * Below lg the words form a centred row under the artwork.
 */
const stagePlacements = [
  "lg:absolute lg:left-0 lg:top-0",
  "lg:absolute lg:right-0 lg:top-[4%] lg:items-end lg:text-right",
  "lg:absolute lg:right-[3%] lg:bottom-[2%] lg:items-end lg:text-right",
];

/**
 * Section 1. Scientific ICSI artwork (supplied 3D render, shown unmodified)
 * as the visual anchor; vision words placed around it; doctors' credentials
 * in a separate strip below so they never overlap the words. The doctors'
 * photograph is the original file, framed with CSS only.
 */
export async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const { icsiHero, heroDoctors } = clinicAssets;
  const words = visionKeys.map((key) => ({ key, word: key.toUpperCase(), meaning: t(`vision.${key}`) }));

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip bg-[radial-gradient(ellipse_at_50%_42%,var(--color-gold-50)_0%,var(--color-background)_58%)]"
    >
      <Container className="relative pt-12 pb-16 sm:pt-16 lg:pt-20 lg:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 id="hero-heading" className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-accent-strong sm:text-sm">
            <span lang="th">{clinicName("th")}</span>
            <span aria-hidden="true" className="h-px w-6 bg-cta-gold-deep" />
            <span lang="en" className="tracking-[0.24em] uppercase">
              DC Fertility Center
            </span>
          </h1>
        </div>

        {/* Stage: artwork + vision words */}
        <div className="relative mx-auto mt-10 max-w-6xl lg:mt-12 lg:px-4 lg:pt-24 lg:pb-16">
          <figure className="relative mx-auto w-full max-w-5xl">
            <Image
              src={icsiHero.src}
              alt={t("icsiImageAlt")}
              width={icsiHero.width}
              height={icsiHero.height}
              preload
              sizes="(min-width: 1024px) 1024px, 100vw"
              // Display-only edge fade so the pipettes dissolve into the page (file unchanged).
              className="h-auto w-full [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] motion-safe:animate-float"
            />
            <figcaption className="mt-2 text-center text-[0.7rem] tracking-[0.18em] text-muted uppercase">
              <span lang="en">ICSI</span>
              <span aria-hidden="true"> · </span>
              {t("icsiCaption")}
            </figcaption>
          </figure>
          <VisionWords words={words} label={t("visionLabel")} placements={stagePlacements} />
        </div>

        <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center text-center">
          <p className="text-lg text-muted">{t("heroIntro")}</p>
          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/contact" variant="gold" size="lg">
              {t("heroPrimaryCta")}
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="lg">
              {t("heroSecondaryCta")} <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>

        {/* Doctors' credentials (exact supplied strings) */}
        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-6 rounded-3xl border border-border bg-surface/80 p-5 shadow-soft backdrop-blur sm:p-6 lg:grid-cols-[auto_1fr_1fr] lg:gap-8">
          <div className="flex items-center gap-4 lg:block">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-border sm:h-24 sm:w-24">
              <Image
                src={heroDoctors.src}
                alt={t("heroImageAlt")}
                width={heroDoctors.width}
                height={heroDoctors.height}
                sizes="96px"
                className="h-full w-full scale-[1.9] object-cover object-[48%_28%]"
                style={{ transformOrigin: "48% 28%" }}
              />
            </div>
            <p className="text-xs font-semibold text-accent-strong lg:hidden">{t("doctorsLabel")}</p>
          </div>
          <div className="lg:border-l lg:border-border lg:pl-8">
            <p className="hidden text-xs font-semibold text-accent-strong lg:block">{t("doctorsLabel")}</p>
            <ul className="space-y-1.5 lg:mt-2" lang="th">
              {doctors.map((d) => (
                <li key={d.slug} className="text-base font-semibold text-foreground sm:text-lg">
                  {d.translations.th!.name}
                </li>
              ))}
            </ul>
          </div>
          <ul
            className="flex flex-col gap-1 border-t border-border pt-4 text-sm text-muted lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
            lang="th"
          >
            {doctorSpecialties.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
