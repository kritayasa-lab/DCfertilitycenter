import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { Container } from "@/components/ui/Container";
import { PendingValue } from "@/components/ui/PendingValue";
import { legalNav, mainNav } from "@/config/navigation";
import { displayValue, siteConfig, verifiedValue } from "@/config/site";
import { listServices } from "@/content/queries";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer({ locale }: { locale: Locale }) {
  const [t, tNav, tLegal, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Legal" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const services = await listServices(locale);
  const year = await currentYear();
  const siteName = displayValue(siteConfig.name) ?? "[Clinic Name]";
  const { contact, social } = siteConfig;
  const verifiedSocial = (
    [
      ["Facebook", verifiedValue(social.facebook)],
      ["LINE", verifiedValue(social.line)],
      ["Instagram", verifiedValue(social.instagram)],
    ] as const
  ).filter(([, url]) => url);

  const linkClass = "text-sm text-teal-100 underline-offset-4 hover:text-white hover:underline";
  const headingClass = "font-sans text-xs font-semibold tracking-widest text-teal-200 uppercase";

  return (
    <footer className="mt-auto bg-teal-900 text-teal-50">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-white">{siteName}</p>
          <p className="mt-2 text-sm text-teal-100">{t("tagline")}</p>
          <h2 className={`${headingClass} mt-8`}>{t("contactHeading")}</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm [&_.text-muted]:text-teal-200">
            <dt className="text-teal-200">{t("phone")}</dt>
            <dd>
              {verifiedValue(contact.phone) ? (
                <a className={linkClass} href={`tel:${verifiedValue(contact.phone)!.replace(/\s/g, "")}`}>
                  {verifiedValue(contact.phone)}
                </a>
              ) : (
                <PendingValue entry={contact.phone} label={t("phone")} />
              )}
            </dd>
            <dt className="text-teal-200">{t("email")}</dt>
            <dd>
              <PendingValue entry={contact.email} label={t("email")} />
            </dd>
            <dt className="text-teal-200">{t("line")}</dt>
            <dd>
              <PendingValue entry={contact.lineId} label={t("line")} />
            </dd>
            <dt className="text-teal-200">{t("address")}</dt>
            <dd>
              <PendingValue entry={contact.address} label={t("address")} />
            </dd>
            <dt className="text-teal-200">{t("hours")}</dt>
            <dd>
              <PendingValue entry={contact.openingHours} label={t("hours")} />
            </dd>
          </dl>
          {verifiedSocial.length > 0 && (
            <ul className="mt-6 flex gap-4">
              {verifiedSocial.map(([name, url]) => (
                <li key={name}>
                  <a className={linkClass} href={url!} rel="noopener noreferrer" target="_blank">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-labelledby="footer-quick-links">
          <h2 id="footer-quick-links" className={headingClass}>{t("quickLinks")}</h2>
          <ul className="mt-3 space-y-2">
            {mainNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className={headingClass}>{t("servicesHeading")}</h2>
          <ul className="mt-3 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={linkClass}>
                  {s.translations[locale]!.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className={headingClass}>{t("legalHeading")}</h2>
            <ul className="mt-3 space-y-2">
              {legalNav.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={linkClass}>
                    {tLegal(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-labelledby="footer-languages">
            <h2 id="footer-languages" className={headingClass}>{t("languagesHeading")}</h2>
            <ul className="mt-3 space-y-2">
              {locales.map((l) => (
                <li key={l}>
                  <Link href="/" locale={l} lang={l} hrefLang={l} className={linkClass}>
                    {tCommon(`languageNames.${l}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-teal-800">
        <Container className="flex flex-col gap-2 py-6 text-xs text-teal-200 sm:flex-row sm:justify-between">
          <p>{t("copyright", { year, siteName })}</p>
          <p>{t("medicalNote")}</p>
        </Container>
      </div>
    </footer>
  );
}
