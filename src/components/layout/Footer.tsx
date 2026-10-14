import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cacheLife } from "next/cache";
import { Container } from "@/components/ui/Container";
import { clinicAssets } from "@/config/assets";
import { footerNav, legalNav } from "@/config/navigation";
import { clinicName, siteConfig, telHref, verifiedValue } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const socialKeys = ["instagram", "tiktok", "facebook"] as const;
const socialLabels: Record<(typeof socialKeys)[number], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export async function Footer({ locale }: { locale: Locale }) {
  const [t, tNav, tLegal, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Footer" }),
    getTranslations({ locale, namespace: "Nav" }),
    getTranslations({ locale, namespace: "Legal" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);
  const year = await currentYear();
  const name = clinicName(locale);
  const thaiName = clinicName("th");
  const { contact, social } = siteConfig;
  const phones = verifiedValue(contact.phones) ?? [];
  const address = verifiedValue(contact.address);
  const mapUrl = verifiedValue(contact.mapUrl);
  const { logo } = clinicAssets;

  const linkClass = "text-sm text-on-inverse/85 underline-offset-4 hover:text-on-inverse hover:underline";
  const headingClass = "text-xs font-semibold tracking-[0.18em] text-accent uppercase";

  return (
    <footer className="mt-auto bg-surface-inverse text-on-inverse">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="inline-block rounded-xl bg-surface-muted px-4 py-2">
            <span className="relative block aspect-[1593/640] w-[200px] overflow-hidden">
              <Image
                src={logo.src}
                alt={tCommon("logoAlt", { name })}
                width={logo.width}
                height={logo.height}
                quality={90}
                sizes="200px"
                className="absolute inset-0 h-full w-full object-cover object-[50%_53%]"
              />
            </span>
          </div>

          <h2 className={`${headingClass} mt-8`}>{t("contactHeading")}</h2>
          <address className="mt-4 space-y-3 not-italic">
            <p className="text-lg font-semibold" lang="th">{thaiName}</p>
            {address && (
              <p className="text-sm text-on-inverse/85" lang="th">
                {address}
              </p>
            )}
            {phones.length > 0 && (
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-on-inverse/70">{t("phone")}</span>
                {phones.map((phone) => (
                  <a key={phone} href={telHref(phone)} className="font-medium underline-offset-4 hover:underline">
                    {phone}
                  </a>
                ))}
              </p>
            )}
            {mapUrl && (
              <p>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {t("openMap")} ↗
                </a>
              </p>
            )}
          </address>

          <h2 className={`${headingClass} mt-8`}>{t("socialHeading")}</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {socialKeys.map((key) => {
              const url = verifiedValue(social[key]);
              return (
                <li key={key}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-pill border border-on-inverse/30 px-4 text-sm hover:bg-on-inverse/10"
                    >
                      {socialLabels[key]}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-dashed border-on-inverse/30 px-4 text-sm text-on-inverse/70">
                      {socialLabels[key]}
                      <span className="text-xs">({t("socialPending")})</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <nav aria-labelledby="footer-quick-links" className="lg:col-span-3">
          <h2 id="footer-quick-links" className={headingClass}>{t("quickLinks")}</h2>
          <ul className="mt-4 space-y-2.5">
            {footerNav.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 lg:col-span-4">
          <nav aria-labelledby="footer-legal">
            <h2 id="footer-legal" className={headingClass}>{t("legalHeading")}</h2>
            <ul className="mt-4 space-y-2.5">
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
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
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

      <div className="border-t border-on-inverse/15">
        <Container className="flex flex-col gap-2 py-6 text-xs text-on-inverse/75 sm:flex-row sm:justify-between">
          <p>{t("copyright", { year, siteName: name })}</p>
          <p>{t("medicalNote")}</p>
        </Container>
      </div>
    </footer>
  );
}
