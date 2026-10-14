import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { EntryCard } from "@/components/content/EntryCard";
import { FaqList } from "@/components/content/FaqList";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import {
  listActivePackages,
  listArticles,
  listDoctors,
  listFacilities,
  listFaqs,
  listServices,
} from "@/content/queries";
import { Link } from "@/i18n/navigation";
import { currentLocale } from "@/i18n/server";
import { buildMetadata, siteName } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const t = await getTranslations({ locale, namespace: "Home" });
  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  return {
    ...buildMetadata({ locale, path: "", title: t("metaTitle"), description: tMeta("description") }),
    // The layout's title template only applies to child segments.
    title: { absolute: `${t("metaTitle")} | ${siteName()}` },
  };
}

const journeyKeys = ["inquiry", "contact", "arrange"] as const;

function SectionHeading({
  id,
  title,
  intro,
  link,
}: {
  id: string;
  title: string;
  intro?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-prose">
        <h2 id={id} className="text-3xl sm:text-4xl">{title}</h2>
        {intro && <p className="mt-3 text-muted">{intro}</p>}
      </div>
      {link && (
        <Link href={link.href} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
          {link.label} →
        </Link>
      )}
    </div>
  );
}

export default async function HomePage() {
  const locale = await currentLocale();
  const [t, tCommon, tNav] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Nav" }),
  ]);
  const [services, doctors, facilities, packages, articles, faqs] = await Promise.all([
    listServices(locale),
    listDoctors(locale),
    listFacilities(locale),
    listActivePackages(locale),
    listArticles(locale),
    listFaqs(locale),
  ]);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      {/* 1. Hero */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden bg-surface-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 text-accent opacity-60 sm:h-[32rem] sm:w-[32rem]"
        >
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="80" fill="currentColor" opacity="0.35" />
        </svg>
        <Container className="relative py-20 sm:py-28">
          <Badge tone="primary">{t("eyebrow")}</Badge>
          <h1 id="hero-heading" className="mt-6 max-w-3xl text-4xl sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted">{t("intro")}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" size="lg">
              {t("primaryCta")}
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">
              {t("secondaryCta")}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* 2. Introduction / approach */}
      <Section aria-labelledby="about-heading">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <h2 id="about-heading" className="text-3xl sm:text-4xl">{t("aboutHeading")}</h2>
          <div>
            <p className="text-lg text-muted">{t("aboutBody")}</p>
            <Link href="/about" className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline">
              {t("aboutLink")} →
            </Link>
          </div>
        </Container>
      </Section>

      {/* 3. Services overview */}
      <Section tone="muted" aria-labelledby="services-heading">
        <Container>
          <SectionHeading
            id="services-heading"
            title={t("servicesHeading")}
            intro={t("servicesIntro")}
            link={{ href: "/services", label: tNav("allServices") }}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug}>
                <EntryCard
                  title={s.translations[locale]!.title}
                  href={`/services/${s.slug}`}
                  badges={s.placeholder ? <PlaceholderBadge /> : undefined}
                  footer={tCommon("viewDetails")}
                >
                  {s.translations[locale]!.summary}
                </EntryCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 4. Why choose the clinic (verifiable differentiators only) */}
      <Section aria-labelledby="why-heading">
        <Container>
          <SectionHeading id="why-heading" title={t("whyHeading")} />
          <PendingBlock />
          <p className="mt-4 max-w-prose text-sm text-muted">{t("whyBody")}</p>
        </Container>
      </Section>

      {/* 5. Inquiry-first journey */}
      <Section tone="surface" aria-labelledby="journey-heading">
        <Container>
          <SectionHeading id="journey-heading" title={t("journeyHeading")} intro={t("journeyIntro")} />
          <ol className="grid gap-6 md:grid-cols-3">
            {journeyKeys.map((key, index) => (
              <li key={key} className="rounded-lg border border-border bg-background p-6">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-pill bg-primary-soft font-display text-lg text-primary"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl">{t(`journeySteps.${key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted">{t(`journeySteps.${key}.body`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* 6. Doctors */}
      <Section aria-labelledby="doctors-heading">
        <Container>
          <SectionHeading
            id="doctors-heading"
            title={t("doctorsHeading")}
            link={{ href: "/doctors", label: tCommon("viewAll") }}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <li key={d.slug}>
                <EntryCard
                  title={d.translations[locale]!.name}
                  href={`/doctors/${d.slug}`}
                  badges={d.placeholder ? <PlaceholderBadge /> : undefined}
                  footer={tCommon("viewDetails")}
                >
                  {d.translations[locale]!.role}
                </EntryCard>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 7. Facilities */}
      <Section tone="muted" aria-labelledby="facilities-heading">
        <Container>
          <SectionHeading
            id="facilities-heading"
            title={t("facilitiesHeading")}
            link={{ href: "/facilities", label: tCommon("viewAll") }}
          />
          <ul className="grid gap-6 sm:grid-cols-3">
            {facilities.map((f) => (
              <li key={f.slug}>
                <EntryCard title={f.translations[locale]!.title} badges={f.placeholder ? <PlaceholderBadge /> : undefined} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 8. Packages (only if any are active) */}
      {packages.length > 0 && (
        <Section aria-labelledby="packages-heading">
          <Container>
            <SectionHeading
              id="packages-heading"
              title={t("packagesHeading")}
              link={{ href: "/packages", label: tCommon("viewAll") }}
            />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((p) => (
                <li key={p.slug}>
                  <EntryCard
                    title={p.translations[locale]!.title}
                    href={`/packages/${p.slug}`}
                    badges={p.placeholder ? <PlaceholderBadge /> : undefined}
                    footer={tCommon("viewDetails")}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* 9. Patient stories: intentionally omitted until genuine, authorized stories exist. */}

      {/* 10. Articles and FAQ */}
      <Section tone="surface" aria-labelledby="articles-heading">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="articles-heading"
              title={t("articlesHeading")}
              link={{ href: "/articles", label: tCommon("viewAll") }}
            />
            <ul className="space-y-4">
              {articles.slice(0, 3).map((a) => (
                <li key={a.slug}>
                  <EntryCard
                    title={a.translations[locale]!.title}
                    href={`/articles/${a.slug}`}
                    badges={a.placeholder ? <PlaceholderBadge /> : undefined}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              id="faq-heading"
              title={t("faqHeading")}
              link={{ href: "/faq", label: tCommon("viewAll") }}
            />
            <FaqList items={faqs.slice(0, 3).map((f) => f.translations[locale]!)} />
          </div>
        </Container>
      </Section>

      {/* 11. Contact CTA */}
      <CtaBand />
    </main>
  );
}
