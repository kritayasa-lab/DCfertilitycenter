import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/content/CtaBand";
import { DoctorAvatar } from "@/components/content/DoctorAvatar";
import { PageHeader } from "@/components/content/PageHeader";
import { PendingBlock } from "@/components/content/PendingBlock";
import { PlaceholderBadge } from "@/components/content/PlaceholderBadge";
import { TranslationUnavailable } from "@/components/content/TranslationUnavailable";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { availableLocales, localize } from "@/content/localize";
import { doctorSlugs, getDoctor } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return doctorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/[locale]/doctors/[slug]">): Promise<Metadata> {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const doctor = await getDoctor(slug);
  if (!doctor) return {};
  const content = localize(doctor, locale);
  if (!content) {
    const t = await getTranslations({ locale, namespace: "TranslationUnavailable" });
    return { title: t("metaTitle"), robots: { index: false, follow: false } };
  }
  return buildMetadata({
    locale,
    path: `/doctors/${slug}`,
    title: content.name,
    description: content.role ?? undefined,
    availableLocales: availableLocales(doctor),
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

export default async function DoctorPage(props: PageProps<"/[locale]/doctors/[slug]">) {
  const locale = await currentLocale();
  const { slug } = await props.params;
  const doctor = await getDoctor(slug);
  if (!doctor) notFound();

  const content = localize(doctor, locale);
  if (!content) {
    return (
      <TranslationUnavailable locale={locale} path={`/doctors/${slug}`} available={availableLocales(doctor)} />
    );
  }
  const t = await getTranslations({ locale, namespace: "Doctors" });

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={content.name}
        intro={content.role ?? undefined}
        breadcrumbs={[{ label: t("title"), href: "/doctors" }, { label: content.name }]}
        badges={doctor.placeholder ? <PlaceholderBadge /> : undefined}
      />
      <Section>
        <Container className="grid gap-12 md:grid-cols-[16rem_1fr]">
          <DoctorAvatar doctor={doctor} locale={locale} />
          <div className="space-y-10">
            <section aria-labelledby="role">
              <h2 id="role" className="text-2xl">{t("roleHeading")}</h2>
              <div className="mt-3">{content.role ?? <PendingBlock />}</div>
            </section>
            <section aria-labelledby="qualifications">
              <h2 id="qualifications" className="text-2xl">{t("qualificationsHeading")}</h2>
              <div className="mt-3"><ListOrPending items={content.qualifications} /></div>
            </section>
            <section aria-labelledby="expertise">
              <h2 id="expertise" className="text-2xl">{t("expertiseHeading")}</h2>
              <div className="mt-3"><ListOrPending items={content.expertise} /></div>
            </section>
            <section aria-labelledby="biography">
              <h2 id="biography" className="text-2xl">{t("biographyHeading")}</h2>
              <div className="mt-3">
                {content.biography ? <p className="max-w-prose">{content.biography}</p> : <PendingBlock />}
              </div>
            </section>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </main>
  );
}
