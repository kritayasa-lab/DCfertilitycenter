import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { PackageMeta } from "@/components/content/PackageMeta";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { TranslationUnavailable } from "@/components/content/TranslationUnavailable";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { availableLocales, localize } from "@/content/localize";
import { getActivePackage, packageSlugs } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return packageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/[locale]/packages/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const pkg = await getActivePackage(slug);
  if (!pkg) return {};
  const content = localize(pkg, locale);
  if (!content) {
    const t = await getTranslations({ locale, namespace: "TranslationUnavailable" });
    return { title: t("metaTitle"), robots: { index: false, follow: false } };
  }
  return buildMetadata({
    locale,
    path: `/packages/${slug}`,
    title: content.title,
    description: content.description ?? undefined,
    availableLocales: availableLocales(pkg),
  });
}

function ListOrPending({ items }: { items: string[] | null }) {
  if (!items) return <PendingBlock />;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function PackagePage(props: PageProps<"/[locale]/packages/[slug]">) {
  const locale = await currentLocale();
  const { slug } = await props.params;
  // Expired or unpublished packages are not found, never shown as active offers.
  const pkg = await getActivePackage(slug);
  if (!pkg) notFound();

  const content = localize(pkg, locale);
  if (!content) {
    return <TranslationUnavailable locale={locale} path={`/packages/${slug}`} available={availableLocales(pkg)} />;
  }
  const t = await getTranslations({ locale, namespace: "Packages" });

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={content.title}
        intro={content.description ?? undefined}
        breadcrumbs={[{ label: t("title"), href: "/packages" }, { label: content.title }]}
        badges={pkg.placeholder ? <PlaceholderBadge /> : undefined}
      >
        <div className="mt-6"><PackageMeta pkg={pkg} /></div>
      </PageHeader>
      <Section>
        <Container className="grid max-w-content gap-10 md:grid-cols-2">
          <section aria-labelledby="inclusions">
            <h2 id="inclusions" className="text-2xl">{t("inclusionsHeading")}</h2>
            <div className="mt-3"><ListOrPending items={content.inclusions} /></div>
          </section>
          <section aria-labelledby="exclusions">
            <h2 id="exclusions" className="text-2xl">{t("exclusionsHeading")}</h2>
            <div className="mt-3"><ListOrPending items={content.exclusions} /></div>
          </section>
          <section aria-labelledby="terms" className="md:col-span-2">
            <h2 id="terms" className="text-2xl">{t("termsHeading")}</h2>
            <div className="mt-3">{content.terms ? <p className="max-w-prose">{content.terms}</p> : <PendingBlock />}</div>
          </section>
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
