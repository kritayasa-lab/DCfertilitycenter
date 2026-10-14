import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, patientLoginHref } from "@/config/navigation";
import { listServices } from "@/content/queries";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MobileNav, type MobileNavItem } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";
import { NavLink } from "./NavLink";
import { SiteLogo } from "./SiteLogo";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const services = await listServices(locale);

  const serviceItems = [
    { href: "/services", label: t("allServices") },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.translations[locale]!.title })),
  ];

  // "Contact" is presented as the call-to-action button rather than a nav link.
  const navItems = mainNav.filter((item) => item.key !== "contact");

  const mobileItems: MobileNavItem[] = mainNav.map((item) => ({
    href: item.href,
    label: t(item.key),
    children: item.key === "services" ? serviceItems.slice(1) : undefined,
  }));

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="hidden border-b border-border/70 lg:block">
        <div className="mx-auto flex max-w-content items-center justify-end gap-5 px-8 py-1.5 text-sm">
          <Link href={patientLoginHref} className="text-muted underline-offset-4 hover:text-primary hover:underline">
            {t("patientLogin")}
          </Link>
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <SiteLogo />

        <nav aria-label={t("mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                {item.key === "services" ? (
                  <NavDropdown label={t("services")} items={serviceItems} />
                ) : (
                  <NavLink
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-foreground hover:text-primary aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
                  >
                    {t(item.key)}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Wrapper avoids a display-utility conflict with the button's own inline-flex. */}
          <div className="hidden sm:block">
            <ButtonLink href="/contact">{t("contactCta")}</ButtonLink>
          </div>
          <MobileNav
            items={mobileItems}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
            footer={
              <>
                <ButtonLink href="/contact" size="lg">
                  {t("contactCta")}
                </ButtonLink>
                <ButtonLink href={patientLoginHref} variant="secondary" size="lg">
                  {t("patientLogin")}
                </ButtonLink>
                <LanguageSwitcher />
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
