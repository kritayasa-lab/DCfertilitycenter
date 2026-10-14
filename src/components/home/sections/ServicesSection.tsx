import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { listServices } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SectionHeading } from "../SectionHeading";
import { ServiceIcon } from "../ServiceIcon";

/** Section 2: exactly the six clinic services, in clinic-defined order. */
export async function ServicesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Home" });
  const services = await listServices(locale);

  return (
    <section aria-labelledby="services-heading" className="bg-background py-20 sm:py-24">
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
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, index) => (
            <li key={s.slug}>
              <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft transition-[box-shadow,transform] duration-300 focus-within:shadow-raised hover:-translate-y-1 hover:shadow-raised sm:p-7">
                <div className="flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                    <ServiceIcon icon={s.icon} className="h-8 w-8" />
                  </span>
                  <span aria-hidden="true" className="text-sm font-semibold text-accent-strong tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 flex-1 text-lg leading-snug">
                  <Link
                    href={`/services/${s.slug}`}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
                  >
                    {s.translations[locale]!.title}
                  </Link>
                </h3>
                <p className="mt-5 text-sm font-medium text-primary">{t("serviceCta")} →</p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
