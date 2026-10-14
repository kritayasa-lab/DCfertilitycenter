import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { FaqList } from "@/components/content/FaqList";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { TranslationUnavailable } from "@/components/content/TranslationUnavailable";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Section";
import { availableLocales, localize } from "@/content/localize";
import { getService, listServices, serviceSlugs } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import { currentLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) return {};
  const content = localize(service, locale);
  const path = `/services/${slug}`;
  if (!content) {
    const t = await getTranslations({ locale, namespace: "TranslationUnavailable" });
    return { title: t("metaTitle"), robots: { index: false, follow: false } };
  }
  return buildMetadata({
    locale,
    path,
    title: content.title,
    description: content.summary ?? undefined,
    availableLocales: availableLocales(service),
  });
}

export default async function ServicePage(props: PageProps<"/[locale]/services/[slug]">) {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const service = await getService(slug);
  if (!service) notFound();

  const content = localize(service, locale);
  const path = `/services/${slug}`;
  if (!content) {
    return <TranslationUnavailable locale={locale} path={path} available={availableLocales(service)} />;
  }

  const t = await getTranslations({ locale, namespace: "Services" });
  const others = (await listServices(locale)).filter((s) => s.slug !== slug);

  const sections = [
    { id: "introduction", heading: t("introductionHeading"), body: content.introduction },
    { id: "suitability", heading: t("suitabilityHeading"), body: content.suitability },
  ];

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={content.title}
        intro={content.summary ?? undefined}
        breadcrumbs={[{ label: t("title"), href: "/services" }, { label: content.title }]}
        badges={service.placeholder ? <PlaceholderBadge /> : undefined}
      />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id} className="text-2xl">{section.heading}</h2>
                <div className="mt-4">
                  {section.body ? <p className="max-w-prose">{section.body}</p> : <PendingBlock />}
                </div>
              </section>
            ))}

            <section aria-labelledby="process">
              <h2 id="process" className="text-2xl">{t("processHeading")}</h2>
              <div className="mt-4">
                {content.processSteps ? (
                  <ol className="max-w-prose list-decimal space-y-2 pl-5">
                    {content.processSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <PendingBlock />
                )}
              </div>
            </section>

            <section aria-labelledby="preparation">
              <h2 id="preparation" className="text-2xl">{t("preparationHeading")}</h2>
              <div className="mt-4">
                {content.preparation ? <p className="max-w-prose">{content.preparation}</p> : <PendingBlock />}
              </div>
            </section>

            <section aria-labelledby="service-faq">
              <h2 id="service-faq" className="text-2xl">{t("faqHeading")}</h2>
              <div className="mt-4">
                {content.faqs.length > 0 ? <FaqList items={content.faqs} /> : <PendingBlock />}
              </div>
            </section>

            <Notice tone="info" role="note">{t("disclaimer")}</Notice>
          </div>

          {others.length > 0 && (
            <aside aria-labelledby="other-services">
              <h2 id="other-services" className="font-sans text-sm font-semibold tracking-widest text-muted uppercase">
                {t("otherServices")}
              </h2>
              <ul className="mt-4 space-y-2">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="text-sm text-primary underline-offset-4 hover:underline">
                      {s.translations[locale]!.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
