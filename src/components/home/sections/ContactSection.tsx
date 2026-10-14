import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { siteConfig, telHref, verifiedValue } from "@/config/site";
import { listServices } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { isInquiryDeliveryConfigured } from "@/lib/inquiry/delivery";
import { callbackTimes, contactMethods } from "@/lib/inquiry/schema";
import { InquiryForm, type InquiryFormText } from "../InquiryForm";
import { MapEmbed } from "../MapEmbed";
import { SectionHeading } from "../SectionHeading";

const errorKeys = ["required", "tooLong", "phone", "email", "emailRequiredForMethod", "consent", "spam"] as const;

/**
 * Section 7 (also used on /contact): map on the left, inquiry form on the
 * right. Contact details come from the central site configuration.
 */
export async function ContactSection({
  locale,
  headingLevel = "h2",
}: {
  locale: Locale;
  headingLevel?: "h1" | "h2";
}) {
  const [t, tContact, tCommon, tFooter] = await Promise.all([
    getTranslations({ locale, namespace: "Home" }),
    getTranslations({ locale, namespace: "Contact" }),
    getTranslations({ locale, namespace: "Common" }),
    getTranslations({ locale, namespace: "Footer" }),
  ]);
  const services = await listServices(locale);
  const address = verifiedValue(siteConfig.contact.address);
  const phones = verifiedValue(siteConfig.contact.phones) ?? [];
  const mapUrl = verifiedValue(siteConfig.contact.mapUrl);

  const text: InquiryFormText = {
    notConnected: tContact("formNotConnected"),
    notBooking: tContact("formNotBooking"),
    dataMinimization: tContact("fields.dataMinimization"),
    fields: {
      name: tContact("fields.name"),
      phone: tContact("fields.phone"),
      phoneHint: tContact("fields.phoneHint"),
      email: tContact("fields.email"),
      preferredLanguage: tContact("fields.preferredLanguage"),
      service: tContact("fields.service"),
      serviceNone: tContact("fields.serviceNone"),
      contactMethod: tContact("fields.contactMethod"),
      callbackTime: tContact("fields.callbackTime"),
    },
    contactMethods: Object.fromEntries(contactMethods.map((m) => [m, tContact(`fields.contactMethods.${m}`)])) as InquiryFormText["contactMethods"],
    callbackTimes: Object.fromEntries(callbackTimes.map((c) => [c, tContact(`fields.callbackTimes.${c}`)])) as InquiryFormText["callbackTimes"],
    errors: Object.fromEntries(errorKeys.map((k) => [k, tContact(`errors.${k}`)])),
    errorSummary: tContact("errorSummary", { count: "{count}" }),
    submit: tContact("submit"),
    sending: tContact("sending"),
    results: {
      notConnected: tContact("results.notConnected", { phones: phones.join(", ") }),
      delivered: tContact("results.delivered"),
      failed: tContact("results.failed", { phones: phones.join(", ") }),
    },
    honeypot: tContact("honeypot"),
  };

  const Heading = headingLevel;

  return (
    <section aria-labelledby="contact-heading" className="bg-surface-muted py-20 sm:py-24">
      <Container>
        {headingLevel === "h2" ? (
          <SectionHeading id="contact-heading" eyebrow={t("contactEyebrow")} title={t("contactHeading")} intro={t("contactIntro")} />
        ) : (
          <div className="mb-10 max-w-2xl">
            <Heading id="contact-heading" className="text-4xl sm:text-5xl">{tContact("title")}</Heading>
            <p className="mt-4 text-lg text-muted">{tContact("intro")}</p>
          </div>
        )}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6">
            <div className="min-h-80 flex-1">
              <MapEmbed
                query={address ?? ""}
                mapUrl={mapUrl}
                labels={{ title: t("mapTitle"), load: t("mapLoad"), notice: t("mapNotice"), open: t("mapOpen") }}
              />
            </div>
            <dl className="grid gap-4 rounded-2xl border border-border bg-surface p-6 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-foreground">{tFooter("address")}</dt>
                <dd className="mt-1 text-muted" lang="th">{address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">{tFooter("phone")}</dt>
                <dd className="mt-1 flex flex-col gap-1">
                  {phones.map((phone) => (
                    <a key={phone} href={telHref(phone)} className="font-medium text-primary underline-offset-4 hover:underline">
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <h3 className="mb-6 text-2xl">{tContact("formHeading")}</h3>
            <InquiryForm
              locale={locale}
              connected={isInquiryDeliveryConfigured()}
              text={text}
              languages={locales.map((l) => ({ value: l, label: tCommon(`languageNames.${l}`) }))}
              services={services.map((s) => ({ value: s.slug, label: s.translations[locale]!.title }))}
              privacyConsent={tContact.rich("fields.privacy", {
                privacyLink: (chunks) => (
                  <Link href="/privacy" className="text-primary underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
