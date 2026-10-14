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

/**
 * Section 1. The hero photograph is the clinic's original image, shown
 * unmodified (CSS sizing only). A non-generative cutout was not feasible:
 * the white coats and the light background have near-identical colours.
 */
export async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const { heroDoctors } = clinicAssets;
  const words = visionKeys.map((key) => ({ key, word: key.toUpperCase(), meaning: t(`vision.${key}`) }));

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-x-clip bg-surface-muted">
      {/* Decorative motion: slow drift, disabled under prefers-reduced-motion. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl motion-safe:animate-drift" />
        <div className="absolute right-[8%] bottom-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl motion-safe:animate-drift-slow" />
        <svg viewBox="0 0 200 200" className="absolute top-16 right-[38%] hidden h-40 w-40 text-accent motion-safe:animate-drift lg:block">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 8" />
        </svg>
      </div>

      <Container className="relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
        <div>
          <h1 id="hero-heading" className="text-sm font-semibold tracking-[0.2em] text-accent-strong uppercase">
            <span lang="th" className="tracking-normal">{clinicName("th")}</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span lang="en">DC Fertility Center</span>
          </h1>
          <VisionWords words={words} label={t("visionLabel")} className="mt-6" />
          <p className="max-w-lg text-lg text-muted">{t("heroIntro")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              {t("heroPrimaryCta")}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">
              {t("heroSecondaryCta")}
            </ButtonLink>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-raised">
            <Image
              src={heroDoctors.src}
              alt={t("heroImageAlt")}
              width={heroDoctors.width}
              height={heroDoctors.height}
              preload
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-square h-auto w-full object-cover"
            />
          </div>

          <div className="relative z-10 mx-4 -mt-16 rounded-2xl border border-border bg-surface/95 p-5 shadow-card backdrop-blur sm:mx-8 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.18em] text-accent-strong uppercase">{t("doctorsLabel")}</p>
            <ul className="mt-3 space-y-1.5" lang="th">
              {doctors.map((d) => (
                <li key={d.slug} className="text-base font-semibold text-foreground sm:text-lg">
                  {d.translations.th!.name}
                </li>
              ))}
            </ul>
            <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm text-muted" lang="th">
              {doctorSpecialties.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
