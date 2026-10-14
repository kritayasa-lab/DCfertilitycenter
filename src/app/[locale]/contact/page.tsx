import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InquiryFormPreview } from "@/components/content/InquiryFormPreview";
import { PageHeader } from "@/components/content/PageHeader";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { PendingValue } from "@/components/ui/PendingValue";
import { Section } from "@/components/ui/Section";
import { siteConfig, verifiedValue } from "@/config/site";
import { listServices } from "@/content/queries";
import { currentLocale } from "@/i18n/server";
import { staticPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata(await currentLocale(), "Contact", "/contact");
}

export default async function ContactPage() {
  const locale = await currentLocale();
  const [t, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Footer" }),
  ]);
  const services = (await listServices(locale)).map((s) => ({
    slug: s.slug,
    title: s.translations[locale]!.title,
  }));
  const { contact } = siteConfig;
  const phone = verifiedValue(contact.phone);
  const mapUrl = verifiedValue(contact.mapUrl);

  const rows = [
    { label: tFooter("phone"), entry: contact.phone },
    { label: tFooter("email"), entry: contact.email },
    { label: tFooter("line"), entry: contact.lineId },
    { label: tFooter("address"), entry: contact.address },
    { label: tFooter("hours"), entry: contact.openingHours },
  ];

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader title={t("title")} intro={t("intro")} breadcrumbs={[{ label: t("title") }]} />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl">{t("detailsHeading")}</h2>
              <dl className="mt-5 space-y-4 text-sm">
                {rows.map((row) => (
                  <div key={row.label}>
                    <dt className="font-medium text-foreground">{row.label}</dt>
                    <dd className="mt-1">
                      {row.entry === contact.phone && phone ? (
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-primary underline">
                          {phone}
                        </a>
                      ) : (
                        <PendingValue entry={row.entry} label={row.label} />
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
            <Card>
              <h2 className="text-2xl">{t("mapHeading")}</h2>
              {mapUrl ? (
                <a href={mapUrl} className="mt-4 inline-block text-primary underline" rel="noopener noreferrer" target="_blank">
                  {t("mapHeading")}
                </a>
              ) : (
                <p className="mt-4 text-sm text-muted">{t("mapPending")}</p>
              )}
            </Card>
          </div>

          <section aria-labelledby="inquiry-heading">
            <h2 id="inquiry-heading" className="mb-6 text-3xl">{t("formHeading")}</h2>
            <InquiryFormPreview locale={locale} services={services} />
          </section>
        </Container>
      </Section>
    </main>
  );
}
