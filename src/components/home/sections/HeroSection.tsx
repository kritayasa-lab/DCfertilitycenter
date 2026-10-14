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
 * Keeps each registration number together with the surname before it, so
 * "ว.23473" never wraps onto a line of its own. The text is unchanged.
 */
function DoctorName({ name }: { name: string }) {
  const match = name.match(/^(.*\s)(\S+\sว\.\d+)$/);
  if (!match) return <>{name}</>;
  return (
    <>
      {match[1]}
      <span className="whitespace-nowrap">{match[2]}</span>
    </>
  );
}

/**
 * Section 1: split editorial hero.
 * Left: HOPE / TRUST / MIRACLE as one typographic group (MIRACLE largest)
 * with the CTA. Right: the clinic's original photograph of both doctors
 * (unmodified file; CSS framing only), with their credentials directly below.
 * On large screens the photo column slides under the text column so the
 * large MIRACLE overlaps the photo's lower-left edge (coat area, away from
 * the faces). The photo's baked-in caption (top-right) is kept intact.
 */
export async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const { heroDoctors } = clinicAssets;
  const words = visionKeys.map((key) => ({ key, word: key.toUpperCase(), meaning: t(`vision.${key}`) }));

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip bg-[radial-gradient(ellipse_at_30%_45%,var(--color-gold-50)_0%,var(--color-background)_60%)]"
    >
      {/* The clinic name is in the logo; the heading stays available to assistive tech and search. */}
      <h1 id="hero-heading" className="sr-only">
        <span lang="th">{clinicName("th")}</span> · <span lang="en">DC Fertility Center</span>
      </h1>

      <Container className="grid items-center gap-12 py-10 sm:py-14 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-0 lg:py-10">
        {/* Left: vision composition + CTA */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <VisionWords words={words} label={t("visionLabel")} className="w-full max-w-[36rem]" />
          <p className="mt-2 max-w-md text-lg text-muted">{t("heroIntro")}</p>
          <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href="/contact" variant="gold" size="lg" className="w-full sm:w-auto">
              {t("heroPrimaryCta")}
            </ButtonLink>
            <ButtonLink href="/services" variant="ghost" size="lg">
              {t("heroSecondaryCta")} <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </div>

        {/* Right: the two doctors + credentials */}
        <div className="relative mx-auto w-full max-w-[30rem] lg:-ml-24 lg:max-w-[29rem] lg:justify-self-start">
          <figure className="relative">
            <span aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border border-cta-gold-deep/60" />
            <div className="relative overflow-hidden rounded-[2rem] shadow-raised">
              <Image
                src={heroDoctors.src}
                alt={t("heroImageAlt")}
                width={heroDoctors.width}
                height={heroDoctors.height}
                preload
                sizes="(min-width: 1024px) 464px, (min-width: 640px) 480px, 100vw"
                // Trims empty background on the left only; faces and the photo's caption stay intact.
                className="aspect-[6/7] h-auto w-full object-cover object-right"
              />
            </div>
          </figure>

          <div className="mt-6 border-t border-cta-gold-deep/50 pt-5 text-center lg:text-left">
            <p className="text-xs font-semibold text-accent-strong">{t("doctorsLabel")}</p>
            <ul className="mt-2 space-y-1" lang="th">
              {doctors.map((d) => (
                <li key={d.slug} className="text-[clamp(1rem,4.2vw,1.125rem)] font-semibold text-foreground">
                  <DoctorName name={d.translations.th!.name} />
                </li>
              ))}
            </ul>
            <ul className="mt-3 space-y-0.5 text-sm text-muted" lang="th">
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
