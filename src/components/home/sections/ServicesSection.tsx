import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { listServices } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "../SectionHeading";
import { ServiceArc } from "../ServiceArc";

/** Section 2: the six clinic services on a curved, rotatable card carousel. */
export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const services = await listServices(locale);

  return (
    <section aria-labelledby="services-heading" className="overflow-x-clip bg-background py-20 sm:py-24">
      <Container>
        <SectionHeading
          id="services-heading"
          eyebrow={t("servicesEyebrow")}
          title={t("servicesHeading")}
          action={
            <Link href="/services" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
              {t("servicesViewAll")} →
            </Link>
          }
        />
        <ServiceArc
          services={services.map((s) => ({ slug: s.slug, title: s.translations[locale]!.title, icon: s.icon }))}
          labels={{
            region: t("servicesCarouselLabel"),
            previous: t("servicesPrev"),
            next: t("servicesNext"),
            position: t("servicesPosition", { index: "{index}", total: "{total}" }),
            selected: t("servicesSelected"),
            open: t("serviceCta"),
            imagePending: t("servicesImagePending"),
            hint: t("servicesHint"),
            goTo: t("servicesGoTo", { page: "{page}" }),
          }}
        />
      </Container>
    </section>
  );
}
