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

const navLinkClass =
  "inline-flex min-h-11 items-center rounded-pill px-3.5 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-primary-soft hover:text-primary aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const services = await listServices(locale);

  const serviceItems = [
    { href: "/services", label: t("allServices") },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.translations[locale]!.title })),
  ];

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

      <div className="relative mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <SiteLogo />

        <nav aria-label={t("mainLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) => (
              <li key={item.key}>
                {item.key === "services" ? (
                  <NavDropdown label={t("services")} items={serviceItems} />
                ) : item.key === "contact" ? (
                  <NavLink
                    href={item.href}
                    className="ml-2 inline-flex min-h-11 items-center rounded-pill bg-primary px-5 text-[0.95rem] font-medium text-on-primary transition-colors hover:bg-primary-hover aria-[current=page]:bg-primary-hover"
                    activeClassName=""
                  >
                    {t(item.key)}
                  </NavLink>
                ) : (
                  <NavLink href={item.href} exact={item.href === "/"} className={navLinkClass} activeClassName="">
                    {t(item.key)}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav
          items={mobileItems}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          footer={
            <>
              <ButtonLink href={patientLoginHref} variant="secondary" size="lg">
                {t("patientLogin")}
              </ButtonLink>
              <LanguageSwitcher />
            </>
          }
        />
      </div>
    </header>
  );
}
